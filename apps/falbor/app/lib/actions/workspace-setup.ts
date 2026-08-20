'use server'

import { db } from '~/lib/visual-editor/db'
import { v4 } from 'uuid'
import { veAgencies, veSubAccounts, vePermissions, users } from '~/lib/db/schema'
import { eq } from 'drizzle-orm'
import { getAuthUserDetails } from '~/lib/visual-editor/queries'

export async function autoSetupVisualEditorWorkspace() {
  const authUser = await getAuthUserDetails()
  if (!authUser) {
    throw new Error('User not authenticated')
  }

  let user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, authUser.email),
  })

  if (!user) {
    // If the user isn't in DB yet, create them.
    await db.insert(users).values({
      id: v4(),
      displayName: authUser.displayName || 'Unknown',
      avatarUrl: authUser.avatarUrl || '',
      email: authUser.email,
      role: 'AGENCY_OWNER',
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    
    user = await db.query.users.findFirst({
      where: (table, { eq }) => eq(table.email, authUser.email),
    });
    if (!user) throw new Error('Failed to create user record');
  }

  // Check if they already have an agency
  if (user.agencyId) {
    // They have an agency. Check if they have a subaccount
    const agency = await db.query.veAgencies.findFirst({
      where: (table, { eq }) => eq(table.id, user!.agencyId as string),
      with: { SubAccount: true },
    })

    if (agency) {
      if (agency.SubAccount && agency.SubAccount.length > 0) {
        return { agencyId: agency.id, subAccountId: agency.SubAccount[0].id }
      }
      
      // Has agency, no subaccount, let's create one
      const subAccountId = v4()
      await db.insert(veSubAccounts).values({
        id: subAccountId,
        name: `${authUser.displayName || authUser.email}'s Auto SubAccount`,
        subAccountLogo: authUser.avatarUrl || '',
        companyEmail: authUser.email,
        companyPhone: '0000000000',
        address: 'Auto Address',
        city: 'Auto City',
        zipCode: '00000',
        state: 'Auto State',
        country: 'Auto Country',
        agencyId: agency.id,
      })
      await db.insert(vePermissions).values({
        id: v4(),
        email: authUser.email,
        subAccountId: subAccountId,
        access: true,
      })
      return { agencyId: agency.id, subAccountId }
    }
  }

  const agencyId = v4()
  const subAccountId = v4()

  await db.insert(veAgencies).values({
    id: agencyId,
    name: `${authUser.displayName || authUser.email}'s Auto Agency`,
    agencyLogo: authUser.avatarUrl || '',
    companyEmail: authUser.email,
    companyPhone: '0000000000',
    whiteLabel: false,
    address: 'Auto Address',
    city: 'Auto City',
    zipCode: '00000',
    state: 'Auto State',
    country: 'Auto Country',
  })

  await db.update(users).set({ agencyId, role: 'AGENCY_OWNER' }).where(eq(users.email, authUser.email))

  await db.insert(veSubAccounts).values({
    id: subAccountId,
    name: `${authUser.displayName || authUser.email}'s Auto SubAccount`,
    subAccountLogo: authUser.avatarUrl || '',
    companyEmail: authUser.email,
    companyPhone: '0000000000',
    address: 'Auto Address',
    city: 'Auto City',
    zipCode: '00000',
    state: 'Auto State',
    country: 'Auto Country',
    agencyId: agencyId,
  })

  await db.insert(vePermissions).values({
    id: v4(),
    email: authUser.email,
    subAccountId: subAccountId,
    access: true,
  })

  return { agencyId, subAccountId }
}

export async function getUserLatestSubaccount() {
  const authUser = await getAuthUserDetails()
  if (!authUser) throw new Error('Not authenticated')

  // We need to find the user's agency, then their subaccounts
  const user = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.email, authUser.email),
  })

  if (!user || !user.agencyId) {
    throw new Error('No agency found')
  }

  const agency = await db.query.veAgencies.findFirst({
    where: (table, { eq }) => eq(table.id, user.agencyId as string),
    with: { SubAccount: true },
  })

  if (!agency || !agency.SubAccount || agency.SubAccount.length === 0) {
    throw new Error('No subaccount found')
  }

  // Return the latest one (or just the first one)
  return agency.SubAccount[0].id
}
