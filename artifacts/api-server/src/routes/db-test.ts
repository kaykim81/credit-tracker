router.get('/db-test', async (req, res) => {
  try {
    // Replace 'users' with one of your actual table names
    const result = await db.select().from(users).limit(1);
    res.json({ status: "Connected to DB", data: result });
  } catch (err) {
    res.status(500).json({ status: "DB Error", error: err.message });
  }
});
