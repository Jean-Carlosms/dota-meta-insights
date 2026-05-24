import { Navigate, Route, Routes } from 'react-router-dom';
import Dashboard from './pages/Dashboard.jsx';
import HeroDetail from './pages/HeroDetail.jsx';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/heroes/:heroId" element={<HeroDetail />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
