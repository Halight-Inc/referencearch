import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import React from 'react';
import "./index.css";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { SplitFactoryProvider } from "@splitsoftware/splitio-react";
import Home from "./pages/Home.tsx";
import TemplateBuilder from "./pages/TemplateBuilder.tsx";
import MainPage from "./pages/MainPage.tsx";
import store from "./store.tsx"; // Import your Redux store
import { Provider } from 'react-redux'; // Import the Provider
import Login from "./views/pages/login/Login.js"; // Import the Login component
import Register from './views/pages/register/Register.js';
import { Toaster } from "@/components/ui/toaster";
import ScenarioBrowse from '@/pages/ScenarioBrowse.tsx';
import Simulation from '@/pages/Simulation.tsx';

const SPLIT_CLIENT_API_KEY = import.meta.env.VITE_SPLIT_API_KEY;

// Create the config for the SDK factory.
const sdkConfig: SplitIO.IBrowserSettings = {
  core: {
    authorizationKey: SPLIT_CLIENT_API_KEY,
    // key represents your internal user id, or the account id that
    // the user belongs to.
    // This could also be a cookie you generate for anonymous users.
    key: "key",
  },
};

const Root = () => {
  const isLoggedIn = localStorage.getItem('jwtToken') !== null;

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/app" element={<App />} />
          <Route path="/home" element={<Home />} />
          <Route
              path="/"
              element={isLoggedIn ? <ScenarioBrowse /> : <Navigate to="/login" replace />}
          />
          <Route
              path="/simulation/:id"
              element={isLoggedIn ? <Simulation /> : <Navigate to="/login" replace />}
          />
          <Route
              path="/admin"
              element={isLoggedIn ? <TemplateBuilder /> : <Navigate to="/login" replace />}
          />
          <Route
              path="/main/*"
              element={
                isLoggedIn ? <MainPage /> : <Navigate to="/login" replace />
              }
          />
          {/* Catch all route should redirect to login if not logged in. */}
          <Route path="*" element={isLoggedIn ? <Navigate to="/" replace /> : <Navigate to="/login" replace />} />

        </Routes>
      </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    {/* ✅ Wrap the entire app in Provider */}
    <Provider store={store}>
      <SplitFactoryProvider config={sdkConfig}>
        <Root />
        <Toaster />
      </SplitFactoryProvider>
    </Provider>
  </React.StrictMode>
);
