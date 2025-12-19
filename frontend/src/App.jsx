import { Routes, Route } from "react-router-dom";
import Background from "./components/Background";
import ProtectedRoute from "./components/ProtectedRoute";

import Landing from "./pages/landing";
import About from "./pages/About";
import Login from "./pages/login";
import Primary from "./pages/Primary";
import Secondary from "./pages/Secondary"; // ✅ ADD
import Matches from "./pages/Matches";
import Chat from "./pages/Chat";


export default function App() {
  return (
    <div className="relative min-h-screen bg-[#060606] overflow-hidden">
      <Background />

      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/chat" element={<Chat />} />
 
          <Route
            path="/primary" 
            element={
              <ProtectedRoute>
                <Primary />
              </ProtectedRoute>
            }
          />

          {/* ✅ THIS WAS MISSING */}
          <Route
            path="/secondary"
            element={
              <ProtectedRoute>
                <Secondary />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </div>
  );
}
