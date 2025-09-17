import React, { useState } from "react";

const TodoForm = ({ user, token, addTodo }) => {
  const [taskText, setTaskText] = useState("");
  const [recurringInterval, setRecurringInterval] = useState("");
  const [priority, setPriority] = useState("Medium");

  const handleAddTodo = async (e) => {
    e.preventDefault();

    if (!taskText.trim()) return alert("Enter a task");

    const body = { text: taskText };

    // Premium fields
    if (user.isPremium) {
      if (recurringInterval) body.recurringInterval = recurringInterval;
      if (priority) body.priority = priority;
    }

    try {
      const endpoint = user.isPremium && recurringInterval ? "/api/todo/recurring" : "/api/todo";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });

      const data = await res.json();

      if (res.ok) {
        addTodo(data); // Update local state in parent
        setTaskText("");
        setRecurringInterval("");
        setPriority("Medium");
      } else {
        alert(data.message || "Error adding task");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <form onSubmit={handleAddTodo} className="p-4 bg-white rounded shadow">
      <input
        type="text"
        placeholder="Enter your task..."
        value={taskText}
        onChange={(e) => setTaskText(e.target.value)}
        className="border p-2 w-full mb-2 rounded"
      />

      {/* Premium: Recurring Task */}
      {user.isPremium && (
        <div className="mb-2">
          <label className="block mb-1">Recurring Interval:</label>
          <select
            value={recurringInterval}
            onChange={(e) => setRecurringInterval(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="">None</option>
            <option value="Daily">Daily</option>
            <option value="Weekly">Weekly</option>
            <option value="Monthly">Monthly</option>
          </select>
        </div>
      )}

      {/* Premium: Task Priority */}
      {user.isPremium && (
        <div className="mb-2">
          <label className="block mb-1">Priority:</label>
          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="border p-2 w-full rounded"
          >
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add Task
      </button>
    </form>
  );
};

export default TodoForm;
