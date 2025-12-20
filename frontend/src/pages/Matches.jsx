import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { profileAPI, matchesAPI } from "../services/api";

export default function Matches() {
  const navigate = useNavigate();
  const [suggestions, setSuggestions] = useState([]);
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("suggestions"); // "suggestions" or "matches"
  const [likedProfiles, setLikedProfiles] = useState(new Set());
  const [currentUserProfileId, setCurrentUserProfileId] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Fetch current user's profile to get their profile ID
      const myProfile = await profileAPI.getMyProfile();
      if (myProfile?.id) {
        setCurrentUserProfileId(myProfile.id);
      }
      
      const [suggestionsData, matchesData] = await Promise.all([
        profileAPI.getSuggestions(),
        matchesAPI.getMatches(),
      ]);
      setSuggestions(suggestionsData || []);
      setMatches(matchesData.results || matchesData || []);
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (profileId) => {
    try {
      const result = await profileAPI.likeProfile(profileId);
      setLikedProfiles((prev) => new Set([...prev, profileId]));

      if (result.is_new_match) {
        // Refresh matches if we got a new match
        const matchesData = await matchesAPI.getMatches();
        setMatches(matchesData.results || matchesData || []);
        alert("🎉 It's a match! You can now chat with this person.");
      }
    } catch (error) {
      console.error("Failed to like profile:", error);
    }
  };

  const handleStartChat = (matchId) => {
    navigate(`/chat?matchId=${matchId}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen text-[#fbeda5] flex items-center justify-center">
        <div className="text-xl text-[#5cc8c7]">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen text-[#fbeda5] px-12 pt-16">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-heading text-4xl text-[#fa6d80]">Your Matches</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="px-4 py-2 rounded-full bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-6 py-2 rounded-full transition ${
            activeTab === "suggestions"
              ? "bg-[#deeb24] text-black"
              : "bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
          }`}
        >
          Suggestions ({suggestions.length})
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          className={`px-6 py-2 rounded-full transition ${
            activeTab === "matches"
              ? "bg-[#deeb24] text-black"
              : "bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
          }`}
        >
          Matches ({matches.length})
        </button>
      </div>

      {/* Suggestions Grid */}
      {activeTab === "suggestions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {suggestions.length === 0 ? (
            <p className="text-gray-400 col-span-full">
              No suggestions found. Complete your profile to get matched!
            </p>
          ) : (
            suggestions.map((profile) => (
              <motion.div
                key={profile.id}
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative rounded-xl p-6 bg-[#425765] border border-[#5cc8c7]/10 overflow-hidden"
              >
                {/* Compatibility score badge */}
                {profile.compatibility_score && (
                  <div className="absolute top-4 right-4 px-2 py-1 rounded-full bg-purple-500/20 text-purple-400 text-xs">
                    {Math.round(profile.compatibility_score)}% match
                  </div>
                )}

                {/* Chroma glow */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#5cc8c7]/20 via-[#fa6d80]/20 to-[#deeb24]/20 opacity-0 hover:opacity-100 transition-opacity" />

                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl font-bold mb-4">
                    {profile.user?.first_name?.[0] || "?"}
                  </div>

                  <h2 className="text-xl font-semibold">
                    {profile.user?.first_name} {profile.user?.last_name?.[0]}.
                  </h2>
                  <p className="text-sm text-gray-400 capitalize">
                    {profile.developer_type?.replace("_", " ") || "Developer"}
                  </p>

                  {/* Skills */}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {profile.skills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs px-2 py-1 rounded-full bg-white/10"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {profile.skills?.length > 4 && (
                      <span className="text-xs px-2 py-1 rounded-full bg-white/5 text-gray-500">
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(profile.id)}
                    disabled={likedProfiles.has(profile.id)}
                    className={`mt-4 w-full py-2 rounded-lg transition ${
                      likedProfiles.has(profile.id)
                        ? "bg-[#fa6d80]/20 text-[#fa6d80] cursor-default"
                        : "bg-gradient-to-r from-[#5cc8c7] to-[#fa6d80] hover:opacity-90"
                    }`}
                  >
                    {likedProfiles.has(profile.id) ? "✓ Liked" : "❤️ Like"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Matches Grid */}
      {activeTab === "matches" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {matches.length === 0 ? (
            <p className="text-gray-400 col-span-full">
              No matches yet. Like profiles to get matched!
            </p>
          ) : (
            matches.map((match) => {
              // Determine which profile is the OTHER user (not the current user)
              const otherProfile = 
                match.user1_profile?.id === currentUserProfileId
                  ? match.user2_profile
                  : match.user1_profile;

              return (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.03 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative rounded-xl p-6 bg-[#425765] border border-[#fa6d80]/30 overflow-hidden"
                >
                  <div className="absolute top-4 right-4">
                    <span className="px-2 py-1 rounded-full bg-[#fa6d80]/20 text-[#fa6d80] text-xs">
                      Matched!
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-teal-500 flex items-center justify-center text-2xl font-bold mb-4">
                      {otherProfile?.user?.first_name?.[0] || "?"}
                    </div>

                    <h2 className="text-xl font-semibold">
                      {otherProfile?.user?.first_name}{" "}
                      {otherProfile?.user?.last_name?.[0]}.
                    </h2>
                    <p className="text-sm text-gray-400 capitalize">
                      {otherProfile?.developer_type?.replace("_", " ") ||
                        "Developer"}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {otherProfile?.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="text-xs px-2 py-1 rounded-full bg-white/10"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>

                    <button
                      onClick={() => handleStartChat(match.id)}
                      className="mt-4 w-full py-2 rounded-lg bg-gradient-to-r from-[#fa6d80] to-[#deeb24] hover:opacity-90 transition"
                    >
                      💬 Start Chat
                    </button>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
