
import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <h2>
            SkillBridge <span>AI</span>
          </h2>

          <p>
            Build your skills. Bridge the gap.
            Become internship-ready.
          </p>
        </div>

        <div className="footer-links">
          <h3>Quick Links</h3>

          <Link to="/">Home</Link>
          <Link to="/dashboard">Dashboard</Link>
          <Link to="/skill-gap">Skill Gap Analysis</Link>
          <Link to="/roadmap">Learning Roadmap</Link>
          <Link to="/resources">Learning Resources</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>
          © {new Date().getFullYear()} SkillBridge AI.
          All rights reserved.
        </p>
      </div>
    </footer>
  );
}

export default Footer;
