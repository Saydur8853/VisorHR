import { useState, useEffect } from "react";
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
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);

  // Admin-gated registration state
  const [usersExist, setUsersExist] = useState(false);
  const [isAdminValidated, setIsAdminValidated] = useState(false);
  const [adminAuthForm, setAdminAuthForm] = useState({ username: "", password: "" });
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : "?";
  const avatarUrl = user?.avatar || user?.avatar_url;

  // Check if users exist on mount
  useEffect(() => {
    const checkUsers = async () => {
      try {
        const response = await fetch(`${authBase}/check-user-exists/`);
        const data = await response.json();
        if (data.success) {
          setUsersExist(data.users_exist);
        }
      } catch (error) {
        console.error("Failed to check user existence:", error);
      }
    };
    checkUsers();
  }, []);

  // Auto-clear alerts after 3 seconds
  useEffect(() => {
    if (!message.text) return undefined;
    const timer = setTimeout(() => setMessage({ type: "", text: "" }), 3000);
    return () => clearTimeout(timer);
  }, [message]);

  if (user) {
    return (
      <main className="auth-container">
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="dashboard-layout">
          <aside className="dashboard-sidebar">
            <div className="sidebar-top">
              <div className="dashboard-brand-icon">
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 3C21 3 15 3 12 8C9 13 3 12 3 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div>
                <h2 className="sidebar-title">Visor HR</h2>
                <p className="sidebar-subtitle">Human Resource Hub</p>
              </div>
            </div>

            <div className="sidebar-bottom">
              <div className="avatar-circle">
                {avatarUrl ? <img src={avatarUrl} alt="Profile avatar" /> : <span>{avatarLetter}</span>}
              </div>
              <div className="sidebar-user">
                <span className="user-name">{user.username}</span>
                {user.email && <span className="user-email">{user.email}</span>}
              </div>
              <button className="btn-pill btn-logout" onClick={logout} disabled={loading}>
                {loading ? <span className="loader"></span> : "Logout"}
              </button>
            </div>
          </aside>

          <section className="dashboard-main">
            <div className="dashboard-card">
              <div className="dashboard-heading">
                <h2>Dashboard</h2>
                <p>Welcome back, {user.username}.</p>
              </div>

              {message.text && (
                <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
                  {message.text}
                </div>
              )}

              <div className="dashboard-placeholder">
                <p>Ready to manage your HR tasks.</p>
              </div>
            </div>
          </section>
        </div>
      </main>
    );
  }

  const handleChange = (setter) => (evt) => {
    const { name, value } = evt.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setMessage({ type: "", text: "" });
    // Reset admin validation when switching tabs
    setIsAdminValidated(false);
    setAdminAuthForm({ username: "", password: "" });
  };

  const validateAdmin = async (e) => {
    e.preventDefault();
    setAdminAuthLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await fetch(`${authBase}/validate-admin/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(adminAuthForm),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || "Validation failed");
      }
      setIsAdminValidated(true);
      setMessage({ type: "success", text: "Admin validated. You can now register users." });
    } catch (error) {
      setMessage({ type: "error", text: error.message });
    } finally {
      setAdminAuthLoading(false);
    }
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
    <main className="auth-container">
      {/* Background Blobs */}
      <div className="blob blob-1"></div>
      <div className="blob blob-2"></div>
      <div className="blob blob-3"></div>

      <div className="auth-content">
        {/* Left Section: Branding */}
        <div className="auth-brand">
          <div className="brand-logo">
            {/* Simple Bird Icon SVG */}
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
              <path d="M21 3C21 3 15 3 12 8C9 13 3 12 3 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className="brand-title">Visor HR</h1>
          <p className="brand-subtitle">Human Resource Management System</p>
          <p className="brand-copyright">© 2025 Visor HR. All rights reserved.</p>
        </div>

        {/* Right Section: Login Card */}
        <div className="auth-card-wrapper">
          <div className="auth-card glass">
            <div className="auth-header">
              <h2>{activeTab === "login" ? "Welcome Back" : "Create Account"}</h2>
            </div>

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
              <form className="form form-animate" onSubmit={onSubmitLogin}>
                <div className="input-group">
                  <input
                    id="login-username"
                    name="username"
                    value={loginForm.username}
                    onChange={handleChange(setLoginForm)}
                    autoComplete="username"
                    required
                    placeholder="Username"
                    className="input-pill"
                  />
                </div>
                <div className="input-group">
                  <div className="password-wrapper">
                    <input
                      id="login-password"
                      name="password"
                      type={showLoginPassword ? "text" : "password"}
                      value={loginForm.password}
                      onChange={handleChange(setLoginForm)}
                      autoComplete="current-password"
                      required
                      placeholder="Password"
                      className="input-pill"
                    />
                    <button
                      type="button"
                      className="password-toggle"
                      onMouseDown={() => setShowLoginPassword(true)}
                      onMouseUp={() => setShowLoginPassword(false)}
                      onMouseLeave={() => setShowLoginPassword(false)}
                      aria-label="Show password while pressed"
                    >
                      {showLoginPassword ? (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M3 3L21 21M10.5 10.677A2 2 0 1013.5 13.677M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6C15.718 6 19.111 9.01 21 12a15.66 15.66 0 01-2.119 2.798M17 17L3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      ) : (
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                          <path d="M12 5C8.24 5 4.82 7.58 3 12c1.82 4.42 5.24 7 9 7s7.18-2.58 9-7c-1.82-4.42-5.24-7-9-7zm0 11.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor" />
                        </svg>
                      )}
                    </button>
                  </div>
                </div>

                <button type="submit" className="btn-pill" disabled={loading}>
                  {loading ? <span className="loader"></span> : "Login"}
                </button>
              </form>
            ) : (
              <div className="register-wrapper">
                <form className={`form form-animate ${usersExist && !isAdminValidated ? 'form-blur' : ''}`} onSubmit={onSubmitRegister}>
                  <div className="input-group">
                    <input
                      id="reg-username"
                      name="username"
                      value={registerForm.username}
                      onChange={handleChange(setRegisterForm)}
                      autoComplete="username"
                      required
                      placeholder="Choose a username"
                      className="input-pill"
                    />
                  </div>
                  <div className="input-group">
                    <input
                      id="reg-email"
                      name="email"
                      type="email"
                      value={registerForm.email}
                      onChange={handleChange(setRegisterForm)}
                      autoComplete="email"
                      placeholder="Email (Optional)"
                      className="input-pill"
                    />
                  </div>
                  <div className="input-group">
                    <div className="password-wrapper">
                      <input
                        id="reg-password"
                        name="password"
                        type={showRegPassword ? "text" : "password"}
                        value={registerForm.password}
                        onChange={handleChange(setRegisterForm)}
                        autoComplete="new-password"
                        required
                        placeholder="Create a strong password"
                        className="input-pill"
                      />
                      <button
                        type="button"
                        className="password-toggle"
                        onMouseDown={() => setShowRegPassword(true)}
                        onMouseUp={() => setShowRegPassword(false)}
                        onMouseLeave={() => setShowRegPassword(false)}
                        aria-label="Show password while pressed"
                      >
                        {showRegPassword ? (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M3 3L21 21M10.5 10.677A2 2 0 1013.5 13.677M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6C15.718 6 19.111 9.01 21 12a15.66 15.66 0 01-2.119 2.798M17 17L3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        ) : (
                          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M12 5C8.24 5 4.82 7.58 3 12c1.82 4.42 5.24 7 9 7s7.18-2.58 9-7c-1.82-4.42-5.24-7-9-7zm0 11.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor" />
                          </svg>
                        )}
                      </button>
                    </div>
                  </div>

                  <button type="submit" className="btn-pill" disabled={loading || (usersExist && !isAdminValidated)}>
                    {loading ? <span className="loader"></span> : "Register"}
                  </button>
                </form>

                {/* Admin Auth Overlay */}
                {usersExist && !isAdminValidated && activeTab === "register" && (
                  <div className="admin-auth-overlay">
                    <div className="admin-auth-modal">
                      <h3>Admin Authorization Required</h3>
                      <form onSubmit={validateAdmin}>
                        <div className="input-group">
                          <input
                            type="text"
                            name="username"
                            value={adminAuthForm.username}
                            onChange={handleChange(setAdminAuthForm)}
                            placeholder="Username or Email"
                            className="input-pill"
                            required
                          />
                        </div>
                        <div className="input-group">
                          <div className="password-wrapper">
                            <input
                              type={showAdminPassword ? "text" : "password"}
                              name="password"
                              value={adminAuthForm.password}
                              onChange={handleChange(setAdminAuthForm)}
                              placeholder="Password"
                              className="input-pill"
                              required
                            />
                            <button
                              type="button"
                              className="password-toggle"
                              onMouseDown={() => setShowAdminPassword(true)}
                              onMouseUp={() => setShowAdminPassword(false)}
                              onMouseLeave={() => setShowAdminPassword(false)}
                              aria-label="Show password while pressed"
                            >
                              {showAdminPassword ? (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M3 3L21 21M10.5 10.677A2 2 0 1013.5 13.677M7.362 7.561C5.68 8.74 4.279 10.42 3 12c1.889 2.991 5.282 6 9 6 1.55 0 3.043-.523 4.395-1.35M12 6C15.718 6 19.111 9.01 21 12a15.66 15.66 0 01-2.119 2.798M17 17L3 3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              ) : (
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                  <path d="M12 5C8.24 5 4.82 7.58 3 12c1.82 4.42 5.24 7 9 7s7.18-2.58 9-7c-1.82-4.42-5.24-7-9-7zm0 11.5c-2.48 0-4.5-2.02-4.5-4.5S9.52 7.5 12 7.5s4.5 2.02 4.5 4.5-2.02 4.5-4.5 4.5zm0-7c-1.38 0-2.5 1.12-2.5 2.5s1.12 2.5 2.5 2.5 2.5-1.12 2.5-2.5-1.12-2.5-2.5-2.5z" fill="currentColor" />
                                </svg>
                              )}
                            </button>
                          </div>
                        </div>
                        <button type="submit" className="btn-pill" disabled={adminAuthLoading}>
                          {adminAuthLoading ? <span className="loader"></span> : "Validate Admin"}
                        </button>

                        {/* Show validation messages inside modal */}
                        {message.text && activeTab === "register" && (usersExist && !isAdminValidated) && (
                          <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
                            {message.text}
                          </div>
                        )}
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {message.text && !(usersExist && !isAdminValidated && activeTab === "register") && (
              <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
                {message.text}
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}

export default App;
