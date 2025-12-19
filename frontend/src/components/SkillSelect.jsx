import { useState, useEffect } from "react";
import { skillsAPI } from "../services/api";

// Fallback skills in case API fails
const FALLBACK_SKILLS = [
  { id: 1, name: "React", slug: "react" },
  { id: 2, name: "Vue.js", slug: "vue" },
  { id: 3, name: "Angular", slug: "angular" },
  { id: 4, name: "Node.js", slug: "nodejs" },
  { id: 5, name: "Python", slug: "python" },
  { id: 6, name: "Django", slug: "django" },
  { id: 7, name: "FastAPI", slug: "fastapi" },
  { id: 8, name: "PostgreSQL", slug: "postgresql" },
  { id: 9, name: "MongoDB", slug: "mongodb" },
  { id: 10, name: "Docker", slug: "docker" },
  { id: 11, name: "TypeScript", slug: "typescript" },
  { id: 12, name: "AWS", slug: "aws" },
  { id: 13, name: "Kubernetes", slug: "kubernetes" },
  { id: 14, name: "GraphQL", slug: "graphql" },
  { id: 15, name: "Redis", slug: "redis" },
  { id: 16, name: "Tailwind CSS", slug: "tailwind" },
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
    <div className="flex flex-wrap gap-2.5">
      {skills.map((skill) => (
        <button
          key={skill.id}
          type="button"
          onClick={() => toggleSkill(skill.id)}
          className={`px-6 py-2 rounded-full border text-sm transition
            ${
              selected.includes(skill.id)
                ? "bg-white text-black border-white"
                : "border-gray-600 text-gray-300 hover:border-white"
            }`}
        >
          {skill.icon && <span className="mr-1">{skill.icon}</span>}
          {skill.name}
        </button>
      ))}
    </div>
  );
}
