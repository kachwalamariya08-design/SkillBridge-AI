
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar/Navbar";
import Footer from "./components/Footer/Footer";
import Chatbot from "./components/Chatbot/Chatbot";
import ProtectedRoute from "./components/ProtectedRoute/ProtectedRoute";

import Services from "./pages/Services/Services";
import Home from "./pages/Home/Home";
import About from "./pages/About/About";
import Contact from "./pages/Contact/Contact";
import Profile from "./pages/Profile/Profile";
import Dashboard from "./pages/Dashboard/Dashboard";
import SkillGap from "./pages/SkillGap/SkillGap";
import Roadmap from "./pages/Roadmap/Roadmap";
import ResumeChecker from "./pages/ResumeChecker/ResumeChecker";
import Opportunities from "./pages/Opportunities/Opportunities";
import LearningResources from "./components/LearningResources/LearningResources";
import ProfessionalReadiness from "./pages/ProfessionalReadiness/ProfessionalReadiness";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";

import { ThemeProvider } from "./context/ThemeContext";
import { AuthProvider } from "./context/AuthContext";

import "./App.css";

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <div className="app">
            <Navbar />

            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/about" element={<About />} />
              <Route path="/services" element={<Services />} />
              <Route path="/contact" element={<Contact />} />

              {/* Protected Student Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/skill-gap" element={<SkillGap />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/resources" element={<LearningResources />} />
                <Route
                  path="/resume-checker"
                  element={<ResumeChecker />}
                />
                <Route
                  path="/opportunities"
                  element={<Opportunities />}
                />
                <Route
                  path="/professional-readiness"
                  element={<ProfessionalReadiness />}
                />
              </Route>
            </Routes>

            {/* Chatbot remains publicly accessible */}
            <Footer />
            <Chatbot />
          </div>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
