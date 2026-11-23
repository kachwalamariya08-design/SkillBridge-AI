
import "./About.css";

function About() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <p className="about-eyebrow">ABOUT SKILLBRIDGE AI</p>

        <h1>Bridging the Gap Between Skills and Careers</h1>

        <p className="about-intro">
          SkillBridge AI helps students understand what they
          already know, identify the skills they need to improve,
          and prepare for real-world job opportunities.
        </p>
      </section>

      <section className="about-content">
        <div className="about-card">
          <h2>Our Mission</h2>
          <p>
            To make career preparation easier by providing
            students with personalized learning guidance,
            practical projects, and internship preparation tools.
          </p>
        </div>

        <div className="about-card">
          <h2>Our Vision</h2>
          <p>
            To help every student build confidence, develop
            industry-relevant skills, and take the next step
            toward their dream career.
          </p>
        </div>

        <div className="about-card">
          <h2>Why SkillBridge AI?</h2>
          <p>
            Instead of following a random learning path,
            students can focus on the skills and projects
            most relevant to their target role.
          </p>
        </div>
      </section>
    </main>
  );
}

export default About;
