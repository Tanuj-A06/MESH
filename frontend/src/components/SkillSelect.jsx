import { useState, useEffect } from "react";
import { skillsAPI } from "../services/api";

// Fallback skills in case API fails
const FALLBACK_SKILLS = [
  { id: 1, name: "React", slug: "react", icon: "⚛️" },
  { id: 2, name: "Vue.js", slug: "vue", icon: "🟢" },
  { id: 3, name: "Angular", slug: "angular", icon: "🅰️" },
  { id: 4, name: "Node.js", slug: "nodejs", icon: "🟢" },
  { id: 5, name: "Python", slug: "python", icon: "🐍" },
  { id: 6, name: "Django", slug: "django", icon: "🐍" },
  { id: 7, name: "FastAPI", slug: "fastapi", icon: "⚡" },
  { id: 8, name: "PostgreSQL", slug: "postgresql", icon: "🐘" },
  { id: 9, name: "MongoDB", slug: "mongodb", icon: "🍃" },
  { id: 10, name: "Docker", slug: "docker", icon: "🐳" },
  { id: 11, name: "TypeScript", slug: "typescript", icon: "🔷" },
  { id: 12, name: "AWS", slug: "aws", icon: "☁️" },
  { id: 13, name: "Kubernetes", slug: "kubernetes", icon: "⚓" },
  { id: 14, name: "GraphQL", slug: "graphql", icon: "🔺" },
  { id: 15, name: "Redis", slug: "redis", icon: "🔴" },
  { id: 16, name: "Tailwind CSS", slug: "tailwind", icon: "🎨" },
];

export default function SkillSelect({ selected, setSelected }) {
  const [skills, setSkills] = useState(FALLBACK_SKILLS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadSkills = async () => {
      try {
        const data = await skillsAPI.getAllSkills();
        const skillsList = data.results || data;
        if (skillsList && skillsList.length > 0) {
          setSkills(skillsList);
        }
      } catch (error) {
        console.error("Failed to load skills, using fallback:", error);
        // Keep fallback skills
      } finally {
        setLoading(false);
      }
    };
    loadSkills();
  }, []);

  const toggleSkill = (skillId) => {
    if (selected.includes(skillId)) {
      setSelected(selected.filter((s) => s !== skillId));
    } else {
      setSelected([...selected, skillId]);
    }
  };

  if (loading) {
    return <div className="text-[#9A9A9A] font-body">Loading skills...</div>;
  }

  return (
    <div className="flex flex-wrap gap-3">
      {skills.map((skill) => (
        <button
          key={skill.id}
          type="button"
          onClick={() => toggleSkill(skill.id)}
          className={`px-5 py-2.5 rounded-full border text-sm font-medium transition-all duration-200 font-body
            ${
              selected.includes(skill.id)
                ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                : "bg-white text-[#1A1A1A] border-[#D5CFC5] hover:border-[#1A1A1A]"
            }`}
        >
          {skill.icon && <span className="mr-1.5">{skill.icon}</span>}
          {skill.name}
        </button>
      ))}
    </div>
  );
}
