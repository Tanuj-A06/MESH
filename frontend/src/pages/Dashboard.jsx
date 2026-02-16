import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillSelect from "../components/SkillSelect";
import { useAuth } from "../contexts/AuthContext";
import { skillsAPI } from "../services/api";

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [tab, setTab] = useState("primary");
  const [skills, setSkills] = useState([]);

  const [primaryForm, setPrimaryForm] = useState({
    name: "",
    age: "",
    institution: "",
    bio: "",
    developerType: "fullstack",
    skillsHave: [],
    links: { github: "", x: "", portfolio: "" },
  });

  const [secondaryForm, setSecondaryForm] = useState({
    skillsWant: [],
    teammatePreference: "any",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const developerTypes = [
    { value: "frontend", label: "Frontend Developer" },
    { value: "backend", label: "Backend Developer" },
    { value: "fullstack", label: "Full Stack Developer" },
    { value: "devops", label: "DevOps Engineer" },
    { value: "mobile", label: "Mobile Developer" },
    { value: "data", label: "Data Scientist" },
    { value: "ml", label: "ML Engineer" },
    { value: "other", label: "Other" },
  ];

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

  useEffect(() => {
    const load = async () => {
      try {
        const data = await skillsAPI.getAllSkills();
        setSkills(data.results || data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
  }, []);

  useEffect(() => {
    if (user) {
      setPrimaryForm((p) => ({ ...p, name: user.name || "" }));
    }
    if (profile) {
      setPrimaryForm({
        name: user?.name || "",
        age: profile.age || "",
        institution: profile.bio || "",
        bio: profile.bio || "",
        developerType: profile.developer_type || "fullstack",
        skillsHave: profile.skills?.map((s) => s.id) || [],
        links: {
          github: profile.github_url || "",
          x: profile.x_url || "",
          portfolio: profile.portfolio_url || "",
        },
      });

      setSecondaryForm({
        skillsWant: profile.looking_for?.map((s) => s.id) || [],
        teammatePreference: profile.teammate_preference || "any",
      });
    }
  }, [user, profile]);

  const handlePrimaryChange = (e) => {
    const { name, value } = e.target;
    if (name in primaryForm.links) {
      setPrimaryForm((prev) => ({
        ...prev,
        links: { ...prev.links, [name]: value },
      }));
    } else {
      setPrimaryForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const savePrimary = async () => {
    setLoading(true);
    setMessage("");
    try {
      await updateProfile({
        age: primaryForm.age ? parseInt(primaryForm.age) : undefined,
        bio: primaryForm.institution,
        developer_type: primaryForm.developerType,
        github_url: primaryForm.links.github,
        x_url: primaryForm.links.x,
        portfolio_url: primaryForm.links.portfolio,
        skills_ids: primaryForm.skillsHave,
      });
      setMessage("Primary details saved.");
      navigate("/matches");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save primary details.");
    } finally {
      setLoading(false);
    }
  };

  const saveSecondary = async () => {
    setLoading(true);
    setMessage("");
    try {
      await updateProfile({
        looking_for_ids: secondaryForm.skillsWant,
        teammate_preference: secondaryForm.teammatePreference,
      });
      setMessage("Preferences saved.");
      navigate("/matches");
    } catch (err) {
      console.error(err);
      setMessage("Failed to save preferences.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-[#1A1A1A] px-8 md:px-16 py-20">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1 className="text-3xl font-bold font-heading">Dashboard</h1>
          <div className="flex gap-3">
            <button
              onClick={() => setTab("primary")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${
                tab === "primary" ? "bg-[#1A1A1A] text-white" : "bg-white border border-[#D5CFC5] text-[#1A1A1A] hover:border-[#1A1A1A]"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setTab("secondary")}
              className={`px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${
                tab === "secondary" ? "bg-[#1A1A1A] text-white" : "bg-white border border-[#D5CFC5] text-[#1A1A1A] hover:border-[#1A1A1A]"
              }`}
            >
              Teammates
            </button>
          </div>
        </div>

        {message && <p className="text-sm text-[#7BAF6E] mb-4 bg-[#EAF4E6] p-3 rounded-xl font-body">{message}</p>}

        {tab === "primary" && (
          <div className="bento-card p-10 md:p-12">
            <div className="space-y-8">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-[#1A1A1A] font-body">Full name</label>
                <input name="name" value={primaryForm.name} onChange={handlePrimaryChange} className="clean-input" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] font-body">Age</label>
                  <input name="age" type="number" min="0" value={primaryForm.age} onChange={handlePrimaryChange} placeholder="Age" className="clean-input" />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] font-body">Institution</label>
                  <input name="institution" value={primaryForm.institution} onChange={handlePrimaryChange} placeholder="Institution" className="clean-input" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-heading">Skills you have</h3>
                <SkillSelect selected={primaryForm.skillsHave} setSelected={(s) => setPrimaryForm((p) => ({ ...p, skillsHave: s }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] font-body">GitHub</label>
                  <input name="github" value={primaryForm.links.github} onChange={handlePrimaryChange} placeholder="GitHub" className="clean-input" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] font-body">X (Twitter)</label>
                  <input name="x" value={primaryForm.links.x} onChange={handlePrimaryChange} placeholder="X (Twitter)" className="clean-input" />
                </div>
                <div className="space-y-2">
                  <label className="block text-sm font-medium text-[#1A1A1A] font-body">Portfolio</label>
                  <input name="portfolio" value={primaryForm.links.portfolio} onChange={handlePrimaryChange} placeholder="Portfolio" className="clean-input" />
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold font-heading">Developer type</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {developerTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPrimaryForm((p) => ({ ...p, developerType: type.value }))}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${primaryForm.developerType === type.value ? "bg-[#1A1A1A] text-white border border-[#1A1A1A]" : "bg-white border border-[#D5CFC5] text-[#1A1A1A] hover:border-[#1A1A1A]"}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => navigate("/matches")}
                  className="btn-outline px-6 py-2.5 text-sm"
                >
                  ← Back
                </button>
                <button onClick={savePrimary} disabled={loading} className="btn-dark px-8 py-2.5 text-sm">{loading?"Saving...":"Save Preferences"}</button>
              </div>
            </div>
          </div>
        )}

        {tab === "secondary" && (
          <div className="bento-card p-10 md:p-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <h3 className="text-xl font-semibold font-heading">Skills you want in teammates</h3>
                <SkillSelect selected={secondaryForm.skillsWant} setSelected={(s) => setSecondaryForm((p) => ({ ...p, skillsWant: s }))} />
              </div>

              <div className="space-y-3">
                <h3 className="text-lg font-semibold font-heading">Preferred teammate type</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {teammatePreferences.map((pref) => (
                    <button
                      key={pref.value}
                      onClick={() => setSecondaryForm((p) => ({ ...p, teammatePreference: pref.value }))}
                      className={`px-4 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${secondaryForm.teammatePreference === pref.value ? "bg-[#1A1A1A] text-white border border-[#1A1A1A]" : "bg-white border border-[#D5CFC5] text-[#1A1A1A] hover:border-[#1A1A1A]"}`}
                    >
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <button
                  onClick={() => navigate("/matches")}
                  className="btn-outline px-6 py-2.5 text-sm"
                >
                  ← Back
                </button>
                <button onClick={saveSecondary} disabled={loading} className="btn-dark px-8 py-2.5 text-sm">{loading?"Saving...":"Save Preferences"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
