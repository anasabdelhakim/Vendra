"use client";

import { api } from "@/convex/_generated/api";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

type Todo = {
  _id: string;
  text: string;
};

const ConvexPage = () => {
  const [text, setText] = useState("");
  const [optimisticTasks, setOptimisticTasks] = useState<Todo[]>([]); // store optimistic tasks

  const createTodo = useMutation(api.todos.createTask);
  const tasks = useQuery(api.todos.getTodods);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Create optimistic task with temporary ID
    const tempId = uuidv4();
    const tempTask = { _id: tempId, text };
    setOptimisticTasks((prev) => [...prev, tempTask]);
    setText("");

    try {
      await createTodo({ text });
      // Remove optimistic task after server confirms
      setOptimisticTasks((prev) => prev.filter((t) => t._id !== tempId));
    } catch (err) {
      console.error("Failed to create task:", err);
      // Remove optimistic task if creation fails
      setOptimisticTasks((prev) => prev.filter((t) => t._id !== tempId));
    }
  };

  // Combine server tasks with remaining optimistic tasks
  const combinedTasks = [...(tasks || []), ...optimisticTasks];

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">Convex Tasks</h2>

      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          type="text"
          placeholder="Enter task..."
          className="flex-1 p-2 border rounded"
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 py-2 rounded"
        >
          Create
        </button>
      </form>

      {/* Tasks list */}
      <div>
        <h3 className="text-xl font-semibold mb-2">Tasks</h3>
        {tasks === undefined && optimisticTasks.length === 0 ? (
          <p>Loading tasks...</p>
        ) : combinedTasks.length === 0 ? (
          <p>No tasks exist</p>
        ) : (
          <ul className="space-y-2">
            {combinedTasks.map((task) => (
              <li
                key={task._id}
                className="border p-3 rounded-lg dark:border-zinc-700"
              >
                <p>
                  <b>Title:</b> {task.text}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConvexPage;
