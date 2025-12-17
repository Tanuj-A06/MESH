import DotGrid from "../components/DotGrid";

export default function About() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <DotGrid />

      <div className="relative z-10 flex min-h-screen flex-col justify-center px-16">
        <h1 className="text-5xl mb-4">About</h1>
        <p className="text-gray-400 max-w-xl">
          This is the about page.
        </p>
      </div>
    </div>
  );
}
