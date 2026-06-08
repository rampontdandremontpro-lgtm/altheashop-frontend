import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { deleteAdminUser, getAdminUsers } from "../../api/adminApi";
import Loader from "../../components/common/Loader";
import ErrorMessage from "../../components/common/ErrorMessage";
import EmptyState from "../../components/common/EmptyState";
import AdminTable from "../../components/admin/AdminTable";

function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadUsers() {
    try {
      setLoading(true);
      setError("");

      const data = await getAdminUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de charger les utilisateurs."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const userText = `${user.firstName || ""} ${user.lastName || ""} ${
        user.email || ""
      } ${user.phone || ""}`.toLowerCase();

      const matchesSearch = !query || userText.includes(query);
      const matchesRole = roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm("Supprimer/anonymiser cet utilisateur ?");
    if (!confirmed) return;

    try {
      setError("");
      await deleteAdminUser(id);
      await loadUsers();
    } catch (err) {
      setError(
        err.response?.data?.message ||
          err.message ||
          "Impossible de supprimer l'utilisateur."
      );
    }
  };

  const columns = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "fullName",
      label: "Nom",
      render: (user) => `${user.firstName || ""} ${user.lastName || ""}`,
    },
    {
      key: "email",
      label: "Email",
    },
    {
      key: "phone",
      label: "Téléphone",
      render: (user) => user.phone || "-",
    },
    {
      key: "role",
      label: "Rôle",
    },
    {
      key: "isActive",
      label: "Actif",
      render: (user) => (user.isActive ? "Oui" : "Non"),
    },
  ];

  if (loading) return <Loader text="Chargement des utilisateurs..." />;
  if (error && users.length === 0) return <ErrorMessage message={error} />;

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Utilisateurs admin</h1>
            <p>{filteredUsers.length} utilisateur(s)</p>
          </div>

          <Link to="/admin" className="btn btn-secondary">
            Retour
          </Link>
        </div>

        {error && <div className="box error-box">{error}</div>}

        <div className="box filters">
          <input
            type="text"
            placeholder="Rechercher nom, email, téléphone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
          >
            <option value="all">Tous les rôles</option>
            <option value="user">Utilisateurs</option>
            <option value="admin">Admins</option>
          </select>
        </div>

        {filteredUsers.length === 0 ? (
          <EmptyState
            title="Aucun utilisateur"
            message="Aucun utilisateur ne correspond à votre recherche."
          />
        ) : (
          <AdminTable
            columns={columns}
            data={filteredUsers}
            emptyMessage="Aucun utilisateur disponible."
            actions={(user) => (
              <div className="admin-actions">
                <Link
                  to={`/admin/users/${user.id}/edit`}
                  className="btn btn-secondary"
                >
                  Modifier
                </Link>

                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => handleDelete(user.id)}
                >
                  Supprimer
                </button>
              </div>
            )}
          />
        )}
      </section>
    </div>
  );
}

export default AdminUsersPage;