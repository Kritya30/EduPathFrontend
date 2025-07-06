import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage';
import ExamDiscovery from './components/ExamDiscovery';
import CollegeFinder from './components/CollegeFinder';
import Mentorship from './components/Mentorship';
import Community from './components/Community';
import UserProfile from './components/auth/UserProfile';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50 flex flex-col">
          <Header />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/exams" element={<ExamDiscovery />} />
              <Route path="/colleges" element={<CollegeFinder />} />
              <Route path="/mentors" element={<Mentorship />} />
              <Route path="/community" element={<Community />} />
              <Route path="/profile" element={<UserProfile />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

