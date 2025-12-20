import Squares from "./Squares"; 

export default function Background() {
  return (
    <div className="fixed inset-0 z-0 pointer-events-none">
      <Squares
        direction="diagonal"
        speed={0.4}
        squareSize={40}
        borderColor="#5cc8c7"
        hoverFillColor="#fa6d80"
      />
    </div>
  );
}
