import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  deleteCurrentUserAccount,
  updateProfile as updateProfileApi,
} from "../api/usersApi";
import AccountSidebar from "../components/account/AccountSidebar";
import ProfileForm from "../components/account/ProfileForm";
import AddressList from "../components/account/AddressList";
import PaymentMethods from "../components/account/PaymentMethods";

function AccountEditPage() {
  const navigate = useNavigate();
  const { user, logout, updateProfile } = useAuth();

  const handleSaveProfile = async (formData) => {
    const updated = await updateProfileApi(formData);

    await updateProfile({
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
    });
  };

  const handleCancel = () => {
    navigate("/account");
  };

  const handleDeleteAccount = async () => {
    await deleteCurrentUserAccount();
    await logout();
    navigate("/");
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Modifier mon compte</h1>
            <p>Gérez vos informations personnelles, adresses et paiements.</p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div className="account-sections">
            <ProfileForm
              profile={user}
              onSave={handleSaveProfile}
              onCancel={handleCancel}
              onDeleteAccount={handleDeleteAccount}
            />
            <AddressList />
            <PaymentMethods />
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccountEditPage;