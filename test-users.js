const { db } = require('./apps/falbor/app/lib/visual-editor/db');
const { users } = require('./apps/falbor/app/lib/db/schema');

async function test() {
  const allUsers = await db.query.users.findMany();
  console.log('All Users:', allUsers.map(u => ({ email: u.email, role: u.role, agencyId: u.agencyId })));
}
test();
