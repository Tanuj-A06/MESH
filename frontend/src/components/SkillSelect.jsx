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
    return <div className="text-gray-500">Loading skills...</div>;
  }

  return (
    <div className="flex flex-wrap gap-4">
      {skills.map((skill) => (
        <button
          key={skill.id}
          type="button"
          onClick={() => toggleSkill(skill.id)}
          className={`px-8 py-3 rounded-full border text-base font-medium transition
            ${
              selected.includes(skill.id)
                ? "bg-white text-black border-white"
                : "border-[#5cc8c7]/50 text-[#fbeda5] hover:border-[#5cc8c7]"
            }`}
        >
          {skill.icon && <span className="mr-1">{skill.icon}</span>}
          {skill.name}
        </button>
      ))}
    </div>
  );
}
