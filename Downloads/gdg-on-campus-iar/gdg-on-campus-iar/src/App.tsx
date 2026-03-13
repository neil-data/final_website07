import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { motion, AnimatePresence } from 'motion/react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { Events } from './pages/Events';
import { Leaderboard } from './pages/Leaderboard';
import { Team } from './pages/Team';
import { Contact } from './pages/Contact';
import { Media } from './pages/Media';
import { Announcements } from './pages/Announcements';
import { Profile } from './pages/Profile';
import { AdminDashboard } from './pages/AdminDashboard';
import { useAuthStore } from './store/authStore';
import { ScrollProgress } from './components/Animations';
import { GlobalScene3D } from './components/Scene3D';
import { Chatbot } from './components/Chatbot';
import { CustomCursor } from './components/GSAPAnimations';
import { ImmersiveFX } from './components/ImmersiveFX';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuthStore();
  return isAuthenticated && role === 'Admin' ? <>{children}</> : <Navigate to="/" />;
};

const PageTransition = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 56, rotateX: 8, scale: 0.96, filter: 'blur(8px)' }}
    animate={{ opacity: 1, y: 0, rotateX: 0, scale: 1, filter: 'blur(0px)' }}
    exit={{ opacity: 0, y: -36, rotateX: -5, scale: 0.97, filter: 'blur(6px)' }}
    transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
    style={{ transformStyle: 'preserve-3d', perspective: 1200 }}
  >
    {children}
  </motion.div>
);

const AppLayout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen immersive-root">
      <GlobalScene3D />
      <CustomCursor />
      <ScrollProgress />
      <ImmersiveFX />
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <Routes>
            <Route path="/" element={<PageTransition><Home /></PageTransition>} />
            <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
            <Route path="/register" element={<PageTransition><Register /></PageTransition>} />
            <Route path="/events" element={<PageTransition><Events /></PageTransition>} />
            <Route path="/leaderboard" element={<PageTransition><Leaderboard /></PageTransition>} />
            <Route path="/team" element={<PageTransition><Team /></PageTransition>} />
            <Route path="/contact" element={<PageTransition><Contact /></PageTransition>} />
            <Route path="/media" element={<PageTransition><Media /></PageTransition>} />
            <Route path="/announcements" element={<PageTransition><Announcements /></PageTransition>} />

            <Route path="/profile" element={
              <ProtectedRoute>
                <PageTransition><Profile /></PageTransition>
              </ProtectedRoute>
            } />

            <Route path="/admin/*" element={
              <AdminRoute>
                <PageTransition><AdminDashboard /></PageTransition>
              </AdminRoute>
            } />
          </Routes>
        </AnimatePresence>
      </main>
      {!isAdminRoute && <Footer />}
      <Toaster position="bottom-right" toastOptions={{
        style: {
          background: '#0d1b2a',
          color: '#F8F9FA',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }
      }} />
      <Chatbot />
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <AppLayout />
    </Router>
  );
}
