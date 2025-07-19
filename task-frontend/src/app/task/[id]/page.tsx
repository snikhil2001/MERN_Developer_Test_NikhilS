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
  mutation UpdateTask($id: ID!, $status: String!) {
    updateTask(id: $id, status: $status) {
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
    updateTask({ variables: { id, status: e.target.value } });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error getting details of the task</p>;
  const task = data.task;

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">{task.title}</h1>
      <p className="mb-4">
        {task.description ? task.description : "No description provided"}
      </p>
      <select
        value={task.status}
        onChange={handleChange}
        className="border p-2 rounded"
      >
        <option>pending</option>
        <option>in-progress</option>
        <option>completed</option>
      </select>
    </div>
  );
}
