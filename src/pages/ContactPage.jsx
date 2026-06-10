import ContactForm from "../components/contact/ContactForm";
import ChatbotWidget from "../components/contact/ChatbotWidget";
import { useI18n } from "../context/I18nContext";

function ContactPage() {
  const { t } = useI18n();

  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>{t("contactTitle")}</h1>
            <p>{t("contactSubtitle")}</p>
          </div>
        </div>

        <div className="contact-grid">
          <ContactForm />
          <ChatbotWidget />
        </div>
      </section>
    </div>
  );
}

export default ContactPage;