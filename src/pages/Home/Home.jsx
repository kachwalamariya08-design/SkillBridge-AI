
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <p className="home-eyebrow">
          YOUR PERSONAL AI CAREER GUIDE
        </p>

        <h1>
          Turn Your Skills Into Your Future.
        </h1>

        <p className="home-description">
          Discover your skill gaps, follow a personalized
          learning roadmap, and prepare yourself for
          internships and your dream job.
        </p>

        <a href="/profile" className="home-button">
          Get Started
        </a>
      </section>
    </main>
  );
}

export default Home;
