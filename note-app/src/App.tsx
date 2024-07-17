import React from "react";
import './App.css';
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { NoteProvider } from "./contexts/NoteContext";
import Login from "./components/login";
import Signup from "./components/Signup";
import Home from "./components/Home";
import Dashboard from "./components/Dashboard"
import { TokenProvider } from "./contexts/TokenContext";
import Chat from "./components/Chat/ChatList";
import { ChatProvider } from "./contexts/ChatContext";

const App: React.FC = () => {
  return (
    <TokenProvider>
      <ChatProvider>
        <NoteProvider>
          <Router>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </Router>
        </NoteProvider>
      </ChatProvider>

    </TokenProvider>
  );
};

export default App;
