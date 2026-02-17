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
    <div className="min-h-screen text-[#1A1A1A] flex justify-center items-start px-8 md:px-16 py-20">
      {/* Card wrapper */}
      <div className="w-full max-w-3xl bento-card px-10 md:px-14 py-12 space-y-10 overflow-y-auto">

        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-wide font-heading">
            Tell us about yourself
          </h1>
          <p className="text-[#6B6B6B] text-base font-body">
            This helps us build your MESH profile
          </p>
        </div>

        {/* Basic Info */}
        <div className="space-y-6">
          <div>
            <label className="block mb-2 text-sm font-medium text-[#1A1A1A] font-body">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="clean-input"
              placeholder="e.g. Divyanshi Y"
            />
            {errors.name && (
              <p className="text-[#E8734A] text-sm mt-2 bg-[#FDF0EB] p-2 rounded-lg font-body">{errors.name}</p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div>
              <label className="block mb-2 text-sm font-medium text-[#1A1A1A] font-body">Age</label>
              <input
                type="number"
                name="age"
                value={form.age}
                onChange={handleChange}
                className="clean-input"
                placeholder="20"
                min="0"
              />
              {errors.age && (
                <p className="text-[#E8734A] text-sm mt-2 bg-[#FDF0EB] p-2 rounded-lg font-body">{errors.age}</p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium text-[#1A1A1A] font-body">Institution</label>
              <input
                name="institution"
                value={form.institution}
                onChange={handleChange}
                className="clean-input"
                placeholder="e.g. K J Somaiya College of Engineering"
              />
              {errors.institution && (
                <p className="text-[#E8734A] text-sm mt-2 bg-[#FDF0EB] p-2 rounded-lg font-body">{errors.institution}</p>
              )}
            </div>
          </div>
        </div>

        {/* Skills */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-heading">Skills you have</h2>
          <p className="text-[#6B6B6B] text-sm font-body">Select all that apply</p>

          <SkillSelect
            selected={form.skillsHave}
            setSelected={(skills) =>
              setForm({ ...form, skillsHave: skills })
            }
          />

          {errors.skillsHave && (
            <p className="text-[#E8734A] text-sm bg-[#FDF0EB] p-3 rounded-lg font-body">{errors.skillsHave}</p>
          )}
        </div>

        {/* Links */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-heading">Profiles & links</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <input
              name="github"
              value={form.links.github}
              onChange={handleChange}
              placeholder="GitHub profile URL"
              className="clean-input"
            />
            <input
              name="x"
              value={form.links.x}
              onChange={handleChange}
              placeholder="X (Twitter) profile URL"
              className="clean-input"
            />
            <input
              name="portfolio"
              value={form.links.portfolio}
              onChange={handleChange}
              placeholder="Portfolio website (optional)"
              className="clean-input"
            />
          </div>
        </div>

        {/* Developer Type */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold font-heading">What type of developer are you?</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {developerTypes.map((type) => (
              <button
                key={type.value}
                type="button"
                onClick={() => setForm({ ...form, developerType: type.value })}
                className={`px-4 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 font-body ${
                  form.developerType === type.value
                    ? "border-[#1A1A1A] bg-[#1A1A1A] text-white"
                    : "border-[#D5CFC5] bg-white text-[#1A1A1A] hover:border-[#1A1A1A]"
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Continue */}
        <div className="pt-4">
          {errors.submit && (
            <p className="text-[#E8734A] text-sm mb-4 bg-[#FDF0EB] p-3 rounded-lg font-body">{errors.submit}</p>
          )}
          <button
            onClick={handleContinue}
            disabled={loading}
            className="w-full btn-dark py-4 text-base disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Continue \u2192"}
          </button>
        </div>

      </div>
    </div>
  );
}
