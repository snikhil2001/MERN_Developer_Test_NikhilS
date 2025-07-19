import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";
import { TaskModel } from "../models/task.model.js";
import axios from "axios";
import redis from "../lib/redis.js";

const TaskOutputType = new GraphQLObjectType({
  name: "TaskOutput",
  fields: () => ({
    id: { type: GraphQLID },
    title: { type: GraphQLString },
    description: { type: GraphQLString },
    status: { type: GraphQLString },
    userId: { type: GraphQLString },
  }),
});

const TaskInputType = new GraphQLInputObjectType({
  name: "TaskInput",
  fields: {
    title: { type: new GraphQLNonNull(GraphQLString) },
    description: { type: GraphQLString },
    userId: { type: new GraphQLNonNull(GraphQLString) },
  },
});

const TaskQueries = new GraphQLObjectType({
  name: "Query",
  fields: {
    tasks: {
      type: new GraphQLList(TaskOutputType),
      resolve: async () => {
        const cacheKey = "tasks:all";

        const cachedTasks = await redis.get(cacheKey);
        if (cachedTasks) {
          return JSON.parse(cachedTasks);
        }

        const tasks = await TaskModel.find();

        await redis.set(cacheKey, JSON.stringify(tasks), "EX", 60);

        return tasks;
      },
    },
    task: {
      type: TaskOutputType,
      args: { id: { type: new GraphQLNonNull(GraphQLID) } },
      resolve: async (_, { id }) => await TaskModel.findById(id),
    },
  },
});

const TaskMutation = new GraphQLObjectType({
  name: "Mutation",
  fields: {
    createTask: {
      type: TaskOutputType,
      args: {
        input: { type: new GraphQLNonNull(TaskInputType) },
      },
      resolve: async (_, { input }) => {
        const task = new TaskModel(input);
        return await task.save();
      },
    },
    updateTask: {
      type: TaskOutputType,
      args: {
        id: { type: new GraphQLNonNull(GraphQLID) },
        status: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLString) },
      },
      resolve: async (_, { id, status, userId }) => {
        const task = await TaskModel.findByIdAndUpdate(
          id,
          { status },
          { new: true }
        );

        if (status === "completed") {
          const completedAt = new Date()
            .toISOString()
            .slice(0, 19)
            .replace("T", " ");

          await axios.post("http://localhost:4001/post-analytics", {
            taskId: id,
            status: status,
            completedAt,
            userId: userId,
          });
        }

        return task;
      },
    },
  },
});

export const schema = new GraphQLSchema({
  query: TaskQueries,
  mutation: TaskMutation,
});
