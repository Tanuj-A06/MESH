import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillSelect from "../components/SkillSelect";

export default function Secondary() {
  const navigate = useNavigate();
  const [skillsWant, setSkillsWant] = useState([]);
  const [error, setError] = useState("");

  const handleContinue = () => {
    if (skillsWant.length === 0) {
      setError("Select at least one skill");
      return;
    }

    // save to localStorage / backend later
    console.log("Secondary skills:", skillsWant);

    navigate("/matches"); // ✅ NEXT STEP
  };

  return (
    <div className="min-h-screen text-white flex justify-center px-6 py-20">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0d0d0d]/80 border border-white/10 px-10 py-12 space-y-14">

        <div className="space-y-6">
          <h2 className="text-xl font-medium">
            Skills you want in teammates
          </h2>

          <SkillSelect
            selected={skillsWant}
            setSelected={setSkillsWant}
          />

          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>

        <button
          onClick={handleContinue}
          className="w-full rounded-xl bg-white text-black py-4 font-medium"
        >
          Continue →
        </button>

      </div>
    </div>
  );
}
