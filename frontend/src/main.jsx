import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { store, persistor } from "./store/store.js";
import { Provider } from "react-redux";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import AuthPage from "./components/Authentication/AuthPage";
import ProtectedRoute from "./components/Authentication/ProtectedRoute";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "./components/dark-mode/theme-provider";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
                    <App />
                  </ThemeProvider>
                </ProtectedRoute>
              }
            />
            <Route path="/api/v1/user/auth/" element={<AuthPage />} />
          </Routes>
        </Router>
      </PersistGate>
    </Provider>
  </StrictMode>
);
