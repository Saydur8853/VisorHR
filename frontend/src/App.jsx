import { useState } from "react";
import "./index.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const authBase = `${apiBaseUrl.replace(/\/$/, "")}/auth`;

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (setter) => (evt) => {
    const { name, value } = evt.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ type: "", text: "" });
  };

  const submit = async (mode) => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    const payload = mode === "login" ? loginForm : registerForm;
    const url = `${authBase}/${mode}/`;
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(payload),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Request failed");
      }
      setMessage({ type: "success", text: data.message || `${mode} successful` });
      setUser(data.user || null);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(`${authBase}/logout/`, {
        method: "POST",
        credentials: "include",
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Logout failed");
      }
      setMessage({ type: "success", text: data.message || "Logged out" });
      setUser(null);
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setLoading(false);
    }
  };

  const onSubmitLogin = (e) => {
    e.preventDefault();
    submit("login");
  };

  const onSubmitRegister = (e) => {
    e.preventDefault();
    submit("register");
  };

  return (
    <main className="app-shell">
      <header className="topbar">
        <div className="brand-wrap">
          <div className="logo-mark">VH</div>
          <div>
            <div className="brand-name">VisorHR</div>
            <div className="brand-tag">Payroll platform</div>
          </div>
        </div>
        <div className="pill badge">Session auth</div>
      </header>

      <section className="shell-grid">
        <article className="panel panel-info">
          <p className="eyebrow">Welcome back</p>
          <h1>Access payroll securely</h1>
          <p className="lede">
            Use your VisorHR credentials to sign in or create an account. Calls go to the Django
            session endpoints.
          </p>
          <div className="pill-stack">
            <span className="pill subtle">API base: {authBase}</span>
            <span className="pill subtle">CSRF-safe (credentials included)</span>
            <span className="pill subtle">First user becomes superadmin</span>
          </div>
          {user ? (
            <div className="pill highlight">Logged in as {user.username}</div>
          ) : null}
        </article>

        <article className="panel panel-form">
          <div className="tabs">
            <button
              className={`tab ${activeTab === "login" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("login")}
            >
              Login
            </button>
            <button
              className={`tab ${activeTab === "register" ? "active" : ""}`}
              type="button"
              onClick={() => handleTabChange("register")}
            >
              Register
            </button>
          </div>

          {activeTab === "login" ? (
            <form className="form" onSubmit={onSubmitLogin}>
              <label>
                <span>Username</span>
                <input
                  name="username"
                  value={loginForm.username}
                  onChange={handleChange(setLoginForm)}
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  value={loginForm.password}
                  onChange={handleChange(setLoginForm)}
                  autoComplete="current-password"
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Working..." : "Log in"}
                </button>
                <button className="secondary" type="button" onClick={() => handleTabChange("register")}>
                  Create account
                </button>
              </div>
            </form>
          ) : (
            <form className="form" onSubmit={onSubmitRegister}>
              <label>
                <span>Username</span>
                <input
                  name="username"
                  value={registerForm.username}
                  onChange={handleChange(setRegisterForm)}
                  autoComplete="username"
                  required
                />
              </label>
              <label>
                <span>Email (optional)</span>
                <input
                  name="email"
                  type="email"
                  value={registerForm.email}
                  onChange={handleChange(setRegisterForm)}
                  autoComplete="email"
                />
              </label>
              <label>
                <span>Password</span>
                <input
                  name="password"
                  type="password"
                  value={registerForm.password}
                  onChange={handleChange(setRegisterForm)}
                  autoComplete="new-password"
                  required
                />
              </label>
              <div className="form-actions">
                <button type="submit" disabled={loading}>
                  {loading ? "Working..." : "Register"}
                </button>
                {user ? (
                  <button className="secondary" type="button" onClick={logout} disabled={loading}>
                    {loading ? "Working..." : "Log out"}
                  </button>
                ) : null}
              </div>
            </form>
          )}

          {message.text ? (
            <p className={`pill banner ${message.type === "error" ? "pill-error" : "pill-success"}`}>
              {message.text}
            </p>
          ) : null}
        </article>
      </section>
    </main>
  );
}

export default App;
