import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signInWithPopup, signOut, signInAnonymously } from 'firebase/auth';
import { auth, googleProvider } from './firebase';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Features from './components/Features';
import Gallery from './components/Gallery';
import Staff from './components/Staff';
import Rules from './components/Rules';
import Footer from './components/Footer';
import AdminDashboard from './components/AdminDashboard'; // Import New Component
import ScrollProgress from './components/ScrollProgress';
import BackToTop from './components/BackToTop';
import MouseTrail from './components/MouseTrail';
import LoginModal from './components/LoginModal';

// Main Layout for Public Pages
const MainLayout: React.FC<{ user: User | null; isAdmin: boolean; onLogin: () => void; onLogout: () => void }> = ({ user, isAdmin, onLogin, onLogout }) => {
  return (
    <>
      <Navbar onLogin={onLogin} onLogout={onLogout} user={user} />
      <ScrollProgress />
      <BackToTop />
      <MouseTrail />
      <main>
        <Hero />
        <Features />
        <Gallery isAdmin={isAdmin} />
        <Staff isAdmin={isAdmin} />
        <Rules />
      </main>
      <Footer />
    </>
  );
};

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(true); // Treat all logged-in users (including anonymous) as Admin for Showcase
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLoginClick = () => {
    setIsLoginModalOpen(true);
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console.");
    }
  };

  const handleDemoLogin = async () => {
    try {
      await signInAnonymously(auth);
      setIsLoginModalOpen(false);
    } catch (error) {
      console.error("Demo login failed", error);
      alert("Demo login failed. Check console.");
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-rush-950 flex items-center justify-center text-white">Loading...</div>;

  return (
    <Router>
      <div className="min-h-screen bg-rush-950 font-sans selection:bg-neon-pink selection:text-white">
        <LoginModal
          isOpen={isLoginModalOpen}
          onClose={() => setIsLoginModalOpen(false)}
          onGoogleLogin={handleGoogleLogin}
          onDemoLogin={handleDemoLogin}
        />
        <Routes>
          <Route path="/" element={<MainLayout user={user} isAdmin={isAdmin} onLogin={handleLoginClick} onLogout={handleLogout} />} />
          <Route
            path="/admin"
            element={user ? <AdminDashboard /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
