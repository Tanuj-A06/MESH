import React from "react";
import { useNavigate } from "react-router-dom";
import Squares from "../components/Squares";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-screen bg-[#425765] overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#5cc8c7"
          hoverFillColor="#fa6d80"
        />
      </div>

      {/* Foreground – TRUE CENTER */}
      <div className="relative z-10 flex min-h-screen items-center justify-center text-center pointer-events-none">
        
        {/* Content stack */}
        <div className="flex flex-col items-center gap-8">

          {/* Title + subtitle */}
          <div className="flex flex-col items-center gap-2">
            <h1
              className="text-[#fa6d80] text-8xl tracking-widest"
              style={{ fontFamily: "Sekuya, sans-serif" }}
            >
              MESH
            </h1>

            <p
              className="text-[#deeb24] text-lg"
              style={{ fontFamily: "Anta, sans-serif" }}
            >
              You’re Someone’s Missing Skill.
            </p>
          </div>

          {/* Buttons (UNCHANGED DESIGN) */}
          <div className="flex flex-col gap-4 pointer-events-auto">
            <button
              onClick={() => navigate("/about")}
              className="
              min-w-[140px]
              px-8 py-3
              rounded-full
              border border-[#5cc8c7]/40
              text-[#fbeda5] text-base font-medium
              hover:bg-[#deeb24] hover:text-black
              focus:outline-none focus:ring-2 focus:ring-[#5cc8c7]/30
              transition-all duration-200
            "
            >
              About
            </button>

            <button
              onClick={() => navigate("/login")}
              className="
              min-w-[140px]
              px-8 py-3
              rounded-full
              border border-[#5cc8c7]/40
              text-[#fbeda5] text-base font-medium
              hover:bg-[#deeb24] hover:text-black
              focus:outline-none focus:ring-2 focus:ring-[#5cc8c7]/30
              transition-all duration-200
            "
            >
              Login
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};
export default Landing;

