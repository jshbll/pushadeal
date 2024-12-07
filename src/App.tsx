import React, { useState, useEffect } from 'react';
import EmailTemplateBuilder from './EmailTemplateBuilder';
import Login from './components/Login';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-container">
          <EmailTemplateBuilder />
        </div>
      )}
    </>
  );
}

export default App;