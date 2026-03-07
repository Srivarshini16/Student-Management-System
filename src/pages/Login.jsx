import { GoogleLogin } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const navigate = useNavigate();

  const handleSuccess = (credentialResponse) => {
    console.log("Login Success:", credentialResponse);
    // Here we would normally send the token to the backend
    // For now, let's just bypass and go to dashboard
    navigate("/");
  };

  const handleError = () => {
    console.log('Login Failed');
  };

  return (
    <div className="auth-wrapper">
      <div className="card auth-card" style={{ padding: "3rem 2rem" }}>
        <div style={{ marginBottom: "2rem" }}>
          <div style={{ width: "48px", height: "48px", background: "var(--primary)", color: "white", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem", fontSize: "1.5rem", fontWeight: "bold" }}>
            E
          </div>
          <h1 className="auth-title">Welcome back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
        </div>

        <div style={{ display: "flex", justifyContent: "center", margin: "2rem 0" }}>
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={handleError}
            useOneTap
            shape="rectangular"
            theme="outline"
            size="large"
          />
        </div>

        <div style={{ fontSize: "0.875rem", color: "var(--text-muted)", marginTop: "2rem" }}>
          By tracking you agree to our Terms and Privacy Policy.
        </div>
      </div>
    </div>
  );
}
