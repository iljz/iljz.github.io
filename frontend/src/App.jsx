import { useState } from 'react';
import { Layout } from './components/layout';
import { Home, Resume, Projects, Publications } from './components/pages';
import './App.css';

function App() {
  const [activeSection, setActiveSection] = useState('home');

  const renderPage = () => {
    switch (activeSection) {
      case 'home':
        return <Home />;
      case 'resume':
        return <Resume />;
      case 'projects':
        return <Projects />;
      case 'publications':
        return <Publications />;
      default:
        return <Home />;
    }
  };

  return (
    <Layout activeSection={activeSection} setActiveSection={setActiveSection}>
      {renderPage()}
    </Layout>
  );
}

export default App;
