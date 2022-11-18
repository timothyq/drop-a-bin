import Header from "./Header";
import Footer from "./Footer";
import PastePage from "./paste/PastePage";
import LoginPage from "./login/LoginPage";
import HubPage from "./hub/HubPage";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { useState } from "react";

function App() {
  const [currentUser, setCurrentUser] = useState(
    window.localStorage.getItem("username")
  );

  function onLogin(username) {
    window.localStorage.setItem("username", username);
    setCurrentUser(username);
  }

  function onLogout() {
    window.localStorage.removeItem("username");
    setCurrentUser(null);
  }

  const hubPage = <HubPage currentUser={currentUser} />;
  const loginPage = <LoginPage onLogin={onLogin} />;
  const pastePage = <PastePage currentUser={currentUser} />;

  return (
    <div className="container col-lg-6 col-md-8 col-sm-12">
      <BrowserRouter>
        <Header currentUser={currentUser} onLogout={onLogout} />
        <main className="container">
          <Routes>
            <Route path="/" element={hubPage} />
            <Route path="/login" element={loginPage} />
            <Route path="/paste" element={pastePage} />
            <Route path="/paste/:pasteId" element={pastePage} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
