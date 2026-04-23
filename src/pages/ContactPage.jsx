import ContactForm from "../components/contact/ContactForm";
import ChatbotWidget from "../components/contact/ChatbotWidget";

function ContactPage() {
  return (
    <div className="page-stack">
      <section className="section">
        <div className="page-heading">
          <div>
            <h1>Contact</h1>
            <p>Une page de contact prête à évoluer avec le backend.</p>
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