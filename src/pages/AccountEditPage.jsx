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
import { useI18n } from "../context/I18nContext";

function AccountEditPage() {
  const navigate = useNavigate();
  const { logout, updateProfile } = useAuth();
  const { t } = useI18n();

  const handleSaveProfile = async (formData) => {
    const updated = await updateProfileApi(formData);

    await updateProfile({
      firstName: updated.firstName,
      lastName: updated.lastName,
      email: updated.email,
      phone: updated.phone,
      currentPassword: formData.currentPassword,
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
            <h1>{t("editAccountTitle")}</h1>
            <p>{t("editAccountSubtitle")}</p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div className="account-sections">
            <ProfileForm
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