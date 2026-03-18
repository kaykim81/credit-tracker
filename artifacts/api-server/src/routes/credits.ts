import { Router, type IRouter } from "express";
import { db, creditEntriesTable, personsTable } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import {
  AddCreditParams,
  AddCreditBody,
  GetCreditsParams,
  DeleteCreditParams,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/persons/:personId/credits", async (req, res) => {
  const { personId } = GetCreditsParams.parse(req.params);

  const entries = await db
    .select()
    .from(creditEntriesTable)
    .where(eq(creditEntriesTable.personId, personId))
    .orderBy(desc(creditEntriesTable.createdAt));

  res.json(
    entries.map((e) => ({
      id: e.id,
      personId: e.personId,
      amount: e.amount,
      reason: e.reason,
      type: e.type,
      createdAt: e.createdAt.toISOString(),
    }))
  );
});

router.post("/persons/:personId/credits", async (req, res) => {
  const { personId } = AddCreditParams.parse(req.params);
  const body = AddCreditBody.parse(req.body);

  const [person] = await db
    .select()
    .from(personsTable)
    .where(eq(personsTable.id, personId));

  if (!person) {
    res.status(404).json({ error: "Person not found" });
    return;
  }

  const [entry] = await db
    .insert(creditEntriesTable)
    .values({
      personId,
      amount: body.amount,
      reason: body.reason,
      type: body.type,
    })
    .returning();

  res.status(201).json({
    id: entry.id,
    personId: entry.personId,
    amount: entry.amount,
    reason: entry.reason,
    type: entry.type,
    createdAt: entry.createdAt.toISOString(),
  });
});

router.delete("/credits/:creditId", async (req, res) => {
  const { creditId } = DeleteCreditParams.parse(req.params);

  const [entry] = await db
    .delete(creditEntriesTable)
    .where(eq(creditEntriesTable.id, creditId))
    .returning();

  if (!entry) {
    res.status(404).json({ error: "Credit entry not found" });
    return;
  }

  res.json({
    id: entry.id,
    personId: entry.personId,
    amount: entry.amount,
    reason: entry.reason,
    type: entry.type,
    createdAt: entry.createdAt.toISOString(),
  });
});

export default router;
