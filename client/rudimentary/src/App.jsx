import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntityList from './pages/EntityList';
import EntityPage from './pages/EntityPage';
import CreateEntity from './pages/createEntity';

function HomePage() {
  return (
    <div>
      <CreateEntity />
      <EntityList />
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/entities/:entityName" element={<EntityPage />} />
      </Routes>
    </Router>
  );
}

export default App;
