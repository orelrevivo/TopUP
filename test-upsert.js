const { db } = require('./apps/falbor/app/lib/visual-editor/db');
const { veSubAccounts } = require('./apps/falbor/app/lib/db/schema');
const { v4 } = require('uuid');

async function test() {
  const id = v4();
  const subAccount = {
    id,
    address: '123 Test St',
    subAccountLogo: '',
    city: 'Test City',
    companyPhone: '1234567890',
    country: 'Test Country',
    name: 'Test SubAccount',
    state: 'Test State',
    zipCode: '12345',
    createdAt: new Date(),
    updatedAt: new Date(),
    companyEmail: 'test@example.com',
    agencyId: '1c4177a2-cf00-461c-a9f9-6562625b273e', // From the user's url
    connectAccountId: '',
    goal: 5000,
    paypalClientId: ''
  };

  try {
    const response = await db.insert(veSubAccounts).values(subAccount).onConflictDoUpdate({
      target: veSubAccounts.id,
      set: subAccount
    }).returning();
    console.log('Success:', response);
  } catch (err) {
    console.log('Error:', err.message);
  }
}
test();
