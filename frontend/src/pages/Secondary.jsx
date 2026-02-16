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
    <div className="min-h-screen text-[#1A1A1A] flex justify-center items-start px-8 md:px-16 py-20">
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => navigate("/primary")}
          className="btn-outline px-5 py-2.5 text-sm"
        >
          ← Back
        </button>
      </div>
      <div className="w-full max-w-3xl bento-card px-10 md:px-14 py-12 space-y-10 overflow-y-auto">

        <div className="space-y-3">
          <h1 className="text-3xl font-bold font-heading">
            What are you looking for?
          </h1>
          <p className="text-[#6B6B6B] text-base font-body">
            Tell us what skills you want in your teammates
          </p>
        </div>

        <div className="space-y-4 mb-8">
          <h2 className="text-xl font-semibold font-heading">
            Skills you want in teammates
          </h2>

          <SkillSelect
            selected={skillsWant}
            setSelected={setSkillsWant}
          />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-heading">Preferred teammate type</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {teammatePreferences.map((pref) => (
              <button
                key={pref.value}
                type="button"
                onClick={() => setTeammatePreference(pref.value)}
                className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 font-body ${
                  teammatePreference === pref.value
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#D5CFC5] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
                }`}
              >
                {pref.label}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="text-[#E8734A] text-sm bg-[#FDF0EB] p-3 rounded-lg font-body">{error}</p>}

        <div className="pt-4">
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full btn-dark py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Find Matches →"}
          </button>
        </div>

      </div>
    </div>
  );
}
