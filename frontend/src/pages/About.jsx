import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen text-[#1A1A1A] flex justify-center items-center px-8 md:px-16 py-24">
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => navigate("/")}
          className="btn-outline px-5 py-2.5 text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="w-full max-w-3xl">
        <h1 className="text-5xl font-bold mb-10 font-heading">About MESH</h1>

        <div className="flex flex-col gap-8">
          <p className="text-xl leading-relaxed text-[#6B6B6B] font-body">
            <span className="font-semibold text-[#1A1A1A]">MESH</span> is where ideas find people
            — and people find momentum.
          </p>

          <div className="bento-card p-8">
            <p className="text-base leading-relaxed text-[#6B6B6B] font-body">
              Building something great shouldn’t start with endless scrolling, cold DMs, or mismatched teams. MESH exists to change that.
              We help students, developers, designers, and creators connect with the right people
              <span className="text-[#E8734A] font-medium"> based on skills, interests, and what they actually want to build</span>,
              not just profiles or followers.
            </p>
          </div>

          <div className="bento-card p-8">
            <p className="text-base leading-relaxed text-[#6B6B6B] font-body">
              Whether you’re a coder looking for a designer,
              a founder hunting for a solid tech team, or someone with an idea but no starting point,
              <span className="text-[#E8734A] font-medium"> MESH helps you find your match</span>,
              and collaborate instantly through real-time chat.
            </p>
          </div>

          <p className="text-[#1A1A1A] text-lg tracking-wide font-semibold mt-4 font-heading">
            Are You the Missing Skill?<br />
            Match Skills. Build Actual Teams.
          </p>

          <div className="mt-4">
            <button onClick={() => navigate("/login")} className="btn-dark px-8 py-3">
              Get Started
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
