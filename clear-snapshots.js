import { createClient } from "@libsql/client";
const client = createClient({ url: "file:local.db" });
async function run() {
  await client.execute("DELETE FROM chat_snapshots;");
  console.log("All snapshots cleared!");
}
run();
