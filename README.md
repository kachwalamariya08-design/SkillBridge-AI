
# SkillBridge AI

SkillBridge AI is an AI-powered student career development platform designed to help students from different educational backgrounds build skills, explore career opportunities, and prepare for their professional journeys.

The platform brings learning resources, career guidance, skill development, and career preparation tools together in one place.

## Features

### 1. Student Profile
- Create and manage student profiles.
- Select educational streams, courses, career goals, and skills.
- Get career-related recommendations based on profile information.

### 2. Dashboard
- Personalized career overview.
- Daily learning goals.
- Learning activity calendar.
- Progress tracking and achievement badges.

### 3. Skill Gap Analysis
- Identify skills relevant to selected career goals.
- Understand existing skill gaps.
- Get guidance on skills to improve.

### 4. Learning Roadmap
- Structured learning paths.
- Step-by-step skill development.
- Track learning progress.

### 5. Learning Resources
- Access curated learning materials.
- Explore official learning websites.
- Discover resources based on educational stream and career interests.

### 6. Job Opportunities
- Explore internships and job listings.
- Filter opportunities by location and employment type.
- Save interesting opportunities.

### 7. Resume Checker
- Upload and analyze PDF resumes.
- Review important resume sections.
- Receive suggestions for improvement.
- Download the analysis report.

### 8. Professional Readiness
- Practice professional communication.
- Improve workplace and corporate readiness skills.
- Complete practical exercises.

### 9. Integrated Chatbot
- Get assistance while navigating the platform.
- Receive guidance related to different learning and career features.

## Supported Educational Streams

- Engineering & Technology
- Commerce
- Arts & Humanities
- Management
- Science
- Medical & Healthcare
- Law
- Design & Creative Arts
- Vocational Studies
- Other

## Technology Stack

### Frontend
- React
- JavaScript
- HTML
- CSS
- Vite
- React Router

### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT Authentication
- bcryptjs

### Additional Libraries and Integrations
- PDF.js
- Tesseract.js
- jsPDF
- Adzuna Job Search API

## Project Structure

```text
skillbridge/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── .env
│   └── server.js
├── public/
├── src/
│   ├── components/
│   ├── context/
│   ├── pages/
│   └── ...
├── .gitignore
├── package.json
├── package-lock.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB connection
- Adzuna API credentials for job search functionality

### 1. Clone the Repository

```bash
git clone YOUR_GITHUB_REPOSITORY_URL
cd skillbridge
```

### 2. Install Frontend Dependencies

```bash
npm install
```

### 3. Install Backend Dependencies

```bash
cd backend
npm install
```

### 4. Configure Environment Variables

Create a `.env` file inside the backend folder.

Add the required configuration:

```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
ADZUNA_APP_ID=your_adzuna_app_id
ADZUNA_APP_KEY=your_adzuna_app_key
```

Never upload actual credentials or secret keys to GitHub.

### 5. Start the Backend

From the backend folder:

```bash
npm run dev
```

### 6. Start the Frontend

Open another terminal in the project root:

```bash
npm run dev
```

Open the local URL displayed by Vite in your browser.

## Project Status

SkillBridge AI is under active development. Features and improvements are being added and tested progressively.

## Future Enhancements

- AI-powered career assistance.
- More personalized learning recommendations.
- Enhanced career preparation tools.
- Additional student development features.

## Author

Developed as an independent student project.
