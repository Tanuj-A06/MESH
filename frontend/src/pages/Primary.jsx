import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SkillSelect from "../components/SkillSelect";
import { useAuth } from "../contexts/AuthContext";
import { skillsAPI } from "../services/api";

export default function Primary() {
  const navigate = useNavigate();
  const { user, profile, updateProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [skills, setSkills] = useState([]);
  const [form, setForm] = useState({
    name: "",
    age: "",
    institution: "",
    bio: "",
    developerType: "fullstack",
    skillsHave: [],
    links: {
      github: "",
      linkedin: "",
      x: "",
      portfolio: ""
    }
  });

  const [errors, setErrors] = useState({});

  // Load available skills from backend
  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await skillsAPI.getAllSkills();
        setSkills(data.results || data);
      } catch (err) {
        console.error("Failed to load skills:", err);
      }
    };
    loadSkills();
  }, []);

  // Pre-populate form if user data exists
  useEffect(() => {
    if (user) {
      setForm(prev => ({
        ...prev,
        name: user.name || `${user.given_name || ''} ${user.family_name || ''}`.trim(),
      }));
    }
    if (profile) {
      setForm(prev => ({
        ...prev,
        age: profile.age || "",
        institution: profile.bio || "", // Using bio for institution
        bio: profile.bio || "",
        developerType: profile.developer_type || "fullstack",
        skillsHave: profile.skills?.map(s => s.id) || [],
        links: {
          github: profile.github_url || "",
          linkedin: "",
          x: profile.x_url || "",
          portfolio: profile.portfolio_url || ""
        }
      }));
    }
  }, [user, profile]);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name in form.links) {
      setForm({
        ...form,
        links: { ...form.links, [name]: value }
      });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleContinue = async () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.age) newErrors.age = "Age is required";
    if (!form.institution.trim())
      newErrors.institution = "Institution is required";
    if (form.skillsHave.length === 0)
      newErrors.skillsHave = "Select at least one skill";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      setLoading(true);
      try {
        // Save profile to backend
        const profileData = {
          age: parseInt(form.age),
          bio: form.institution, // Using institution as bio for now
          developer_type: form.developerType,
          github_url: form.links.github,
          x_url: form.links.x,
          portfolio_url: form.links.portfolio,
          skills_ids: form.skillsHave,
        };

        await updateProfile(profileData);
        
        // Store in localStorage for the next step
        localStorage.setItem("primaryProfile", JSON.stringify(form));
        navigate("/secondary");
      } catch (err) {
        console.error("Failed to save profile:", err);
        setErrors({ submit: "Failed to save profile. Please try again." });
      } finally {
        setLoading(false);
      }
    }
  };

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

  return (
    <div className="min-h-screen text-white flex justify-center px-6 py-20">
      {/* Card wrapper */}
      <div className="w-full max-w-3xl rounded-2xl bg-[#0d0d0d]/80 backdrop-blur-md border border-white/10 px-10 py-12 space-y-14">

        {/* STEP 1 — Header */}
        <div className="space-y-10">
          <h1
            className="text-4xl font-semibold tracking-wide"
            style={{ fontFamily: "BBH Bogle, sans-serif" }} 
          >
            Tell us about yourself
          </h1>

          <p className="text-gray-400">
            This helps us build your MESH profile
          </p>

          <p className="text-sm text-gray-500">
            
          </p>
        </div>

        {/* STEP 2 — Basic Info */}
        <div className="space-y-10">
          <div>
            <label className="block mb-2 text-sm text-gray-300">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
              placeholder="e.g. Divyanshi Y"
            />
            {errors.name && (
              <p className="text-red-400 text-sm mt-1">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-4">

            <div>
              <label className="block mb-2 text-sm text-gray-300">
                Age
              </label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
                placeholder="20"
              />
              {errors.age && (
                <p className="text-red-400 text-sm mt-1">{errors.age}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm text-gray-300">
                Institution
              </label>
              <input
                name="institution"
                value={form.institution}
                onChange={handleChange}
                className="w-full rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
                placeholder="e.g. K J Somaiya College of Engineering"
              />
              {errors.institution && (
                <p className="text-red-400 text-sm mt-1">
                  {errors.institution}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* STEP 3 — Skills */}
        <div className="space-y-10">
          <h2 className="text-xl font-medium">
            Skills you have
          </h2>
          <p className="text-gray-400 text-sm">
            Select all that apply
          </p>

          <SkillSelect
            selected={form.skillsHave}
            setSelected={(skills) =>
              setForm({ ...form, skillsHave: skills })
            }
          />

          {errors.skillsHave && (
            <p className="text-red-400 text-sm">
              {errors.skillsHave}
            </p>
          )}
        </div>

        {/* STEP 4 — Links */}
        <div className="space-y-50">
          <h2 className="text-xl font-medium">
            Profiles & links
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <input
              name="github"
              value={form.links.github}
              onChange={handleChange}
              placeholder="GitHub profile URL"
              className="rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
            />
            <input
              name="x"
              value={form.links.x}
              onChange={handleChange}
              placeholder="X (Twitter) profile URL"
              className="rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
            />
            <input
              name="portfolio"
              value={form.links.portfolio}
              onChange={handleChange}
              placeholder="Portfolio website (optional)"
              className="rounded-xl bg-black/50 border border-white/15 px-5 py-3 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* STEP 5 — Developer Type */}
        <div className="space-y-6">
          <h2 className="text-xl font-medium">What type of developer are you?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {developerTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setForm({ ...form, developerType: type.value })}
                className={`px-4 py-3 rounded-xl border transition ${
                  form.developerType === type.value
                    ? "border-purple-500 bg-purple-500/20 text-white"
                    : "border-white/10 bg-black/40 text-gray-400 hover:border-white/30"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* STEP 6 — Continue */}
        <div className="pt-6">
          {errors.submit && (
            <p className="text-red-400 text-sm mb-4">{errors.submit}</p>
          )}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full rounded-xl bg-white text-black py-4 font-medium hover:bg-gray-200 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Continue →"}
          </button>
        </div>

      </div>
    </div>
  );
}
