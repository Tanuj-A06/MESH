const SKILLS = [
  "AWS",
  "Angular",
  "Django",
  "Docker",
  "FastAPI",
  "Git",
  "GraphQL",
  "Kotlin",
  "Kubernetes",
  "MongoDB",
  "Node.js",
  "PostgreSQL",
  "Python",
  "React",
  "React Native",
  "Redis",
  "Swift",
  "Tailwind CSS",
  "TypeScript",
  "Vue.js",
 
 
];

export default function SkillSelect({ selected, setSelected }) {
  const toggleSkill = (skill) => {
    if (selected.includes(skill)) {
      setSelected(selected.filter((s) => s !== skill));
    } else {
      setSelected([...selected, skill]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2.5">
      {SKILLS.map((skill) => (
        <button
          key={skill}
          type="button"
          onClick={() => toggleSkill(skill)}
          className={`px-8 py-2 rounded-full border text-sm transition
            ${
              selected.includes(skill)
                ? "bg-white text-black border-white"
                : "border-gray-600 text-gray-300 hover:border-white"
            }`}
        >
          {skill}
        </button>
      ))}
    </div>
  );
}
