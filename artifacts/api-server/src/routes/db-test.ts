import { Router } from 'express';
import { db } from '@workspace/db';
import { sql } from 'drizzle-orm';

export const dbTestRouter = Router();

dbTestRouter.get('/db-test', async (req, res) => {
  try {
    // This runs a "SELECT 1" query - the simplest way to check a connection
    const result = await db.execute(sql`SELECT 1 as connection_test`);
    
    res.json({
      status: "success",
      message: "Database connection is healthy",
      data: result.rows
    });
  } catch (error: any) {
    console.error("DB Test Error:", error);
    res.status(500).json({
      status: "error",
      message: "Failed to connect to database",
      error: error.message
    });
  }
});
