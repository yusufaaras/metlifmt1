import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { LanguageProvider } from '@/context/LanguageContext';
import { DataProvider } from '@/context/DataContext';
import CustomCursor from '@/components/CustomCursor';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import FloatingPhone from '@/components/FloatingPhone';
import Home from '@/pages/Home';
import About from '@/pages/About';
import Products from '@/pages/Products';
import Blog from '@/pages/Blog';
import Contact from '@/pages/Contact';
import TelliTerbiye from '@/pages/TelliTerbiye';
import Admin from '@/pages/Admin';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Use instant scroll so the page jumps to top immediately on route change
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  }, [pathname]);
  return null;
}

function PageWrapper({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {children}
    </motion.div>
  );
}

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <>
      <CustomCursor />
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <AnimatePresence mode="wait">
        <Routes location={location} key={location.pathname}>
          <Route path="/" element={<PageWrapper><Home /></PageWrapper>} />
          <Route path="/about" element={<PageWrapper><About /></PageWrapper>} />
          <Route path="/products" element={<PageWrapper><Products /></PageWrapper>} />
          <Route path="/blog" element={<PageWrapper><Blog /></PageWrapper>} />
          <Route path="/contact" element={<PageWrapper><Contact /></PageWrapper>} />
          <Route path="/telli-terbiye" element={<PageWrapper><TelliTerbiye /></PageWrapper>} />
          <Route path="/admin" element={<Admin />} />
        </Routes>
      </AnimatePresence>
      {!isAdmin && <Footer />}
      {!isAdmin && <FloatingPhone />}
    </>
  );
}

export default function App() {
  return (
    <HashRouter>
      <LanguageProvider>
        <DataProvider>
          <AppContent />
        </DataProvider>
      </LanguageProvider>
    </HashRouter>
  );
}
