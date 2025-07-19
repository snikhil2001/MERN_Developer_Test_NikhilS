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

Visit: [Url](http://localhost:4000/graphql)

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

Screenshots of the ouputs are available in the below folder

`task-screenshots\task-api`

# Task Frontend setup and screenshots

Navigate to the task frontend folder

```
cd ./task-frontend
npm i
```

Run the server by the following command

```
npm run dev
```

Created the NextJS App by the following command

`npx create-next-app@latest task-frontend --app`

## For Apollo client integration

Installed the dependencies

`npm install @apollo/client graphql`

Create a .env file at the root of the folder and add the following variables

```
NEXT_PUBLIC_GRAPHQL_API="http://localhost:4000/graphql"
```

Created componentes/Providers.tsx for setup

```
"use client";

import { ApolloProvider } from "@apollo/client";
import { client } from "@/lib/apollo";

export default function Providers({ children }: { children: React.ReactNode }) {
  return <ApolloProvider client={client}>{children}</ApolloProvider>;
}
```

Inside the app layout imported Providers component and wrapped it around

```
import Providers from "@/components/Provider";
import "./globals.css";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
```

One of the example for query

```
const GET_TASK = gql`
  query GetTask($id: ID!) {
    task(id: $id) {
      id
      title
      description
      status
    }
  }
`;
```

Use useQuery hook to call the gql

`const { data, loading, error } = useQuery(GET_TASK, { variables: { id } })`

Screenshots of the UI are in the below folder

`task-screenshots\task-frontend`

Visit :- [Frontend Url](http://localhost:3000)

# Task Analytics setup and screenshots

Note : I have create a simple seperated express server as a microservice and syncing data between two services through axios.

I have done this because of shortage of time.

We had achieved microservices architecture previously though NestJS and GraphQL and data migration through Apache Kafka.

Navigate to the folder task analytics and run the following

```
cd ./task-frontend
npm i
npm run start
```

Create a .env file at the root of the folder and add the following variables

```
PORT=4001
MYSQL_DB = analyticsdb
MYSQL_USER = <your user name>
MYSQL_PASSWORD = <your password>
MYSQL_HOST = localhost
```

Database creation commands

`CREATE DATABASE analyticsdb`

```
CREATE TABLE analytics (
  id INT AUTO_INCREMENT PRIMARY KEY,
  taskId VARCHAR(255) NOT NULL,
  userId VARCHAR(255) NOT NULL,
  status VARCHAR(50) NOT NULL,
  completedAt DATETIME NOT NULL,
  createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
  updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

Note : Paste this in your MySQL workbench query sheet

# Task Optimization

```
const { data, loading, error } = useQuery(GET_TASKS, {
    fetchPolicy: "cache-and-network",
  });
```

By using cache-and-network and network-only I have seen some changes in the response

On First API call - 271ms
On Second refresh - 264 ms / 265 ms

Reduced Latency - 20 ms

## Redis setup in task-api

Pre-requisites: Install docker and pull redis image and run the container with that image

Env Variables

```
REDIS_HOST=localhost
REDIS_PORT=6379
```

Redis.js file inside lib folder

```
import Redis from "ioredis";

const redis = new Redis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
});

redis.on("connect", () => {
  console.log("Redis connected");
});

redis.on("error", (err) => {
  console.error("Redis connection error:", err);
});

export default redis;
```

Include in index file

```
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
```

Results

Before redis integration - 284 ms
After redis integration - 14 ms

Screenshots are available in below folder

`task-screenshots\task-optimization`
