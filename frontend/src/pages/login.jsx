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
      <div className="absolute top-6 right-6 z-50">
        {loading ? (
          <div className="text-white">Signing in...</div>
        ) : (
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => setError("Login failed")}
          />
        )}
      </div>

      <div className="min-h-screen bg-black text-white p-16">
        <h1 className="text-4xl mb-4">Login</h1>
        <p className="text-gray-400">Sign in to continue and find your perfect dev match.</p>
        
        {error && (
          <p className="text-red-400 mt-4">{error}</p>
        )}

        <div className="mt-8 space-y-4 text-gray-500">
          <p>✓ Connect with like-minded developers</p>
          <p>✓ Find teammates for your projects</p>
          <p>✓ Match based on skills you need</p>
        </div>
      </div>
    </>
  );
}
