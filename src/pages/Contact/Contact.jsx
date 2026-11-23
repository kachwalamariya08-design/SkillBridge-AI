
import "./Contact.css";

function Contact() {
  function handleSubmit(event) {
    event.preventDefault();
    alert("Thank you for contacting SkillBridge AI!");
    event.target.reset();
  }

  return (
    <main className="contact-page">
      <section className="contact-hero">
        <p className="contact-eyebrow">GET IN TOUCH</p>
        <h1>We'd Love to Hear From You</h1>
        <p>
          Have a question, suggestion, or idea to improve
          your learning journey? Send us a message.
        </p>
      </section>

      <section className="contact-container">
        <div className="contact-info">
          <h2>Let's Connect</h2>
          <p>
            We're building SkillBridge AI to help students
            become confident and internship-ready.
          </p>

          <div className="contact-info-item">
            <span>📩</span>
            <div>
              <h3>Email</h3>
              <p>support@skillbridgeai.com</p>
            </div>
          </div>

          <div className="contact-info-item">
            <span>💡</span>
            <div>
              <h3>Suggestions</h3>
              <p>Share ideas to help us improve the platform.</p>
            </div>
          </div>
        </div>

        <form className="contact-form" onSubmit={handleSubmit}>
          <label htmlFor="contact-name">Your Name</label>
          <input
            id="contact-name"
            type="text"
            placeholder="Enter your name"
            required
          />

          <label htmlFor="contact-email">Email Address</label>
          <input
            id="contact-email"
            type="email"
            placeholder="Enter your email"
            required
          />

          <label htmlFor="contact-subject">Subject</label>
          <input
            id="contact-subject"
            type="text"
            placeholder="What is this about?"
            required
          />

          <label htmlFor="contact-message">Your Message</label>
          <textarea
            id="contact-message"
            rows="5"
            placeholder="Write your message..."
            required
          />

          <button type="submit" className="contact-button">
            Send Message
          </button>
        </form>
      </section>
    </main>
  );
}

export default Contact;
