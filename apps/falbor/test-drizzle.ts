import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./app/lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  try {
    const insertData = {
      id: "ff4f4ab3-763d-4498-a7ec-955045c73ca7",
      name: "Falbor Test",
      agencyLogo: "test",
      companyEmail: "test@test.com",
      companyPhone: "test",
      whiteLabel: true,
      address: "test",
      city: "test",
      zipCode: "test",
      state: "test",
      country: "test",
      goal: 5,
      connectAccountId: "",
      customerId: "cus_mock_test",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    console.log("Attempting to insert:", insertData);
    const [inserted] = await db.insert(schema.veAgencies).values(insertData).returning();
    console.log("Success:", inserted);
  } catch (error) {
    console.error("Failed:", error);
  }
}

main();
