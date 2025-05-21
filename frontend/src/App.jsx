import { useEffect, useState } from "react";
import axios from "axios";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";

const API = import.meta.env.VITE_API_URL;

function App() {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);

  const fetchUsers = async () => {
    const res = await axios.get(`${API}/users`);
    setUsers(res.data);
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = async (user) => {
    await axios.post(`${API}/users`, user);
    fetchUsers();
  }
  const handleEdit = async (user) => {
    setEditingUser(user);
  }
  const handleUpdate = async (user) => {
    await axios.put(`${API}/users/${user.id}`, user);
    setEditingUser(null);
    fetchUsers();
  }
  const handleDelete = async (id) => {
    await axios.delete(`${API}/users/${id}`);
    fetchUsers();
  }
  const handleCancelEdit = () => {
    setEditingUser(null);
  }
  const handleSave = async (user) => {
    if (editingUser) {
      await handleUpdate(user);
    } else {
      await handleAdd(user);
    }
  }
  const handleFormSubmit = async (user) => {
    if (editingUser) {
      await handleUpdate(user);
    } else {
      await handleAdd(user);
    }
  }
  const handleFormCancel = () => {
    setEditingUser(null);
  }
  const handleFormDelete = async (id) => {
    await handleDelete(id);
  }
  const handleFormEdit = (user) => {
    setEditingUser(user);
  }
  const handleFormUpdate = async (user) => {
    await handleUpdate(user);
  }
  const handleFormClose = () => {
    setEditingUser(null);
  }

  return (
    <div className="App">
      <h1>User Management</h1>
      <UserForm
        onSubmit={handleFormSubmit}
        onCancel={handleFormCancel}
        user={editingUser}
        onSave={handleSave}
      />
      <UserList
        users={users}
        onEdit={handleFormEdit}
        onDelete={handleFormDelete}
      />
    </div>
  );
}

export default App;
