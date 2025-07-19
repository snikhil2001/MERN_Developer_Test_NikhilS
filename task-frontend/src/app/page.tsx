"use client";
import { gql, useQuery } from "@apollo/client";

const GET_TASKS = gql`
  query {
    tasks {
      id
      title
      description
      status
    }
  }
`;

export default function Home() {
  const { data, loading, error } = useQuery(GET_TASKS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading tasks</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Task List</h1>
      <ul className="space-y-2">
        {data.tasks.map((task: any) => (
          <li key={task.id} className="border p-4 rounded">
            <a
              href={`/task/${task.id}`}
              className="text-blue-500 hover:underline"
            >
              {task.title}
            </a>{" "}
            - <span>{task.status}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
