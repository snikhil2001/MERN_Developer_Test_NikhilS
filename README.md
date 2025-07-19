# MERN_Developer_Test_NikhilS

# Task API Setup And Screenshots

Navigate to task-api folder and install the dependencies

```
cd task-api
npm i
```

Create a .env file at the root of the folder and add the following variables

```
PORT = 4000
MONGO_URI="mongodb+srv://<username>:<password>@<cluster-url>/<database-name>"
```

Now start the server using the following command

`npm run start`

Visit: [Url](http://localhost:4000)

## Graphql Schema

```
import {
  GraphQLID,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLSchema,
  GraphQLString,
} from "graphql";


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
```

Here
id is declared using GraphQLID
title, description, status, userId are the string data types
TaskOutputType and TaskInputTypes are the two types for the queries and mutations

## Queries

Get Tasks

```
{
  tasks {
    id
    title
    description
    status
    userId
  }
}
```

Get Task by ID

```
{
  task(id: "") {
    id
    title
    description
    status
    userId
  }
}

```

## Mutations

Create Task

```
mutation {
  createTask(input: { title: "string", userId: "string" }) {
    id
    title
    description
    status
    userId
  }
}
```

Update Task

```
mutation {
  updateTask(id: "_____", status: "string",userId: "") {
    id
    title
    description
    status
    userId
  }
}
```
