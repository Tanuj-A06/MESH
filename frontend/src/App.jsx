import { Routes, Route } from "react-router-dom";
import Background from "./components/Background";

import Landing from "./pages/Landing";
import About from "./pages/About";
import Login from "./pages/Login";

export default function App() {
  return (
    <div className="relative min-h-screen bg-[#060606] overflow-hidden">
      
      {/* Background layer */}
      <Background />

      {/* Page content */}
      <div className="relative z-10">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/about" element={<About />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </div>
  );
}
