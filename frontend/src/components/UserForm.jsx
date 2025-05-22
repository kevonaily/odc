import { useEffect, useState } from "react";
import PropTypes from 'prop-types';

export default function UserForm({ user, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
  });
  
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        id: user.id,
        first_name: user.first_name || "",
        last_name: user.last_name || "",
        email: user.email || "",
      });
    } else {
      // Réinitialiser le formulaire si aucun utilisateur n'est fourni
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
      });
    }
    // Réinitialiser les erreurs
    setErrors({});
  }, [user]);

  const validateForm = () => {
    const newErrors = {};
    
    // Validation du prénom
    if (!formData.first_name.trim()) {
      newErrors.first_name = "Le prénom est requis";
    } else if (formData.first_name.trim().length < 2) {
      newErrors.first_name = "Le prénom doit contenir au moins 2 caractères";
    } else if (formData.first_name.trim().length > 50) {
      newErrors.first_name = "Le prénom ne doit pas dépasser 50 caractères";
    }
    
    // Validation du nom
    if (!formData.last_name.trim()) {
      newErrors.last_name = "Le nom est requis";
    } else if (formData.last_name.trim().length < 2) {
      newErrors.last_name = "Le nom doit contenir au moins 2 caractères";
    } else if (formData.last_name.trim().length > 50) {
      newErrors.last_name = "Le nom ne doit pas dépasser 50 caractères";
    }
    
    // Validation de l'email
    if (!formData.email.trim()) {
      newErrors.email = "L'email est requis";
    } else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.email.trim())) {
        newErrors.email = "Format d'email invalide";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    
    // Effacer l'erreur pour ce champ lorsqu'il est modifié
    if (errors[name]) {
      setErrors((prevErrors) => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      try {
        await onSave(formData);
        // Réinitialiser le formulaire après la soumission réussie
        if (!user) {
          setFormData({
            first_name: "",
            last_name: "",
            email: "",
          });
        }
      } catch (error) {
        // Gérer les erreurs de validation du serveur
        if (error.response && error.response.data && error.response.data.errors) {
          const serverErrors = {};
          error.response.data.errors.forEach((err) => {
            serverErrors[err.param] = err.msg;
          });
          setErrors(serverErrors);
        }
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <div className="card mb-4">
      <div className="card-header bg-primary text-white">
        <h5 className="mb-0">{user ? "Modifier l'utilisateur" : "Ajouter un utilisateur"}</h5>
      </div>
      <div className="card-body">
        <form onSubmit={handleSubmit} noValidate>
          <div className="row">
            <div className="col-md-6 mb-3">
              <label htmlFor="last_name" className="form-label">Nom</label>
              <input
                type="text"
                id="last_name"
                className={`form-control ${errors.last_name ? 'is-invalid' : ''}`}
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                placeholder="Entrez le nom"
                required
              />
              {errors.last_name && (
                <div className="invalid-feedback">{errors.last_name}</div>
              )}
            </div>
            
            <div className="col-md-6 mb-3">
              <label htmlFor="first_name" className="form-label">Prénom</label>
              <input
                type="text"
                id="first_name"
                className={`form-control ${errors.first_name ? 'is-invalid' : ''}`}
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                placeholder="Entrez le prénom"
                required
              />
              {errors.first_name && (
                <div className="invalid-feedback">{errors.first_name}</div>
              )}
            </div>
          </div>
          
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              id="email"
              className={`form-control ${errors.email ? 'is-invalid' : ''}`}
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Entrez l'adresse email"
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>
          
          <div className="d-flex justify-content-end gap-2">
            <button 
              type="button" 
              className="btn btn-secondary" 
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </button>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                  Enregistrement...
                </>
              ) : (
                user ? "Mettre à jour" : "Enregistrer"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

UserForm.propTypes = {
  user: PropTypes.shape({
    id: PropTypes.number,
    first_name: PropTypes.string,
    last_name: PropTypes.string,
    email: PropTypes.string
  }),
  onSave: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired
};