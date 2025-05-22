import PropTypes from 'prop-types';

export default function Pagination({ currentPage, totalPages, onPageChange }) {
  // Ne rien afficher s'il n'y a qu'une seule page
  if (totalPages <= 1) return null;

  // Générer un tableau de numéros de page à afficher
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5; // Nombre maximum de pages à afficher
    
    if (totalPages <= maxPagesToShow) {
      // Afficher toutes les pages si leur nombre est inférieur ou égal au maximum
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Calculer les pages à afficher
      let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
      let endPage = startPage + maxPagesToShow - 1;
      
      // Ajuster si on dépasse le nombre total de pages
      if (endPage > totalPages) {
        endPage = totalPages;
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      // Ajouter la première page et des points de suspension si nécessaire
      if (startPage > 1) {
        pageNumbers.push(1);
        if (startPage > 2) {
          pageNumbers.push('...');
        }
      }
      
      // Ajouter les pages du milieu
      for (let i = startPage; i <= endPage; i++) {
        pageNumbers.push(i);
      }
      
      // Ajouter la dernière page et des points de suspension si nécessaire
      if (endPage < totalPages) {
        if (endPage < totalPages - 1) {
          pageNumbers.push('...');
        }
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  return (
    <nav aria-label="Navigation des pages">
      <ul className="pagination justify-content-center">
        {/* Bouton Précédent */}
        <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Page précédente"
          >
            &laquo;
          </button>
        </li>
        
        {/* Numéros de page */}
        {getPageNumbers().map((page, index) => (
          <li 
            key={index} 
            className={`page-item ${page === currentPage ? 'active' : ''} ${page === '...' ? 'disabled' : ''}`}
          >
            <button
              className="page-link"
              onClick={() => page !== '...' && onPageChange(page)}
              disabled={page === '...'}
            >
              {page}
            </button>
          </li>
        ))}
        
        {/* Bouton Suivant */}
        <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
          <button
            className="page-link"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            aria-label="Page suivante"
          >
            &raquo;
          </button>
        </li>
      </ul>
    </nav>
  );
}

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired
};