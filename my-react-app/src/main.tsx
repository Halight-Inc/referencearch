import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import React from 'react';
import "./index.css";
import App from "./App.tsx";
import ReactDOM from "react-dom/client";
import { SplitFactoryProvider } from "@splitsoftware/splitio-react";
import Home from "./pages/Home.tsx";
import Helloworld from "./pages/Helloworld.tsx";

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

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/Home" element={<Home />} />
        <Route path="/hello" element={<Helloworld />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
