import { useEffect, useState } from "react";

export default function Todo() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [todos, setTodos] = useState([]);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");
    const [editId, setEditId] = useState(-1);

    const [editTitle, setEditTitle] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const apiUrl = "http://localhost:8000";

    const handleSubmit = () => {
        setError("");
        if (title.trim() !== "" && description.trim() !== "") {
            fetch(apiUrl + "/todos", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title, description }),
            })
                .then((res) => {
                    if (res.ok) {
                        setTodos([...todos, { title, description }]);
                        setTitle("");
                        setDescription("");
                        setMessage("✅ Item added successfully!");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                    } else {
                        setError("❌ Unable to create Todo item");
                    }
                })
                .catch(() => {
                    setError("❌ Unable to create Todo item");
                });
        }
    };

    useEffect(() => {
        getItems();
    }, []);

    const getItems = () => {
        fetch(apiUrl + "/todos")
            .then((res) =>
                res.json().then((res) => {
                    setTodos(res);
                })
            )
            .catch(() => setError("Unable to fetch Todos"));
    };

    const handleEdit = (item) => {
        setEditId(item._id);
        setEditTitle(item.title);
        setEditDescription(item.description);
    };

    const handleUpdate = () => {
        setError("");
        if (editTitle.trim() !== "" && editDescription.trim() !== "") {
            fetch(apiUrl + "/todos/" + editId, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ title: editTitle, description: editDescription }),
            })
                .then((res) => {
                    if (res.ok) {
                        const updatedTodos = todos.map((item) => {
                            if (item._id === editId) {
                                item.title = editTitle;
                                item.description = editDescription;
                            }
                            return item;
                        });
                        setTodos(updatedTodos);
                        setEditTitle("");
                        setEditDescription("");
                        setMessage("✅ Item updated successfully!");
                        setTimeout(() => {
                            setMessage("");
                        }, 3000);
                        setEditId(-1);
                    } else {
                        setError("❌ Unable to update Todo item");
                    }
                })
                .catch(() => {
                    setError("❌ Unable to update Todo item");
                });
        }
    };

    const handleEditCancel = () => {
        setEditId(-1);
    };

    const handleDelete = (id) => {
        if (window.confirm("Are you sure you want to delete?")) {
            fetch(apiUrl + "/todos/" + id, {
                method: "DELETE",
            })
                .then(() => {
                    const updatedTodos = todos.filter((item) => item._id !== id);
                    setTodos(updatedTodos);
                })
                .catch(() => setError("❌ Unable to delete Todo item"));
        }
    };

    return (
        <div className="container py-4">
            {/* Header */}
            <div className="text-center mb-4">
                <h1 className="text-primary">📝 TODO APP</h1>
                <p className="text-muted">Manage your tasks effectively with this simple app!</p>
            </div>

            {/* Add Item Section */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <h3 className="text-success">Add a New Task</h3>
                    {message && <p className="alert alert-success">{message}</p>}
                    {error && <p className="alert alert-danger">{error}</p>}
                    <div className="d-flex gap-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                        <button className="btn btn-primary" onClick={handleSubmit}>
                            Add Task
                        </button>
                    </div>
                </div>
            </div>

            {/* Task List */}
            <div className="card shadow-sm">
                <div className="card-body">
                    <h3 className="text-info">Your Tasks</h3>
                    <ul className="list-group">
                        {todos.map((item) => (
                            <li
                                key={item._id}
                                className="list-group-item d-flex justify-content-between align-items-center my-2 p-3 rounded"
                                style={{ backgroundColor: editId === item._id ? "#f8f9fa" : "#e3f2fd" }}
                            >
                                <div>
                                    {editId === -1 || editId !== item._id ? (
                                        <>
                                            <h5 className="mb-1">{item.title}</h5>
                                            <p className="mb-0 text-muted">{item.description}</p>
                                        </>
                                    ) : (
                                        <div className="d-flex gap-2">
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editTitle}
                                                onChange={(e) => setEditTitle(e.target.value)}
                                            />
                                            <input
                                                type="text"
                                                className="form-control"
                                                value={editDescription}
                                                onChange={(e) => setEditDescription(e.target.value)}
                                            />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    {editId === -1 ? (
                                        <>
                                            <button
                                                className="btn btn-warning btn-sm me-2"
                                                onClick={() => handleEdit(item)}
                                            >
                                                Edit
                                            </button>
                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleDelete(item._id)}
                                            >
                                                Delete
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                className="btn btn-success btn-sm me-2"
                                                onClick={handleUpdate}
                                            >
                                                Update
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm"
                                                onClick={handleEditCancel}
                                            >
                                                Cancel
                                            </button>
                                        </>
                                    )}
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
