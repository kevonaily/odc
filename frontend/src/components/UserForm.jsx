import { useEffect, useState } from "react";

export default function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
   first_name:"",
   last_name:"",
   email:"",
  });

  useEffect(() => {
    if (user) {
      setFormData({
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label>NOM</label>
        <input
          type="text"
          className="form-control"
          name="first_name"
          value={formData.first_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Prenoms</label>
        <input
          type="text"
          className="form-control"
          name="last_name"
          value={formData.last_name}
          onChange={handleChange}
        />
      </div>
      <div className="form-group">
        <label>Email</label>
        <input
          type="email"
          className="form-control"
          name="email"
          value={formData.email}
          onChange={handleChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">
        Save
      </button>
      <button type="button" className="btn btn-secondary" onClick={onCancel}>
        Cancel
      </button>
    </form>
  );
}
