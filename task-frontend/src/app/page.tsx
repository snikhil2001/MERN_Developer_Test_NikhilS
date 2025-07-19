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
  const { data, loading, error } = useQuery(GET_TASKS, {
    fetchPolicy: "cache-and-network",
  });

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-10">Error loading tasks</p>
    );

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Task List</h1>

      <ul className="space-y-4">
        {data.tasks.map((task: any) => (
          <li
            key={task.id}
            className="bg-white shadow-sm hover:shadow-md transition-shadow border border-gray-200 p-5 rounded-lg"
          >
            <a
              href={`/task/${task.id}`}
              className="text-xl font-semibold text-blue-600 hover:text-blue-800"
            >
              {task.title}
            </a>
            <p className="text-gray-600 mt-1">{task.description}</p>
            <span
              className={`inline-block mt-2 px-3 py-1 text-sm rounded-full ${
                task.status === "completed"
                  ? "bg-green-100 text-green-700"
                  : task.status === "in-progress"
                  ? "bg-yellow-100 text-yellow-700"
                  : "bg-gray-100 text-gray-700"
              }`}
            >
              {task.status}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
