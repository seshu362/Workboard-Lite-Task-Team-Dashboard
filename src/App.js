import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Team from './components/Team';
import Projects from './components/Projects';
import TaskBoard from './components/TaskBoard';

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/team" element={<Team />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/project/:projectId/tasks" element={<TaskBoard />} />
      </Routes>
    </Layout>
  );
}

export default App;