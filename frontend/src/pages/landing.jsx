import React from "react";
import { useNavigate } from "react-router-dom";
import Squares from "../components/Squares";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative w-screen h-screen bg-[#060606] overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      {/* Foreground content */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-center pointer-events-none">
        
        <h1
          className="text-white text-8xl tracking-widest"
          style={{ fontFamily: "Sekuya, sans-serif" }}
        >
          MESH
        </h1>

        <p
          className="mt-4 text-gray-400"
          style={{ fontFamily: "Anta, sans-serif" }}
        >
          Match minds. Build teams. Ship faster.
        </p>

        {/* Buttons */}
        <div className="mt-6 flex gap-4 pointer-events-auto">
          <button
            onClick={() => navigate("/about")}
            className="
              px-6 py-2
              text-sm font-medium
              text-white
              border border-white/40
              rounded-full
              hover:bg-white hover:text-black
              transition
            "
          >
            About
          </button>

          <button
            onClick={() => navigate("/login")}
            className="
              px-6 py-2
              text-sm font-medium
              text-black
              bg-white
              rounded-full
              hover:bg-gray-200
              transition
            "
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default Landing;
