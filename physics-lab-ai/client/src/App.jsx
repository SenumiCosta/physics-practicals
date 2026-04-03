import { Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './LanguageContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Simulate from './pages/Simulate';
import History from './pages/History';

export default function App() {
  return (
    <LanguageProvider>
      <div className="min-h-screen bg-dark-900">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/simulate" element={<Simulate />} />
            <Route path="/history" element={<History />} />
          </Routes>
        </main>
      </div>
    </LanguageProvider>
  );
}
