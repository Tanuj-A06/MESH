import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { profileAPI, matchesAPI } from "../services/api";

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
);

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 4l11.733 16h4.267l-11.733 -16h-4.267z"/><path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772"/></svg>
);

const GlobeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
);

const ProfileLinks = ({ profile }) => {
  const links = [
    { url: profile?.github_url, icon: <GithubIcon />, label: "GitHub" },
    { url: profile?.x_url, icon: <XIcon />, label: "X" },
    { url: profile?.portfolio_url, icon: <GlobeIcon />, label: "Portfolio" },
  ].filter((l) => l.url);

  if (links.length === 0) return null;

  return (
    <div className="flex gap-2 mb-4">
      {links.map((link) => (
        <a
          key={link.label}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          title={link.label}
          className="w-8 h-8 rounded-full bg-[#EDE8E0] flex items-center justify-center text-[#6B6B6B] hover:text-[#1A1A1A] hover:bg-[#E0D8CD] transition-all duration-200"
        >
          {link.icon}
        </a>
      ))}
    </div>
  );
};

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
      <div className="min-h-screen text-[#1A1A1A] flex items-center justify-center">
        <div className="text-lg text-[#6B6B6B] font-body">Loading suggestions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen text-[#1A1A1A] px-8 md:px-16 pt-20 pb-20">
      {/* Page heading */}
      <div className="flex items-center justify-between mb-12 max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold font-heading">Your Matches</h1>
        <button
          onClick={() => navigate("/dashboard")}
          className="btn-outline px-5 py-2.5 text-sm"
        >
          Edit Profile
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-3 mb-10 max-w-7xl mx-auto">
        <button
          onClick={() => setActiveTab("suggestions")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${
            activeTab === "suggestions"
              ? "bg-[#1A1A1A] text-white"
              : "bg-white border border-[#D5CFC5] text-[#1A1A1A] hover:border-[#1A1A1A]"
          }`}
        >
          Suggestions ({suggestions.length})
        </button>
        <button
          onClick={() => setActiveTab("matches")}
          className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${
            activeTab === "matches"
              ? "bg-[#1A1A1A] text-white"
              : "bg-white border border-[#D5CFC5] text-[#1A1A1A] hover:border-[#1A1A1A]"
          }`}
        >
          Matches ({matches.length})
        </button>
      </div>

      {/* Suggestions Grid */}
      {activeTab === "suggestions" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {suggestions.length === 0 ? (
            <div className="col-span-full text-center py-20 bento-card">
              <p className="text-lg font-medium mb-2 font-heading">No suggestions found.</p>
              <p className="text-[#6B6B6B] font-body">Complete your profile to get matched!</p>
            </div>
          ) : (
            suggestions.map((profile) => (
              <motion.div
                key={profile.id}
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
                className="relative bento-card p-7 hover:shadow-md transition-shadow duration-200"
              >
                {/* Compatibility score badge */}
                {profile.compatibility_score && (
                  <div className="absolute top-4 right-4 px-3 py-1 rounded-full bg-[#EAF4E6] text-[#7BAF6E] text-xs font-medium font-body">
                    {Math.round(profile.compatibility_score)}% match
                  </div>
                )}

                <div className="relative z-10">
                  {/* Avatar */}
                  <div className="w-14 h-14 rounded-full bg-[#E8734A] flex items-center justify-center text-xl font-bold text-white mb-4">
                    {profile.user?.first_name?.[0] || "?"}
                  </div>

                  <h2 className="text-lg font-semibold mb-1 leading-tight font-heading">
                    {profile.user?.first_name} {profile.user?.last_name?.[0]}.
                  </h2>
                  <p className="text-sm text-[#6B6B6B] capitalize mb-4 font-body">
                    {profile.developer_type?.replace("_", " ") || "Developer"}
                  </p>

                  {/* Skills */}
                  <div className="mb-4 flex flex-wrap gap-2">
                    {profile.skills?.slice(0, 4).map((skill) => (
                      <span
                        key={skill.id}
                        className="text-xs px-3 py-1 rounded-full bg-[#EDE8E0] text-[#1A1A1A] font-body"
                      >
                        {skill.name}
                      </span>
                    ))}
                    {profile.skills?.length > 4 && (
                      <span className="text-xs px-3 py-1 rounded-full bg-[#EDE8E0] text-[#6B6B6B] font-body">
                        +{profile.skills.length - 4} more
                      </span>
                    )}
                  </div>

                  {/* Social Links */}
                  <ProfileLinks profile={profile} />

                  {/* Like button */}
                  <button
                    onClick={() => handleLike(profile.id)}
                    disabled={likedProfiles.has(profile.id)}
                    className={`w-full py-2.5 rounded-full text-sm font-medium transition-all duration-200 font-body ${
                      likedProfiles.has(profile.id)
                        ? "bg-[#EAF4E6] text-[#7BAF6E] cursor-default"
                        : "bg-[#1A1A1A] text-white hover:bg-[#333]"
                    }`}
                  >
                    {likedProfiles.has(profile.id) ? "\u2713 Liked" : "\u2764\uFE0F Like"}
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      )}

      {/* Matches Grid */}
      {activeTab === "matches" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {matches.length === 0 ? (
            <div className="col-span-full text-center py-20 bento-card">
              <p className="text-lg font-medium mb-2 font-heading">No matches yet.</p>
              <p className="text-[#6B6B6B] font-body">Like profiles to get matched!</p>
            </div>
          ) : (
            matches.map((match) => {
              const otherProfile = 
                match.user1_profile?.id === currentUserProfileId
                  ? match.user2_profile
                  : match.user1_profile;

              return (
                <motion.div
                  key={match.id}
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="relative bento-card p-7 hover:shadow-md transition-shadow duration-200"
                >
                  <div className="absolute top-5 right-5">
                    <span className="px-3 py-1 rounded-full bg-[#FDF0EB] text-[#E8734A] text-xs font-medium font-body">
                      Matched!
                    </span>
                  </div>

                  <div className="relative z-10">
                    <div className="w-14 h-14 rounded-full bg-[#7BAF6E] flex items-center justify-center text-xl font-bold text-white mb-4">
                      {otherProfile?.user?.first_name?.[0] || "?"}
                    </div>

                    <h2 className="text-lg font-semibold mb-1 leading-tight font-heading">
                      {otherProfile?.user?.first_name}{" "}
                      {otherProfile?.user?.last_name?.[0]}.
                    </h2>
                    <p className="text-sm text-[#6B6B6B] capitalize mb-4 font-body">
                      {otherProfile?.developer_type?.replace("_", " ") ||
                        "Developer"}
                    </p>

                    <div className="mb-4 flex flex-wrap gap-2">
                      {otherProfile?.skills?.slice(0, 3).map((skill) => (
                        <span
                          key={skill.id}
                          className="text-xs px-3 py-1 rounded-full bg-[#EDE8E0] text-[#1A1A1A] font-body"
                        >
                          {skill.name}
                        </span>
                      ))}
                    </div>

                    {/* Social Links */}
                    <ProfileLinks profile={otherProfile} />

                    <button
                      onClick={() => handleStartChat(match.id)}
                      className="w-full btn-accent py-2.5 text-sm"
                    >
                      \uD83D\uDCAC Start Chat
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
