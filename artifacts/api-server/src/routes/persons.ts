import { Router, type IRouter } from "express";
import { db, personsTable, creditEntriesTable, insertPersonSchema } from "@workspace/db";
import { eq, sum } from "drizzle-orm";
import {
  CreatePersonBody,
  GetPersonParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/persons", async (_req, res) => {
  const persons = await db.select().from(personsTable);

  const result = await Promise.all(
    persons.map(async (person) => {
      const earned = await db
        .select({ total: sum(creditEntriesTable.amount) })
        .from(creditEntriesTable)
        .where(eq(creditEntriesTable.personId, person.id));

      const earnedTotal = earned[0]?.total ? Number(earned[0].total) : 0;

      const usedResult = await db
        .select({ total: sum(creditEntriesTable.amount) })
        .from(creditEntriesTable)
        .where(eq(creditEntriesTable.personId, person.id));

      const entries = await db
        .select()
        .from(creditEntriesTable)
        .where(eq(creditEntriesTable.personId, person.id));

      let totalScore = 0;
      for (const entry of entries) {
        if (entry.type === "earned") {
          totalScore += entry.amount;
        } else {
          totalScore -= entry.amount;
        }
      }

      return {
        id: person.id,
        name: person.name,
        totalScore,
        createdAt: person.createdAt.toISOString(),
      };
    })
  );

  res.json(result);
});

router.post("/persons", async (req, res) => {
  const body = CreatePersonBody.parse(req.body);
  const [person] = await db.insert(personsTable).values({ name: body.name }).returning();
  res.status(201).json({
    id: person.id,
    name: person.name,
    totalScore: 0,
    createdAt: person.createdAt.toISOString(),
  });
});

router.get("/persons/:personId", async (req, res) => {
  const { personId } = GetPersonParams.parse(req.params);
  const [person] = await db
    .select()
    .from(personsTable)
    .where(eq(personsTable.id, personId));

  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  const entries = await db
    .select()
    .from(creditEntriesTable)
    .where(eq(creditEntriesTable.personId, person.id));

  let totalScore = 0;
  for (const entry of entries) {
    if (entry.type === "earned") {
      totalScore += entry.amount;
    } else {
      totalScore -= entry.amount;
    }
  }

  res.json({
    id: person.id,
    name: person.name,
    totalScore,
    createdAt: person.createdAt.toISOString(),
  });
});

export default router;
