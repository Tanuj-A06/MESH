import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
 <div className="relative z-10 min-h-screen flex justify-center items-center text-[#fbeda5]">
  <div className="absolute top-6 left-6 z-50">
    <button
      onClick={() => navigate("/")}
      className="px-4 py-2 rounded-full bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
    >
      ← Back
    </button>
  </div>
  <div className="w-full max-w-4xl px-24">


        <div className="mx-auto max-w-4xl px-8">
          <h1 className="page-heading page-heading-xl mb-20 text-[#fa6d80]">
            About
          </h1>
          <div className="flex flex-col gap-14">

<p className="text-2xl leading-relaxed" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              <span className="font-semibold text-[#deeb24]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>MESH</span> is where ideas find people 
              — and people find momentum..
            </p>

            <p className="text-lg leading-loose max-w-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              <span className="text-[#fbeda5]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Building something great shouldn’t start with endless scrolling, cold DMs, or mismatched teams. MESH exists to change that.
                We help students, developers, designers, and creators connect with the right people</span>
              <span className="text-[#deeb24]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}> based on skills, interests, and what they actually want to build </span>,
              not just profiles or followers.
            </p>

            <p className="text-lg leading-loose max-w-2xl" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              <span className="text-[#fbeda5]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>Whether you’re a coder looking for a designer,
                a founder hunting for a solid tech team, or someone with an idea but no starting point, </span>
              <span className="text-[#deeb24]" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}> MESH helps you find your match </span>,
              and collaborate instantly through real-time chat.
            </p>

            <p className="text-[#deeb24] text-lg tracking-wide" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.8)' }}>
              Are You the Missing Skill?
              Match Skills. Build Actual Teams.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
