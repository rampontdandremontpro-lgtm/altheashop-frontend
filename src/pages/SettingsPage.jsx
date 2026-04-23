import { useState } from "react";
import AccountSidebar from "../components/account/AccountSidebar";

function SettingsPage() {
  const [settings, setSettings] = useState({
    newsletter: true,
    notifications: true,
    darkMode: false,
  });

  const handleChange = (e) => {
    const { name, checked } = e.target;

    setSettings((prev) => ({
      ...prev,
      [name]: checked,
    }));
  };

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Paramètres</h1>
            <p>Base de préférences utilisateur pour la suite du projet.</p>
          </div>
        </div>

        <div className="account-layout">
          <AccountSidebar />

          <div className="box">
            <h2>Préférences</h2>

            <div className="settings-list">
              <label className="settings-item">
                <input
                  type="checkbox"
                  name="newsletter"
                  checked={settings.newsletter}
                  onChange={handleChange}
                />
                Recevoir la newsletter
              </label>

              <label className="settings-item">
                <input
                  type="checkbox"
                  name="notifications"
                  checked={settings.notifications}
                  onChange={handleChange}
                />
                Activer les notifications
              </label>

              <label className="settings-item">
                <input
                  type="checkbox"
                  name="darkMode"
                  checked={settings.darkMode}
                  onChange={handleChange}
                />
                Préférence mode sombre
              </label>
            </div>

            <div className="detail-box">
              <p>
                Ces paramètres sont actuellement gérés côté frontend. Ils pourront
                être persistés via l’API utilisateur plus tard.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default SettingsPage;