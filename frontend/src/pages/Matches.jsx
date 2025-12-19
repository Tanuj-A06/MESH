import ChromaGrid from "../components/ChromaGrid";

export default function Matches() {
  return (
    <div className="relative min-h-screen text-white px-12 pt-16">
      
      {/* Page heading */}
      <h1 className="font-heading text-4xl mb-10">
        Your Matches
      </h1>

      {/* Grid */}
      <ChromaGrid />
    </div>
  );
}
