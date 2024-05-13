import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import EntityList from './pages/EntityList';
import EntityPage from './pages/EntityPage';
import CreateEntity from './pages/createEntity';

function HomePage() {
  const [updateEntityListFlag, setUpdateEntityListFlag] = useState(false);

  const updateEntityList = () => {
    setUpdateEntityListFlag(prevFlag => !prevFlag);
  };

  return (
    <div>
      <CreateEntity updateEntityList={updateEntityList} />
      <EntityList key={updateEntityListFlag} /> {/* Pass a key to force re-rendering */}
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
