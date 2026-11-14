
import { useState } from "react";
import "./App.css";

function App() {
  const [tasks, setTasks] = useState([
    { id: 1, title: "Learn React", status: "todo" },
    { id: 2, title: "Build Kanban Dashboard", status: "progress" },
    { id: 3, title: "Setup React Project", status: "completed" }
  ]);

  const [newTask, setNewTask] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editTitle, setEditTitle] = useState("");

  // Add Task
  function handleAddTask(e) {
    e.preventDefault();

    if (!newTask.trim()) return;

    const task = {
      id: Date.now(),
      title: newTask.trim(),
      status: "todo"
    };

    setTasks([...tasks, task]);
    setNewTask("");
  }

  // Move Task
  function moveTask(id, newStatus) {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, status: newStatus }
          : task
      )
    );
  }

  // Delete Task
  function deleteTask(id) {
    setTasks(prevTasks =>
      prevTasks.filter(task => task.id !== id)
    );

    if (editingId === id) {
      setEditingId(null);
      setEditTitle("");
    }
  }

  // Start Editing
  function startEditing(task) {
    setEditingId(task.id);
    setEditTitle(task.title);
  }

  // Save Edited Task
  function saveEdit(id) {
    if (!editTitle.trim()) return;

    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === id
          ? { ...task, title: editTitle.trim() }
          : task
      )
    );

    setEditingId(null);
    setEditTitle("");
  }

  // Render Task Cards
  function renderTasks(status) {
    return tasks
      .filter(task => task.status === status)
      .map(task => (
        <div className="task-card" key={task.id}>

          {editingId === task.id ? (
            <div>
              <input
                className="edit-input"
                value={editTitle}
                onChange={e => setEditTitle(e.target.value)}
              />

              <div className="task-actions">
                <button onClick={() => saveEdit(task.id)}>
                  Save
                </button>

                <button onClick={() => {
                  setEditingId(null);
                  setEditTitle("");
                }}>
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <h3>{task.title}</h3>

              <div className="task-actions">

                <button onClick={() => startEditing(task)}>
                  Edit
                </button>

                <button onClick={() => deleteTask(task.id)}>
                  Delete
                </button>

                {status !== "todo" && (
                  <button
                    onClick={() =>
                      moveTask(
                        task.id,
                        status === "completed"
                          ? "progress"
                          : "todo"
                      )
                    }
                  >
                    ← Back
                  </button>
                )}

                {status === "todo" && (
                  <button onClick={() => moveTask(task.id, "progress")}>
                    Start →
                  </button>
                )}

                {status === "progress" && (
                  <button onClick={() => moveTask(task.id, "completed")}>
                    Complete ✓
                  </button>
                )}

              </div>
            </>
          )}

        </div>
      ));
  }

  return (
    <div className="dashboard">

      <h1>My Kanban Dashboard</h1>
      <p>Manage your tasks efficiently.</p>

      {/* Add Task Form */}
      <form onSubmit={handleAddTask} className="add-task-form">
        <input
          type="text"
          placeholder="Enter a new task..."
          value={newTask}
          onChange={e => setNewTask(e.target.value)}
        />

        <button type="submit">Add Task</button>
      </form>

      {/* Kanban Board */}
      <div className="kanban-board">

        <div className="kanban-column">
          <h2>To Do ({tasks.filter(task => task.status === "todo").length})</h2>
          {renderTasks("todo")}
        </div>

        <div className="kanban-column">
          <h2>In Progress ({tasks.filter(task => task.status === "progress").length})</h2>
          {renderTasks("progress")}
        </div>

        <div className="kanban-column">
          <h2>Completed ({tasks.filter(task => task.status === "completed").length})</h2>
          {renderTasks("completed")}
        </div>

      </div>
    </div>
  );
}

export default App;
