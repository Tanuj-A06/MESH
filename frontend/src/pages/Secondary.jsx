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
    <div className="min-h-screen text-white flex justify-center px-6 py-20">
      <div className="w-full max-w-3xl rounded-2xl bg-[#0d0d0d]/80 border border-white/10 px-10 py-12 space-y-14">

        <div className="space-y-6">
          <h1 className="text-3xl font-semibold">
            What are you looking for?
          </h1>
          <p className="text-gray-400">
            Tell us what skills you want in your teammates
          </p>
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-medium">
            Skills you want in teammates
          </h2>

          <SkillSelect
            selected={skillsWant}
            setSelected={setSkillsWant}
          />
        </div>

        <div className="space-y-6">
          <h2 className="text-xl font-medium">Preferred teammate type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teammatePreferences.map((pref) => (
              <button
                key={pref.value}
                type="button"
                onClick={() => setTeammatePreference(pref.value)}
                className={`px-4 py-3 rounded-xl border transition ${
                  teammatePreference === pref.value
                    ? "border-purple-500 bg-purple-500/20 text-white"
                    : "border-white/10 bg-black/40 text-gray-400 hover:border-white/30"
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}

        <button
          onClick={handleContinue}
          disabled={loading}
          className="w-full rounded-xl bg-white text-black py-4 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Saving..." : "Find Matches →"}
        </button>

      </div>
    </div>
  );
}
