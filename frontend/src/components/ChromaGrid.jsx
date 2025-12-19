import { motion } from "framer-motion";

const cards = [
  {
    name: "Aarav",
    role: "Frontend Developer",
    skills: ["React", "Tailwind", "UI"],
  },
  {
    name: "Ishita",
    role: "Backend Developer",
    skills: ["Node", "MongoDB", "APIs"],
  },
  {
    name: "Kabir",
    role: "ML Engineer",
    skills: ["Python", "TensorFlow", "AI"],
  },
  {
    name: "Diya",
    role: "Designer",
    skills: ["Figma", "Branding", "UX"],
  },
];

export default function ChromaGrid() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {cards.map((card, i) => (
        <motion.div
          key={i}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300 }}
          className="relative rounded-xl p-6 bg-[#0d0d0d] border border-white/10 overflow-hidden"
        >
          {/* Chroma glow */}
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-blue-500/20 opacity-0 hover:opacity-100 transition-opacity" />

          <div className="relative z-10">
            <h2 className="text-xl font-semibold">{card.name}</h2>
            <p className="text-sm text-gray-400">{card.role}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              {card.skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="text-xs px-2 py-1 rounded-full bg-white/10"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
