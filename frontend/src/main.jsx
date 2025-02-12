import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/Authentication/AuthPage";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <Router>
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <App />
              </ProtectedRoute>
            }
          />
          <Route path="/api/v1/user/auth/" element={<AuthPage />} />
        </Routes>
      </Router>
    </Provider>
  </StrictMode>
);
