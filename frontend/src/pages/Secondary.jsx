import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillSelect from "../components/SkillSelect";
import { useAuth } from "../contexts/AuthContext";

export default function Secondary() {
  const navigate = useNavigate();
  const { updateProfile } = useAuth();
  const [skillsWant, setSkillsWant] = useState([]);
  const [teammatePreference, setTeammatePreference] = useState("any");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const teammatePreferences = [
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "fullstack", label: "Full Stack Developer" },
    { value: "devops", label: "DevOps Engineer" },
    { value: "mobile", label: "Mobile Developer" },
    { value: "data", label: "Data Scientist" },
    { value: "ml", label: "ML Engineer" },
    { value: "any", label: "Any Developer" },
  ];

  const handleContinue = async () => {
    if (skillsWant.length === 0) {
      setError("Select at least one skill");
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Update profile with looking_for skills
      await updateProfile({
        looking_for_ids: skillsWant,
        teammate_preference: teammatePreference,
      });

      navigate("/matches");
    } catch (err) {
      console.error("Failed to save preferences:", err);
      setError("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#fbeda5] flex justify-center items-center px-6">
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => navigate("/primary")}
          className="px-4 py-2 rounded-full bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
        >
          ← Back
        </button>
      </div>
      <div className="w-full max-w-3xl h-5/6 rounded-2xl bg-[#425765]/80 border border-[#5cc8c7]/10 px-12 py-16 space-y-20 overflow-y-auto">

        <div className="space-y-16">
          <h1 className="text-3xl font-semibold text-[#fa6d80]">
            What are you looking for?
          </h1>
          <p className="text-[#deeb24]">
            Tell us what skills you want in your teammates
          </p>
        </div>

        <div className="space-y-16 mb-12">
          <h2 className="text-xl font-medium text-[#fa6d80]">
            Skills you want in teammates
          </h2>

          <SkillSelect
            selected={skillsWant}
            setSelected={setSkillsWant}
          />
        </div>

        <div className="space-y-12">
          <h2 className="text-xl font-medium text-[#fa6d80]">Preferred teammate type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {teammatePreferences.map((pref) => (
              <button
                key={pref.value}
                type="button"
                onClick={() => setTeammatePreference(pref.value)}
                className={`px-4 py-3 rounded-xl border transition ${
                  teammatePreference === pref.value
                    ? "border-[#fa6d80] bg-[#fa6d80]/20 text-[#fbeda5]"
                    : "border-[#5cc8c7]/10 bg-[#425765]/40 text-[#deeb24] hover:border-[#5cc8c7]/30"
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <div className="pt-16">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full rounded-xl bg-[#deeb24] text-black py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Find Matches →"}
          </button>
        </div>

      </div>
    </div>
  );
}
