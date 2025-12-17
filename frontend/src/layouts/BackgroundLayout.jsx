import Squares from "../components/Squares";

export default function BackgroundLayout({ children }) {
  return (
    <div className="relative w-screen min-h-screen bg-[#060606] overflow-hidden">
      
      {/* Background */}
      <div className="fixed inset-0 z-0 h-screen w-screen">
        <Squares
          direction="diagonal"
          speed={0.5}
          squareSize={40}
          borderColor="#333"
          hoverFillColor="#222"
        />
      </div>

      {/* Foreground */}
      <div className="relative z-10 min-h-screen w-full">
        {children}
      </div>
    </div>
  );
}
