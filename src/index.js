import React from 'react';
import ReactDOM from "react-dom/client";
import App from './App';
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthProvider } from './Context/AuthContext';
import { ChatContextProvider } from './Context/ChatContext';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <AuthProvider>
      <ChatContextProvider>
        <App />
      </ChatContextProvider>
    </AuthProvider>
  </React.StrictMode>
);
