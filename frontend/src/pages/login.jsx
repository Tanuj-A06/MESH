import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { loginWithGoogle, profile } = useAuth();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSuccess = async (credentialResponse) => {
    if (!credentialResponse?.credential) return;

    setLoading(true);
    setError("");

    try {
      const decoded = jwtDecode(credentialResponse.credential);
      const result = await loginWithGoogle(credentialResponse.credential, decoded);

      if (result.success) {
        if (result.hasProfile) {
          // User already has a profile, go to matches
          navigate("/matches");
        } else {
          // New user, start profile creation flow
          navigate("/primary");
        }
      }
    } catch (err) {
      console.error("Login error:", err);
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="fixed top-8 left-8 z-50">
        <button
          onClick={() => navigate("/")}
          className="btn-outline px-5 py-2.5 text-sm"
        >
          ← Back
        </button>
      </div>

      <div className="min-h-screen text-[#1A1A1A] flex items-center justify-center px-8 md:px-16 py-20">
        <div className="text-center max-w-md bento-card p-10">
          <h1 className="text-4xl mb-4 text-[#1A1A1A] font-bold font-heading">Login</h1>
          <p className="text-[#6B6B6B] text-base mb-8 font-body">Sign in to continue and find your perfect dev match.</p>
          
          {error && (
            <p className="text-[#E8734A] mt-4 bg-[#FDF0EB] p-4 rounded-xl border border-[#E8734A]/30 text-sm font-body">{error}</p>
          )}

          <div className="mt-8 space-y-4 text-[#6B6B6B] text-sm font-body">
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#7BAF6E] text-lg">✓</span>
              <span>Connect with like-minded developers</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#7BAF6E] text-lg">✓</span>
              <span>Find teammates for your projects</span>
            </p>
            <p className="flex items-center justify-center gap-2">
              <span className="text-[#7BAF6E] text-lg">✓</span>
              <span>Match based on skills you need</span>
            </p>
          </div>

          <div className="mt-10 flex justify-center">
            {loading ? (
              <div className="text-[#6B6B6B] text-base font-body">Signing in...</div>
            ) : (
              <GoogleLogin
                onSuccess={handleSuccess}
                onError={() => setError("Login failed")}
              />
            )}
          </div>
        </div>
      </div>
    </>
  );
}
