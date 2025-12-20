import { useNavigate } from "react-router-dom";

export default function About() {
  const navigate = useNavigate();
  return (
 <div className="relative z-10 min-h-screen flex justify-center py-24 text-[#fbeda5]">
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

            <p className="text-2xl leading-relaxed">
              <span className="font-semibold text-[#deeb24]">MESH</span> helps builders find the
              right people — fast.
            </p>

            <p className="text-lg leading-loose max-w-2xl">
              <span className="text-[#fbeda5]">We match developers, designers, and creators based on</span>
              <span className="text-[#deeb24]"> skills, interests, and intent</span>,
              not just profiles or followers.
            </p>

            <p className="text-lg leading-loose max-w-2xl">
              <span className="text-[#fbeda5]">Connect your GitHub, LinkedIn, and X to see what matters to you  and get </span>
              <span className="text-[#deeb24]"> smart matches with compatibility scores</span>,
              and collaborate instantly through real-time chat.
            </p>

            <p className="text-[#deeb24] text-lg tracking-wide">
              Match minds. Build teams. Ship faster.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
