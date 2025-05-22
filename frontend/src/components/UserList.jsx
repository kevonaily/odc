import { useState } from 'react';
import PropTypes from 'prop-types';

export default function UserList({ 
  users, 
  onEdit, 
  onDelete, 
  pagination, 
  onPageChange, 
  onSearch, 
  onLimitChange,
  loading 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [sortField, setSortField] = useState('last_name');
  const [sortDirection, setSortDirection] = useState('asc');

  // Gestion de la recherche
  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch(searchTerm);
    }
  };

  // Gestion du tri
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Gestion de la suppression
  const confirmDelete = (user) => {
    setUserToDelete(user);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirmed = () => {
    if (userToDelete) {
      onDelete(userToDelete.id);
      setShowDeleteModal(false);
      setUserToDelete(null);
    }
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setUserToDelete(null);
  };

  // Tri des utilisateurs
  const sortedUsers = [...users].sort((a, b) => {
    const aValue = a[sortField]?.toString().toLowerCase() || '';
    const bValue = b[sortField]?.toString().toLowerCase() || '';
    
    if (sortDirection === 'asc') {
      return aValue.localeCompare(bValue);
    } else {
      return bValue.localeCompare(aValue);
    }
  });

  // Rendu des boutons de pagination
  const renderPaginationButtons = () => {
    if (!pagination) return null;
    
    const { page, totalPages } = pagination;
    const buttons = [];
    
    // Bouton précédent
    buttons.push(
      <li key="prev" className={`page-item ${page <= 1 ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
        >
          &laquo;
        </button>
      </li>
    );
    
    // Pages
    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);
    
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <li key={i} className={`page-item ${page === i ? 'active' : ''}`}>
          <button 
            className="page-link" 
            onClick={() => onPageChange(i)}
          >
            {i}
          </button>
        </li>
      );
    }
    
    // Bouton suivant
    buttons.push(
      <li key="next" className={`page-item ${page >= totalPages ? 'disabled' : ''}`}>
        <button 
          className="page-link" 
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
        >
          &raquo;
        </button>
      </li>
    );
    
    return buttons;
  };

  return (
    <div className="user-list-container">
      {/* Barre de recherche et filtres */}
      <div className="row mb-3">
        <div className="col-md-6">
          <form onSubmit={handleSearch} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Rechercher un utilisateur..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button type="submit" className="btn btn-outline-primary">
              Rechercher
            </button>
          </form>
        </div>
        <div className="col-md-6 text-end">
          {pagination && onLimitChange && (
            <select 
              className="form-select d-inline-block w-auto"
              value={pagination.limit}
              onChange={(e) => onLimitChange(Number(e.target.value))}
            >
              <option value="5">5 par page</option>
              <option value="10">10 par page</option>
              <option value="25">25 par page</option>
              <option value="50">50 par page</option>
            </select>
          )}
        </div>
      </div>

      {/* Tableau des utilisateurs */}
      <div className="table-responsive">
        <table className="table table-bordered table-hover">
          <thead className="table-light">
            <tr>
              <th onClick={() => handleSort('last_name')} className="sortable-header">
                Nom
                {sortField === 'last_name' && (
                  <span className="ms-1">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('first_name')} className="sortable-header">
                Prénom
                {sortField === 'first_name' && (
                  <span className="ms-1">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th onClick={() => handleSort('email')} className="sortable-header">
                Email
                {sortField === 'email' && (
                  <span className="ms-1">
                    {sortDirection === 'asc' ? '▲' : '▼'}
                  </span>
                )}
              </th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Chargement...</span>
                  </div>
                </td>
              </tr>
            ) : sortedUsers.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-4">
                  Aucun utilisateur trouvé
                </td>
              </tr>
            ) : (
              sortedUsers.map((user) => (
                <tr key={user.id}>
                  <td>{user.last_name}</td>
                  <td>{user.first_name}</td>
                  <td>{user.email}</td>
                  <td className="actions-column text-center">
                    <button 
                      className="btn btn-primary btn-sm me-2" 
                      onClick={() => onEdit(user)}
                      aria-label={`Modifier ${user.first_name} ${user.last_name}`}
                    >
                      <i className="bi bi-pencil-fill me-1"></i> Modifier
                    </button>
                    <button 
                      className="btn btn-danger btn-sm" 
                      onClick={() => confirmDelete(user)}
                      aria-label={`Supprimer ${user.first_name} ${user.last_name}`}
                    >
                      <i className="bi bi-trash-fill me-1"></i> Supprimer
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <nav aria-label="Pagination des utilisateurs">
          <ul className="pagination justify-content-center">
            {renderPaginationButtons()}
          </ul>
        </nav>
      )}

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="modal show d-block" tabIndex="-1" role="dialog">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Confirmer la suppression</h5>
                <button type="button" className="btn-close" onClick={cancelDelete} aria-label="Fermer"></button>
              </div>
              <div className="modal-body">
                <p>Êtes-vous sûr de vouloir supprimer l'utilisateur <strong>{userToDelete?.first_name} {userToDelete?.last_name}</strong> ?</p>
                <p className="text-danger">Cette action est irréversible.</p>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" onClick={cancelDelete}>Annuler</button>
                <button type="button" className="btn btn-danger" onClick={handleDeleteConfirmed}>Supprimer</button>
              </div>
            </div>
          </div>
          <div className="modal-backdrop show"></div>
        </div>
      )}
    </div>
  );
}

// PropTypes pour la validation des props
UserList.propTypes = {
  users: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  pagination: PropTypes.shape({
    page: PropTypes.number.isRequired,
    limit: PropTypes.number.isRequired,
    total: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired
  }),
  onPageChange: PropTypes.func,
  onSearch: PropTypes.func,
  onLimitChange: PropTypes.func,
  loading: PropTypes.bool
};

// Valeurs par défaut
UserList.defaultProps = {
  users: [],
  loading: false
};