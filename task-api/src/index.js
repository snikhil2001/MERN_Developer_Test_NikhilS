import express from "express";
import { createHandler } from "graphql-http/lib/use/express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import { schema } from "./resolvers/taskResolvers.js";
import redis from "./lib/redis.js";

const app = express();
app.use(cors());
app.use(express.json());
dotenv.config();

app.get("/", (req, res) => {
  return res.send("Hello");
});

app.all("/graphql", createHandler({ schema }));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");

    redis.ping().then((res) => {
      console.log("Redis PING:", res);
    });

    app.listen(4000, () =>
      console.log("Server running on http://localhost:4000/graphql")
    );
  })
  .catch((err) => console.error(err));
