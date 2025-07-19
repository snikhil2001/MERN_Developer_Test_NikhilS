"use client";
import { gql, useQuery, useMutation } from "@apollo/client";
import { useParams } from "next/navigation";

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

const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $status: String!, $userId: String!) {
    updateTask(id: $id, status: $status, userId: $userId) {
      id
      status
    }
  }
`;

export default function TaskDetail() {
  const { id } = useParams();
  const { data, loading, error } = useQuery(GET_TASK, { variables: { id } });
  const [updateTask] = useMutation(UPDATE_TASK);

  const handleChange = (e: any) => {
    updateTask({
      variables: {
        id,
        status: e.target.value,
        userId: Math.floor(Math.random() * 999).toString(),
      },
    });
  };

  if (loading)
    return <p className="text-center text-gray-500 mt-10">Loading...</p>;
  if (error)
    return (
      <p className="text-center text-red-500 mt-10">
        Error getting details of the task
      </p>
    );

  const task = data.task;

  return (
    <div className="max-w-xl mx-auto p-6 bg-white border border-gray-200 rounded-lg shadow-md mt-10">
      <h1 className="text-3xl font-semibold text-gray-800 mb-3">
        {task.title}
      </h1>
      <p className="text-gray-600 mb-6">
        {task.description || "No description provided"}
      </p>

      <label
        htmlFor="status"
        className="block mb-2 text-sm font-medium text-gray-700"
      >
        Update Status
      </label>
      <select
        id="status"
        value={task.status}
        onChange={handleChange}
        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="pending">Pending</option>
        <option value="in-progress">In Progress</option>
        <option value="completed">Completed</option>
      </select>
    </div>
  );
}
