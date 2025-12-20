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
    <div className="min-h-screen text-[#fbeda5] px-12 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-semibold text-[#fa6d80]">Dashboard</h1>
          <div className="flex gap-4">
            <button
              onClick={() => setTab("primary")}
              className={`px-6 py-3 rounded-full font-medium ${
                tab === "primary" ? "bg-[#deeb24] text-black" : "bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
              }`}
            >
              Personal
            </button>
            <button
              onClick={() => setTab("secondary")}
              className={`px-6 py-3 rounded-full font-medium ${
                tab === "secondary" ? "bg-[#deeb24] text-black" : "bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
              }`}
            >
              Teammates
            </button>
          </div>
        </div>

        {message && <p className="text-sm text-[#deeb24] mb-4">{message}</p>}

        {tab === "primary" && (
          <div className="rounded-2xl bg-[#425765]/80 border border-[#5cc8c7]/10 p-12">
            <div className="space-y-8">
              <div className="space-y-3">
                <label className="block text-lg font-medium text-[#fbeda5]">Full name</label>
                <input name="name" value={primaryForm.name} onChange={handlePrimaryChange} className="w-full rounded-xl bg-[#5cc8c7]/20 border border-[#5cc8c7]/30 px-6 py-4 text-[#fbeda5] text-lg" />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-[#fbeda5]">Age</label>
                  <input name="age" type="number" min="0" value={primaryForm.age} onChange={handlePrimaryChange} placeholder="Age" className="w-full rounded-xl bg-[#5cc8c7]/20 border border-[#5cc8c7]/30 px-6 py-4 text-[#fbeda5] text-lg" />
                </div>
                <div className="space-y-3 md:col-span-2">
                  <label className="block text-lg font-medium text-[#fbeda5]">Institution</label>
                  <input name="institution" value={primaryForm.institution} onChange={handlePrimaryChange} placeholder="Institution" className="w-full rounded-xl bg-[#5cc8c7]/20 border border-[#5cc8c7]/30 px-6 py-4 text-[#fbeda5] text-lg" />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#fbeda5]">Skills you have</h3>
                <SkillSelect selected={primaryForm.skillsHave} setSelected={(s) => setPrimaryForm((p) => ({ ...p, skillsHave: s }))} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-[#fbeda5]">GitHub</label>
                  <input name="github" value={primaryForm.links.github} onChange={handlePrimaryChange} placeholder="GitHub" className="w-full rounded-xl bg-[#5cc8c7]/20 border border-[#5cc8c7]/30 px-6 py-4 text-[#fbeda5] text-lg" />
                </div>
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-[#fbeda5]">X (Twitter)</label>
                  <input name="x" value={primaryForm.links.x} onChange={handlePrimaryChange} placeholder="X (Twitter)" className="w-full rounded-xl bg-[#5cc8c7]/20 border border-[#5cc8c7]/30 px-6 py-4 text-[#fbeda5] text-lg" />
                </div>
                <div className="space-y-3">
                  <label className="block text-lg font-medium text-[#fbeda5]">Portfolio</label>
                  <input name="portfolio" value={primaryForm.links.portfolio} onChange={handlePrimaryChange} placeholder="Portfolio" className="w-full rounded-xl bg-[#5cc8c7]/20 border border-[#5cc8c7]/30 px-6 py-4 text-[#fbeda5] text-lg" />
                </div>
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#fbeda5]">Developer type</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {developerTypes.map((type) => (
                    <button
                      key={type.value}
                      onClick={() => setPrimaryForm((p) => ({ ...p, developerType: type.value }))}
                      className={`px-6 py-4 rounded-xl text-lg font-medium transition ${primaryForm.developerType === type.value ? "border-2 border-[#fa6d80] bg-[#fa6d80]/20 text-[#fbeda5]" : "border-2 border-[#5cc8c7]/10 bg-[#425765]/40 text-[#deeb24] hover:border-[#5cc8c7]/30"}`}
                    >
                      {type.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <button
                  onClick={() => navigate("/matches")}
                  className="px-8 py-4 rounded-xl bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20 text-lg font-medium"
                >
                  ← Back
                </button>
                <button onClick={savePrimary} disabled={loading} className="px-8 py-4 rounded-xl bg-[#deeb24] text-black text-lg font-semibold">{loading?"Saving...":"Save Preferences"}</button>
              </div>
            </div>
          </div>
        )}

        {tab === "secondary" && (
          <div className="rounded-2xl bg-[#425765]/80 border border-[#5cc8c7]/10 p-12">
            <div className="space-y-8">
              <div className="space-y-4">
                <h3 className="text-2xl font-semibold text-[#fbeda5]">Skills you want in teammates</h3>
                <SkillSelect selected={secondaryForm.skillsWant} setSelected={(s) => setSecondaryForm((p) => ({ ...p, skillsWant: s }))} />
              </div>

              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-[#fbeda5]">Preferred teammate type</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {teammatePreferences.map((pref) => (
                    <button
                      key={pref.value}
                      onClick={() => setSecondaryForm((p) => ({ ...p, teammatePreference: pref.value }))}
                      className={`px-6 py-4 rounded-xl text-lg font-medium transition ${secondaryForm.teammatePreference === pref.value ? "border-2 border-[#fa6d80] bg-[#fa6d80]/20 text-[#fbeda5]" : "border-2 border-[#5cc8c7]/10 bg-[#425765]/40 text-[#deeb24] hover:border-[#5cc8c7]/30"}`}
                    >
                      {pref.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between pt-8">
                <button
                  onClick={() => navigate("/matches")}
                  className="px-8 py-4 rounded-xl bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20 text-lg font-medium"
                >
                  ← Back
                </button>
                <button onClick={saveSecondary} disabled={loading} className="px-8 py-4 rounded-xl bg-[#deeb24] text-black text-lg font-semibold">{loading?"Saving...":"Save Preferences"}</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
