export default function UserList({ users, onEdit, onDelete }) {
  return (
    <table className="table table-bordered">
      <thead>
        <tr>
          <th>Nom</th>
          <th>Prenom</th>
          <th>Mail</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <tr key={user.id}>
            <td>{user.first_name}</td>
            <td>{user.last_name}</td>
            <td>{user.email}</td>
            
            <td>
              <button onClick={() => onEdit(user)}>Edit</button>
              <button onClick={() => onDelete(user.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
