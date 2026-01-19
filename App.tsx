import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { onAuthStateChanged, User, signInWithPopup, signOut } from 'firebase/auth';
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(true); // Simulating Admin
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Check console.");
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
    <Router basename="/rushhourrp">
      <div className="min-h-screen bg-rush-950 font-sans selection:bg-neon-pink selection:text-white">
        <Routes>
          <Route path="/" element={<MainLayout user={user} isAdmin={isAdmin} onLogin={handleLogin} onLogout={handleLogout} />} />
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
