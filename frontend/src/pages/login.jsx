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
      <div className="absolute top-6 left-6 z-50">
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 rounded-full bg-[#425765]/50 text-[#fbeda5] hover:bg-[#5cc8c7]/20"
        >
          ← Back
        </button>
      </div>

      <div className="min-h-screen bg-[#425765] text-[#fbeda5] flex items-center justify-center p-16">
        <div className="text-center max-w-md">
          <h1 className="text-4xl mb-4 text-[#fa6d80]">Login</h1>
          <p className="text-[#deeb24]">Sign in to continue and find your perfect dev match.</p>
          
          {error && (
            <p className="text-[#fa6d80] mt-4">{error}</p>
          )}

          <div className="mt-8 space-y-4 text-[#deeb24]">
            <p>✓ Connect with like-minded developers</p>
            <p>✓ Find teammates for your projects</p>
            <p>✓ Match based on skills you need</p>
          </div>

          <div className="mt-8 flex justify-center">
            {loading ? (
              <div className="text-[#fbeda5]">Signing in...</div>
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
