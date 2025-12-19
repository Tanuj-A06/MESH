
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import SkillSelect from "../components/SkillSelect";

export default function Primary() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    age: "",
    institution: "",
    skillsHave: [],
    links: {
      github: "",
      linkedin: "",
      x: "",
      portfolio: ""
    }
  });

  const [errors, setErrors] = useState({});

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

  const handleContinue = () => {
    const newErrors = {};

    if (!form.name.trim()) newErrors.name = "Name is required";
    if (!form.age) newErrors.age = "Age is required";
    if (!form.institution.trim())
      newErrors.institution = "Institution is required";
    if (form.skillsHave.length === 0)
      newErrors.skillsHave = "Select at least one skill";

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      console.log("Primary profile:", form);
      navigate("/secondary");
    }
  };

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
              placeholder="GitHub profile"
              className="rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
            />
            <input
              name="linkedin"
              value={form.links.linkedin}
              onChange={handleChange}
              placeholder="LinkedIn profile"
              className="rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
            />
            <input
              name="x"
              value={form.links.x}
              onChange={handleChange}
              placeholder="X (Twitter) profile"
              className="rounded-xl bg-black/40 border border-white/10 px-5 py-3 focus:outline-none focus:border-white/30"
            />
            <input
              name="portfolio website"
              value={form.links.portfolio}
              onChange={handleChange}
              placeholder="Portfolio website (optional)"
              className="rounded-xl bg-black/50 border border-white/15 px-5 py-3 focus:outline-none focus:border-white/30"
            />
          </div>
        </div>

        {/* STEP 5 — Continue */}
        <div className="pt-6">
          <button
            onClick={handleContinue}
            className="w-full rounded-xl bg-white text-black py-4 font-medium hover:bg-gray-200 transition"
          >
            Continue →
          </button>
        </div>

      </div>
    </div>
  );
}
