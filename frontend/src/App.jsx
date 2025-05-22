import { useEffect, useState } from "react";
import UserForm from "./components/UserForm";
import UserList from "./components/UserList";
import ToastContainer from "./components/ToastContainer";
import { userService } from "./services/api";
import useToast from "./hooks/useToast";
import "./App.css";

function App() {
  // États
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0
  });
  const [searchTerm, setSearchTerm] = useState("");
  
  // Hook personnalisé pour les notifications
  const { toasts, showSuccess, showError, removeToast } = useToast();

  // Charger les utilisateurs
  const fetchUsers = async (page = 1, limit = 10, search = "") => {
    setLoading(true);
    try {
      const data = await userService.getUsers({ page, limit, search });
      setUsers(data.users);
      setPagination({
        page: data.pagination.page,
        limit: data.pagination.limit,
        total: data.pagination.total,
        totalPages: data.pagination.totalPages
      });
    } catch (error) {
      showError("Erreur lors du chargement des utilisateurs");
      console.error("Erreur lors du chargement des utilisateurs:", error);
    } finally {
      setLoading(false);
    }
  };

  // Charger les utilisateurs au chargement initial
  useEffect(() => {
    fetchUsers(pagination.page, pagination.limit, searchTerm);
  }, []);

  // Gérer le changement de page
  const handlePageChange = (newPage) => {
    fetchUsers(newPage, pagination.limit, searchTerm);
  };

  // Gérer le changement de limite par page
  const handleLimitChange = (newLimit) => {
    fetchUsers(1, newLimit, searchTerm);
  };

  // Gérer la recherche
  const handleSearch = (term) => {
    setSearchTerm(term);
    fetchUsers(1, pagination.limit, term);
  };

  // Ajouter un utilisateur
  const handleAdd = async (userData) => {
    try {
      await userService.createUser(userData);
      showSuccess("Utilisateur ajouté avec succès");
      fetchUsers(pagination.page, pagination.limit, searchTerm);
      return true;
    } catch (error) {
      showError(
        error.response?.data?.error || 
        "Erreur lors de l'ajout de l'utilisateur"
      );
      console.error("Erreur lors de l'ajout de l'utilisateur:", error);
      throw error;
    }
  };

  // Mettre à jour un utilisateur
  const handleUpdate = async (userData) => {
    try {
      await userService.updateUser(userData.id, userData);
      showSuccess("Utilisateur mis à jour avec succès");
      setEditingUser(null);
      fetchUsers(pagination.page, pagination.limit, searchTerm);
      return true;
    } catch (error) {
      showError(
        error.response?.data?.error || 
        "Erreur lors de la mise à jour de l'utilisateur"
      );
      console.error("Erreur lors de la mise à jour de l'utilisateur:", error);
      throw error;
    }
  };

  // Supprimer un utilisateur
  const handleDelete = async (id) => {
    try {
      await userService.deleteUser(id);
      showSuccess("Utilisateur supprimé avec succès");
      
      // Si c'était le dernier utilisateur de la page, revenir à la page précédente
      if (users.length === 1 && pagination.page > 1) {
        fetchUsers(pagination.page - 1, pagination.limit, searchTerm);
      } else {
        fetchUsers(pagination.page, pagination.limit, searchTerm);
      }
    } catch (error) {
      showError(
        error.response?.data?.error || 
        "Erreur lors de la suppression de l'utilisateur"
      );
      console.error("Erreur lors de la suppression de l'utilisateur:", error);
    }
  };

  // Gérer la soumission du formulaire
  const handleFormSubmit = async (userData) => {
    if (editingUser) {
      return handleUpdate(userData);
    } else {
      return handleAdd(userData);
    }
  };

  // Annuler l'édition
  const handleFormCancel = () => {
    setEditingUser(null);
  };

  // Commencer l'édition d'un utilisateur
  const handleEdit = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="container py-4">
      <header className="mb-4 text-center">
        <h1 className="display-4">Gestion des Utilisateurs</h1>
        <p className="lead">
          Créez, consultez, modifiez et supprimez des utilisateurs
        </p>
      </header>

      <div className="row">
        <div className="col-lg-4 mb-4">
          <UserForm
            user={editingUser}
            onSave={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
        
        <div className="col-lg-8">
          <UserList
            users={users}
            onEdit={handleEdit}
            onDelete={handleDelete}
            pagination={pagination}
            onPageChange={handlePageChange}
            onSearch={handleSearch}
            onLimitChange={handleLimitChange}
            loading={loading}
          />
        </div>
      </div>

      {/* Affichage des notifications */}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </div>
  );
}

export default App;