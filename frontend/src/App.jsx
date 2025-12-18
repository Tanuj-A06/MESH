import { Routes, Route } from "react-router-dom";
import Landing from "./pages/landing.jsx";
import About from "./pages/About.jsx";
import Login from "./pages/login.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/about" element={<About />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}
