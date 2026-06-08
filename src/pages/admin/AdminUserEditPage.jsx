import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import UserAdminForm from "../../components/admin/UserAdminForm";
import {
  getAdminUserById,
  updateAdminUser,
} from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";

function AdminUserEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [loadingPage, setLoadingPage] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadUser() {
      try {
        setLoadingPage(true);
        setError("");

        const data = await getAdminUserById(id);
        setUser(data);
      } catch (err) {
        setError(
          err.response?.data?.message ||
            err.message ||
            "Impossible de charger l'utilisateur."
        );
      } finally {
        setLoadingPage(false);
      }
    }

    loadUser();
  }, [id]);

  const handleSave = async (formData) => {
    try {
      setSaving(true);
      setError("");

      await updateAdminUser(id, formData);
      navigate("/admin/users");
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de modifier l'utilisateur."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loadingPage) return <Loader text="Chargement de l'utilisateur..." />;
  if (error && !user) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Modifier un utilisateur</h1>
            <p>Édition d’un utilisateur côté interface admin.</p>
          </div>

          <Link to="/admin/users" className="btn btn-secondary">
            Retour utilisateurs
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <UserAdminForm
          initialValues={user}
          onSubmit={handleSave}
          submitLabel="Enregistrer les modifications"
          loading={saving}
        />
      </section>
    </div>
  );
}

export default AdminUserEditPage;