import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

const handleSuccess = (credentialResponse) => {
  if (!credentialResponse?.credential) return;

  const decoded = jwtDecode(credentialResponse.credential);
  localStorage.setItem("user", JSON.stringify(decoded));

  navigate("/primary"); // ✅ START PROFILE FLOW
};



  return (
    <>
      <div className="absolute top-6 right-6 z-50">
        <GoogleLogin
          onSuccess={handleSuccess}
          onError={() => console.log("Login failed")}
        />
      </div>

      <div className="min-h-screen bg-black text-white p-16">
        <h1 className="text-4xl mb-4">Login</h1>
        <p className="text-gray-400">Sign in to continue.</p>
      </div>
    </>
  );
}
