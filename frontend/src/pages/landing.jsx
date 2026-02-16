import React from "react";
import { useNavigate } from "react-router-dom";

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-screen w-screen overflow-hidden">

      {/* Centered content */}
      <div className="flex min-h-screen items-center justify-center text-center px-8 md:px-16 py-16">
        <div className="flex flex-col items-center gap-6 max-w-2xl">

          {/* Title */}
          <h1
            className="text-[#1A1A1A] text-8xl md:text-9xl tracking-wide font-bold"
            style={{ fontFamily: "Playfair Display, serif" }}
          >
            MESH
          </h1>

          {/* Subtitle */}
          <p className="text-[#6B6B6B] text-xl md:text-2xl font-light font-body">
            You're Someone's Missing Skill.
          </p>

          {/* Description */}
          <p className="text-[#6B6B6B] text-base max-w-lg leading-relaxed font-body">
            Connect with like-minded developers, find teammates for your projects,
            and match based on the skills you need.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <button
              onClick={() => navigate("/about")}
              className="btn-outline px-10 py-3.5 text-base"
            >
              Learn More
            </button>

            <button
              onClick={() => navigate("/login")}
              className="btn-dark px-10 py-3.5 text-base"
            >
              Get Started
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};export default Landing;