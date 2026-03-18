import { db, personsTable } from "@workspace/db";

export async function seedPersons() {
  const existing = await db.select().from(personsTable);
  if (existing.length === 0) {
    await db.insert(personsTable).values([
      { name: "민서" },
      { name: "성한" },
    ]);
    console.log("Seeded default persons: 민서, 성한");
  }
}
