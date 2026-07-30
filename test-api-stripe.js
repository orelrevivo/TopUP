const { neon } = require('@neondatabase/serverless');
async function run() {
  const accountRes = await fetch(`https://api.stripe.com/v1/accounts/acct_1TxeTd6IP6KgXvo5`, {
    headers: { Authorization: `Bearer ${process.env.STRIPE_SECRET_KEY}` }
  });
  const data = await accountRes.json();
  console.log(JSON.stringify(data, null, 2));
}
run();
