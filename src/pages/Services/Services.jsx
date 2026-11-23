
import { Link } from "react-router-dom";
import "./Services.css";

const services = [
  {
    icon: "🎯",
    title: "AI Skill Gap Analysis",
    description:
      "Compare your existing skills with your target job role and identify the skills you need to improve."
  },
  {
    icon: "🗺️",
    title: "Personalized Learning Roadmap",
    description:
      "Get a structured learning plan with topics and resources based on your career goals."
  },
  {
    icon: "💻",
    title: "Project Recommendations",
    description:
      "Discover practical project ideas that help you apply your skills and strengthen your portfolio."
  },
  {
    icon: "🎤",
    title: "Interview Preparation",
    description:
      "Practise technical questions and prepare for internship interviews with greater confidence."
  }
];

function Services() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <p className="services-eyebrow">WHAT WE OFFER</p>
        <h1>Everything You Need to Become Job-Ready</h1>
        <p>
          Turn your career goals into an actionable plan with
          tools designed to help you learn, practise, and grow.
        </p>
      </section>

      <section className="services-grid">
        {services.map((service) => (
          <article className="service-card" key={service.title}>
            <div className="service-icon">{service.icon}</div>
            <h2>{service.title}</h2>
            <p>{service.description}</p>
          </article>
        ))}
      </section>

      <section className="services-cta">
        <h2>Ready to discover your skill gaps?</h2>
        <p>Start building your personalized career journey today.</p>
        <Link to="/profile" className="services-button">
          Get Started
        </Link>
      </section>
    </main>
  );
}

export default Services;
