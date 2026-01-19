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
  const [isDemoMode, setIsDemoMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setIsAdmin(true);
        setIsDemoMode(false);
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
    // PURE BYPASS: Setup local state to allow access without Firebase Auth
    setIsDemoMode(true);
    setIsAdmin(true);
    setIsLoginModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      if (!isDemoMode) {
        await signOut(auth);
      }
      setIsDemoMode(false);
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  if (loading) return <div className="min-h-screen bg-rush-950 flex items-center justify-center text-white">Loading...</div>;

  const demoUser = {
    displayName: 'Demo Admin',
    photoURL: 'https://via.placeholder.com/150'
  } as any;

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
          <Route path="/" element={<MainLayout user={user || (isDemoMode ? demoUser : null)} isAdmin={isAdmin || isDemoMode} onLogin={handleLoginClick} onLogout={handleLogout} />} />
          <Route
            path="/admin"
            element={(user || isDemoMode) ? <AdminDashboard isDemo={isDemoMode} /> : <Navigate to="/" />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
