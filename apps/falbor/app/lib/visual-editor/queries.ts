'use server'

import { getCurrentUserId } from '~/lib/auth/server'
import { db } from '~/lib/db'
import { redirect } from 'next/navigation'
import {
  users,
  veAgencies,
  veSubAccounts,
  vePermissions,
  veFunnels,
  veFunnelPages,
  veFunnelsProduct,
  veContacts,
  vePipelines,
  veLanes,
  veTickets,
  veTags,
  veTriggers,
  veAutomations,
  Agency,
  Lane,
  Plan,
  Prisma,
  Role,
  SubAccount,
  Tag,
  Ticket,
  User,
} from '~/lib/db/schema'
import { eq, and, inArray, asc } from 'drizzle-orm'
import { v4 } from 'uuid'
import {
  CreateFunnelFormSchema,
  CreateMediaType,
  UpsertFunnelPage,
} from './types'
import { z } from 'zod'
import { revalidatePath } from 'next/cache'
import { cache } from 'react'

 const _getAuthUserDetails = cache(async () => {
  const userId = await getCurrentUserId()
  if (!userId) {
    return
  }

  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  if (userData) {
    let agency = null
    if (userData.agencyId) {
      // Fetch agency then SubAccounts separately (avoids Drizzle relational query issue)
      const agencyData = await db.query.veAgencies.findFirst({
        where: eq(veAgencies.id, userData.agencyId),
      })
      if (agencyData) {
        const subAccounts = await db.query.veSubAccounts.findMany({
          where: eq(veSubAccounts.agencyId, userData.agencyId),
        })
        agency = {
          ...agencyData,
          SubAccount: subAccounts,
          SidebarOption: [],
        }
      }
    }
    return { ...userData, Agency: agency, Permissions: [] }
  }

  return null
})

export const getAuthUserDetails = async () => {
  return await _getAuthUserDetails()
}

export const __getUsersWithAgencySubAccountPermissionsSidebarOptions = async (
  agencyId: string
) => {
  return await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.Agency, { id: agencyId }),
    with: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  })
}

export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subaccountId,
}: {
  agencyId?: string
  description: string
  subaccountId?: string
}) => {
  const userId = await getCurrentUserId()
  let userData
  if (!userId) {
    // If no user, mock for now
    console.log('No user for activity log')
  } else {
    userData = await db.query.users.findFirst({
      where: eq(users.id, userId)
    })
  }

  if (!userData) {
    console.log('Could not find a user')
    return
  }

  let foundAgencyId = agencyId
  if (!foundAgencyId) {
    if (!subaccountId) {
      throw new Error(
        'You need to provide atleast an agency Id or subaccount Id'
      )
    }
    const response = await db.query.veSubAccounts.findFirst({
      where: (table, { eq }) => eq(table.id, subaccountId),
    })
    if (response) foundAgencyId = response.agencyId
  }
  // Activity logging will be re-implemented with Drizzle relations
  console.log(`Log Activity: ${userData.name} | ${description}`)
}

export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === 'AGENCY_OWNER') return null
  const response = await db.query.users.upsert({
    where: { email: user.email },
    update: {
      name: user.name,
      avatarUrl: user.avatarUrl,
      role: user.role,
      agencyId: user.agencyId,
    },
    create: {
      id: user.id,
      name: user.name,
      avatarUrl: user.avatarUrl,
      email: user.email,
      role: user.role,
      agencyId: user.agencyId,
    },
  })
  return response
}

const _verifyAndAcceptInvitation = cache(async () => {
  const userId = await getCurrentUserId()
  if (!userId) return redirect('/sign-in')
  
  const user = await db.query.users.findFirst({
    where: eq(users.id, userId)
  })
  
  return user ? user.agencyId : null
})

export const verifyAndAcceptInvitation = async () => {
  return await _verifyAndAcceptInvitation()
}

export const updateAgencyDetails = async (
  agencyId: string,
  agencyDetails: Partial<Agency>
) => {
  const response = await db.query.veAgencies.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  })
  return response
}

export const deleteAgency = async (agencyId: string) => {
  const response = await db.delete(veAgencies).where(eq(veAgencies.id, agencyId))
  return response
}

export const initUser = async (newUser: Partial<User>) => {
  const userId = await getCurrentUserId()
  if (!userId) return

  const userData = await db.query.users.findFirst({
    where: eq(users.id, userId),
  })

  // We skip UPSERT for now since Drizzle doesn't do Prisma-style upserts easily
  return userData
}

export const upsertAgency = async (agency: Agency, price?: Plan) => {
  require('fs').writeFileSync('payload.json', JSON.stringify(agency, null, 2))
  if (!agency.companyEmail) return null
  try {
    const existing = await db.query.veAgencies.findFirst({
      where: eq(veAgencies.id, agency.id)
    });
    let agencyDetails;
    
    const insertData = {
      id: agency.id,
      name: agency.name,
      agencyLogo: agency.agencyLogo,
      companyEmail: agency.companyEmail,
      companyPhone: agency.companyPhone,
      whiteLabel: agency.whiteLabel,
      address: agency.address,
      city: agency.city,
      zipCode: agency.zipCode,
      state: agency.state,
      country: agency.country,
      goal: agency.goal,
      connectAccountId: agency.connectAccountId,
      customerId: agency.customerId,
      createdAt: agency.createdAt ? new Date(agency.createdAt) : new Date(),
      updatedAt: agency.updatedAt ? new Date(agency.updatedAt) : new Date(),
    };

    if (existing) {
      await db.update(veAgencies).set(insertData).where(eq(veAgencies.id, agency.id));
      agencyDetails = insertData;
    } else {
      const [inserted] = await db.insert(veAgencies).values(insertData).returning();
      agencyDetails = inserted;
      
      const userId = await getCurrentUserId();
      if (userId) {
        await db.update(users).set({ agencyId: agency.id, role: 'AGENCY_OWNER' }).where(eq(users.id, userId));
      }
    }
    return agencyDetails;
  } catch (error) {
    console.log(error)
    return null
  }
}

const _getNotificationAndUser = cache(async (agencyId: string) => {
  try {
    // TODO: Re-implement with Drizzle when veNotifications is added to schema.ts
    // For now, return empty array to prevent layout crash
    return []
  } catch (error) {
    console.log(error)
  }
})

export const getNotificationAndUser = async (agencyId: string) => {
  return await _getNotificationAndUser(agencyId)
}

export const deleteNotification = async (notificationId: string) => {
  try {
    const response = await db.notification.delete({
      where: {
        id: notificationId,
      },
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const deleteAllNotifications = async (agencyId: string) => {
  try {
    const response = await db.notification.deleteMany({
      where: {
        agencyId,
      },
    })
    return response
  } catch (error) {
    console.log(error)
  }
}

export const markNotificationAsRead = async (notificationId: string) => {
  try {
    const response = await db.notification.update({
      where: {
        id: notificationId,
      },
      data: {
        isRead: true,
      },
    })
    return response
  } catch (error) {
    console.log(error)
  }
}


export const upsertSubAccount = async (subAccount: SubAccount) => {
  console.log('🔴 RECEIVED SUBACCOUNT DATA:', subAccount)
  if (!subAccount || !subAccount.companyEmail) {
    console.log('🔴 Error: No company email provided in', subAccount)
    return null
  }
  
  const agencyOwner = await db.query.users.findFirst({
    where: (table, { eq, and }) => and(
      eq(table.agencyId, subAccount.agencyId), 
      eq(table.role, 'AGENCY_OWNER')
    ),
  })
  
  if (!agencyOwner) {
    console.log('🔴 Error: Could not find AGENCY_OWNER for agencyId:', subAccount.agencyId)
    return null
  }
  
  try {
    const response = await db
      .insert(veSubAccounts)
      .values(subAccount)
      .onConflictDoUpdate({
        target: veSubAccounts.id,
        set: subAccount,
      })
      .returning()
      
    if (response && response.length > 0) {
      const perm = await db.query.vePermissions.findFirst({
        where: (table, { eq, and }) => and(eq(table.subAccountId, subAccount.id), eq(table.email, agencyOwner.email))
      })
      
      if (!perm) {
        await db.insert(vePermissions).values({
          id: v4(),
          subAccountId: subAccount.id,
          email: agencyOwner.email,
          access: true,
        })
      }
      
      return response[0]
    }
  } catch (err) {
    console.log('🔴 Drizzle Error in upsertSubAccount:', err)
  }
  return null
}

export const getUserPermissions = async (userId: string) => {
  const response = await db.query.users.findFirst({
    where: (table, { eq }) => eq(table.id, userId),
    select: { Permissions: { include: { SubAccount: true } } },
  })

  return response
}

export const updateUser = async (user: Partial<User>) => {
  const response = await db.query.users.update({
    where: { email: user.email },
    data: { ...user },
  })

  await (await clerkClient()).users.updateUserMetadata(response.id, {
    privateMetadata: {
      role: user.role || 'SUBACCOUNT_USER',
    },
  })

  return response
}

export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean
) => {
  try {
    const response = await db.query.vePermissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    })
    return response
  } catch (error) {
    console.log('🔴Could not change persmission', error)
  }
}

export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await db.query.veSubAccounts.findFirst({
    where: (table, { eq }) => eq(table.id, subaccountId),
  })
  return response
}

export const deleteSubAccount = async (subaccountId: string) => {
  const response = await db.query.veSubAccounts.delete({
    where: {
      id: subaccountId,
    },
  })
  return response
}

export const deleteUser = async (userId: string) => {
  await (await clerkClient()).users.updateUserMetadata(userId, {
    privateMetadata: {
      role: undefined,
    },
  })
  const deletedUser = await db.query.users.delete({ where: { id: userId } })

  return deletedUser
}

export const getUser = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: {
      id,
    },
  })

  return user
}

export const sendInvitation = async (
  role: Role,
  email: string,
  agencyId: string
) => {
  const resposne = await db.invitation.upsert({
    where: { email },
    update: { agencyId, role },
    create: { email, agencyId, role },
  })

  try {
    await (await clerkClient()).invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    })
  } catch (error: any) {
    // If Clerk says they're already invited, we just ignore the error
    if (error?.errors?.[0]?.code === 'already_invited') {
      console.log('User already invited in Clerk')
    } else {
      console.log('Clerk Invitation Error:', error)
      // We don't re-throw here to allow the database record to stay successful
    }
  }

  return resposne
}

export const getMedia = async (subaccountId: string) => {
  // Media table not yet implemented in Drizzle schema — return stub
  return null
}

export const createMedia = async (
  subaccountId: string,
  mediaFile: CreateMediaType
) => {
  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      subAccountId: subaccountId,
    },
  })

  return response
}

export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  })
  return response
}

export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.query.vePipelines.findFirst({
    where: (table, { eq }) => eq(table.id, pipelineId),
  })
  return response
}

export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  // Two-step plain query — Tags/Assigned/Customer relations not yet in schema
  const lanes = await db.query.veLanes.findMany({
    where: (table, { eq }) => eq(table.pipelineId, pipelineId),
  })
  const laneIds = lanes.map((l) => l.id)
  const tickets = laneIds.length > 0
    ? await db.query.veTickets.findMany({
        where: (table, { inArray }) => inArray(table.laneId, laneIds),
      })
    : []
  return lanes
    .sort((a, b) => a.order - b.order)
    .map((lane) => ({
      ...lane,
      Tickets: tickets.filter((t) => t.laneId === lane.id).sort((a, b) => a.order - b.order),
    }))
}

export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & { liveProducts: string },
  funnelId: string
) => {
  const insertData = {
    name: funnel.name || 'Untitled Funnel',
    description: funnel.description || '',
    subDomainName: funnel.subDomainName || null,
    favicon: funnel.favicon || null,
    liveProducts: funnel.liveProducts || '[]',
    id: funnelId || v4(),
    subAccountId: subaccountId,
  }

  const response = await db
    .insert(veFunnels)
    .values(insertData)
    .onConflictDoUpdate({
      target: veFunnels.id,
      set: insertData,
    })
    .returning()

  return response[0]
}

export const upsertPipeline = async (
  pipeline: Prisma.PipelineUncheckedCreateWithoutLaneInput
) => {
  const response = await db.query.vePipelines.upsert({
    where: { id: pipeline.id || v4() },
    update: pipeline,
    create: pipeline,
  })

  return response
}

export const deletePipeline = async (pipelineId: string) => {
  const response = await db.query.vePipelines.delete({
    where: { id: pipelineId },
  })
  return response
}

export const updateLanesOrder = async (lanes: Lane[]) => {
  try {
    const updateTrans = lanes.map((lane) =>
      db.query.veLanes.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      })
    )

    await db.$transaction(updateTrans)
    console.log('🟢 Done reordered 🟢')
  } catch (error) {
    console.log(error, 'ERROR UPDATE LANES ORDER')
  }
}

export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.query.veTickets.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      })
    )

    await db.$transaction(updateTrans)
    console.log('🟢 Done reordered 🟢')
  } catch (error) {
    console.log(error, '🔴 ERROR UPDATE TICKET ORDER')
  }
}

export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number

  if (!lane.order) {
    const lanes = await db.query.veLanes.findMany({
      where: (table, { eq }) => eq(table.pipelineId, lane.pipelineId),
    })

    order = lanes.length
  } else {
    order = lane.order
  }

  const response = await db.query.veLanes.upsert({
    where: { id: lane.id || v4() },
    update: lane,
    create: { ...lane, order },
  })

  return response
}

export const deleteLane = async (laneId: string) => {
  const resposne = await db.query.veLanes.delete({ where: { id: laneId } })
  return resposne
}

export const getTicketsWithTags = async (pipelineId: string) => {
  // Tags/Assigned/Customer relations not yet in schema — return plain tickets
  const lanes = await db.query.veLanes.findMany({
    where: (table, { eq }) => eq(table.pipelineId, pipelineId),
  })
  const laneIds = lanes.map((l) => l.id)
  if (!laneIds.length) return []
  const tickets = await db.query.veTickets.findMany({
    where: (table, { inArray }) => inArray(table.laneId, laneIds),
  })
  return tickets.map((t) => ({ ...t, Tags: [], Assigned: null, Customer: null }))
}

export const _getTicketsWithAllRelations = async (laneId: string) => {
  const tickets = await db.query.veTickets.findMany({
    where: (table, { eq }) => eq(table.laneId, laneId),
  })
  return tickets.map((t) => ({ ...t, Tags: [], Assigned: null, Customer: null, Lane: null }))
}

export const getSubAccountTeamMembers = async (subaccountId: string) => {
  const subaccountUsersWithAccess = await db.query.users.findMany({
    where: (table, { eq, and }) => and(eq(table.Agency, {
            SubAccount: {
              some: {
                id: subaccountId,
              },
            },
          }), eq(table.role, 'SUBACCOUNT_USER'), eq(table.Permissions, {
            some: {
              subAccountId: subaccountId,
              access: true,
            },
          })),
  })
  return subaccountUsersWithAccess
}

export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: (table, { eq }) => eq(table.name, {
            contains: searchTerms,
          }),
  })
  return response
}

export const upsertTicket = async (
  ticket: Prisma.TicketUncheckedCreateInput,
  tags: Tag[]
) => {
  let order: number
  if (!ticket.order) {
    const tickets = await db.query.veTickets.findMany({
      where: (table, { eq }) => eq(table.laneId, ticket.laneId),
    })
    order = tickets.length
  } else {
    order = ticket.order
  }

  const response = await db.query.veTickets.upsert({
    where: {
      id: ticket.id || v4(),
    },
    update: { ...ticket, Tags: { set: tags } },
    create: { ...ticket, Tags: { connect: tags }, order },
    include: {
      Assigned: true,
      Customer: true,
      Tags: true,
      Lane: true,
    },
  })

  return response
}

export const deleteTicket = async (ticketId: string) => {
  const response = await db.query.veTickets.delete({
    where: {
      id: ticketId,
    },
  })

  return response
}

export const upsertTag = async (
  subaccountId: string,
  tag: Prisma.TagUncheckedCreateInput
) => {
  const response = await db.tag.upsert({
    where: { id: tag.id || v4(), subAccountId: subaccountId },
    update: tag,
    create: { ...tag, subAccountId: subaccountId },
  })

  return response
}

export const getTagsForSubaccount = async (subaccountId: string) => {
  const response = await db.query.veSubAccounts.findFirst({
    where: (table, { eq }) => eq(table.id, subaccountId),
    select: { Tags: true },
  })
  return response
}

export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({ where: { id: tagId } })
  return response
}

export const upsertContact = async (
  contact: Prisma.ContactUncheckedCreateInput
) => {
  const insertData = {
    id: contact.id || v4(),
    name: contact.name,
    email: contact.email,
    subAccountId: contact.subAccountId,
  }

  const response = await db
    .insert(veContacts)
    .values(insertData)
    .onConflictDoUpdate({
      target: veContacts.id,
      set: insertData,
    })
    .returning()
  return response[0]
}

export const getFunnels = async (subacountId: string) => {
  const funnels = await db.query.veFunnels.findMany({
    where: (table, { eq }) => eq(table.subAccountId, subacountId),
  })
  const funnelIds = funnels.map((f) => f.id)
  const pages = funnelIds.length > 0
    ? await db.select().from(veFunnelPages).where(inArray(veFunnelPages.funnelId, funnelIds))
    : []
  return funnels.map((f) => ({
    ...f,
    FunnelPages: pages.filter((p) => p.funnelId === f.id),
  }))
}

export const getFunnel = async (funnelId: string) => {
  const funnel = await db.query.veFunnels.findFirst({
    where: (table, { eq }) => eq(table.id, funnelId),
  })
  if (!funnel) return null
  const pages = await db.select().from(veFunnelPages)
    .where(eq(veFunnelPages.funnelId, funnelId))
    .orderBy(asc(veFunnelPages.order))
  return { ...funnel, FunnelPages: pages }
}

export const updateFunnelProducts = async (
  products: string,
  funnelId: string
) => {
  const data = await db
    .update(veFunnels)
    .set({ liveProducts: products })
    .where(eq(veFunnels.id, funnelId))
    .returning()
  return data[0]
}

export const upsertFunnelPage = async (
  subaccountId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string
) => {
  if (!subaccountId || !funnelId) return

  const insertData = {
    id: funnelPage.id || v4(),
    name: funnelPage.name || 'New Page',
    pathName: funnelPage.pathName || '',
    visits: funnelPage.visits || 0,
    content: funnelPage.content || JSON.stringify([
      {
        content: [],
        id: '__body',
        name: 'Body',
        styles: { backgroundColor: 'white' },
        type: '__body',
      },
    ]),
    order: funnelPage.order ?? 0,
    previewImage: funnelPage.previewImage || null,
    funnelId: funnelId,
  }

  const response = await db
    .insert(veFunnelPages)
    .values(insertData)
    .onConflictDoUpdate({
      target: veFunnelPages.id,
      set: insertData,
    })
    .returning()

  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`, 'page')
  return response[0]
}

export const deleteFunnelePage = async (funnelPageId: string) => {
  const response = await db
    .delete(veFunnelPages)
    .where(eq(veFunnelPages.id, funnelPageId))
    .returning()
  return response[0]
}

export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.query.veFunnelPages.findFirst({
    where: (table, { eq }) => eq(table.id, funnelPageId),
  })

  return response
}

export const getDomainContent = async (subDomainName: string) => {
  const funnel = await db.query.veFunnels.findFirst({
    where: (table, { eq }) => eq(table.subDomainName, subDomainName),
  })
  if (!funnel) return null
  const pages = await db.select().from(veFunnelPages).where(eq(veFunnelPages.funnelId, funnel.id))
  return { ...funnel, FunnelPages: pages }
}

export const getPipelines = async (subaccountId: string) => {
  const pipelines = await db.query.vePipelines.findMany({
    where: (table, { eq }) => eq(table.subAccountId, subaccountId),
  })
  const pipelineIds = pipelines.map((p) => p.id)
  const lanes = pipelineIds.length > 0
    ? await db.query.veLanes.findMany({
        where: (table, { inArray }) => inArray(table.pipelineId, pipelineIds),
      })
    : []
  const laneIds = lanes.map((l) => l.id)
  const tickets = laneIds.length > 0
    ? await db.query.veTickets.findMany({
        where: (table, { inArray }) => inArray(table.laneId, laneIds),
      })
    : []
  return pipelines.map((p) => ({
    ...p,
    Lane: lanes
      .filter((l) => l.pipelineId === p.id)
      .map((l) => ({ ...l, Tickets: tickets.filter((t) => t.laneId === l.id) })),
  }))
}

export const savePayPalConfig = async (
  subaccountId: string,
  paypalClientId: string
) => {
  const response = await db.query.veSubAccounts.update({
    where: { id: subaccountId },
    data: { paypalClientId },
  })
  return response
}

export const upsertFunnelProduct = async (product: Prisma.FunnelProductUncheckedCreateInput) => {
  const insertData = {
    name: product.name,
    price: product.price,
    priceId: product.priceId,
    subAccountId: product.subAccountId,
    id: product.id || v4(),
  }

  const response = await db
    .insert(veFunnelsProduct)
    .values(insertData)
    .onConflictDoUpdate({
      target: veFunnelsProduct.id,
      set: insertData,
    })
    .returning()
  return response[0]
}

export const getFunnelProducts = async (subaccountId: string) => {
  const response = await db.query.veFunnelsProduct.findMany({
    where: (table, { eq }) => eq(table.subAccountId, subaccountId),
  })
  return response
}

export const getAutomations = async (subaccountId: string) => {
  const response = await db.query.veAutomations.findMany({
    where: (table, { eq }) => eq(table.subAccountId, subaccountId),
    with: {
      Trigger: true,
      Action: true,
    },
  })
  return response
}

export const upsertAutomation = async (automation: Prisma.AutomationUncheckedCreateInput) => {
  const response = await db.query.veAutomations.upsert({
    where: { id: automation.id || v4() },
    update: automation,
    create: { ...automation, id: automation.id || v4() },
  })
  return response
}

export const upsertTrigger = async (trigger: Prisma.TriggerCreateInput) => {
  const response = await db.query.veTriggers.upsert({
    where: { id: (trigger as any).id || v4() },
    update: trigger,
    create: { ...trigger, id: (trigger as any).id || v4() },
  })
  return response
}

export const upsertAction = async (action: Prisma.ActionUncheckedCreateInput) => {
  const response = await db.action.upsert({
    where: { id: action.id || v4() },
    update: action,
    create: { ...action, id: action.id || v4() },
  })
  return response
}
