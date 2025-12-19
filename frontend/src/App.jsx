import { Routes, Route } from "react-router-dom";
import Background from "./components/Background";

import Landing from "./pages/landing";
import About from "./pages/About";
import Login from "./pages/login";
import Primary from "./pages/Primary";

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#060606] overflow-hidden">
      {/* Global background */}
      <Background />

      {/* Routed pages */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
          <Route path="/primary" element={<Primary />} />
        </Routes>
      </div>
    </div>
  );
}
