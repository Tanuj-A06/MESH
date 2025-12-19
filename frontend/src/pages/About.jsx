export default function About() {
  return (
 <div className="relative z-10 min-h-screen flex justify-center py-24">
  <div className="w-full max-w-4xl px-24">


        <div className="mx-auto max-w-4xl px-8">
          <h1 className="page-heading page-heading-xl mb-20">
            About
          </h1>
          <div className="flex flex-col gap-14">

            <p className="text-2xl leading-relaxed">
              <span className="font-semibold">MESH</span> helps builders find the
              right people — fast.
            </p>

            <p className="text-gray-400 text-lg leading-loose max-w-2xl">
              We match developers, designers, and creators based on
              <span className="text-gray-200"> skills, interests, and intent</span>,
              not just profiles or followers.
            </p>

            <p className="text-gray-400 text-lg leading-loose max-w-2xl">
              Connect your GitHub, LinkedIn, and X to see what matters to you  and get 
              <span className="text-gray-200"> smart matches with compatibility scores</span>,
              and collaborate instantly through real-time chat.
            </p>

            <p className="text-gray-300 text-lg tracking-wide">
              Match minds. Build teams. Ship faster.
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
