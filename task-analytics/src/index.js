import express from "express";
import mysql from "mysql2/promise";
import dotenv from "dotenv";
dotenv.config();

const app = express();
app.use(express.json());

const pool = mysql.createPool(process.env.MYSQL_URI);

app.post("/post-analytics", async (req, res) => {
  const { taskId, completedAt, status, userId } = req.body;
  try {
    await pool.query(
      "INSERT INTO analytics (taskId, status, completedAt, userId) VALUES (?, ?, ?, ?)",
      [taskId, status, completedAt, userId]
    );
    res.status(201).send("Analytics entry created");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving analytics");
  }
});

app.get("/get-analytics", async (req, res) => {
  try {
    const [rows] = await pool.query(
      `SELECT userId, COUNT(*) AS completedCount
       FROM analytics
       WHERE status = 'completed'
       GROUP BY userId`
    );
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching analytics");
  }
});

app.listen(process.env.PORT, () =>
  console.log(
    `Analytics service running on http://localhost:${process.env.PORT}`
  )
);
