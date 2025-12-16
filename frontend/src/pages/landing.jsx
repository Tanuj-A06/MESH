import React from "react";
import Squares from "../components/Squares";

const Landing = () => {
  return (
    <div className="relative w-screen h-screen bg-[#060606] overflow-hidden">
      
      {/* Background layer */}
      <div className="fixed inset-0 z-0">
        <Squares
          direction="diagonal"
          speed={0.4}
          squareSize={50}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      {/* Text layer (does NOT block mouse interactions) */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full pointer-events-none text-center">
        
        {/* Move text slightly upward */}
        <div className="-translate-y-18">
          
          {/* Main heading */}
          <h1
            className="text-white text-8xl tracking-widest drop-shadow-[0_0_20px_rgba(255,255,255,0.15)]"

            style={{ fontFamily: "Sekuya, sans-serif" }}
          >
            MESH
          </h1>

          {/* Subheading */}
          <p
            className="mt-4 text-lg text-gray-400"
            style={{ fontFamily: "Anta, sans-serif" }}
          >
            Match minds. Build teams. Ship faster.
          </p>

        </div>
      </div>

    </div>
  );
};

export default Landing;
