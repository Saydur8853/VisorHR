import { useState, useEffect, useRef } from "react";
import "./index.css";

const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";
const authBase = `${apiBaseUrl.replace(/\/$/, "")}/auth`;

const Button = ({ children, variant = "primary", className = "", ...props }) => {
  const classes = ["btn-pill", variant === "ghost" ? "ghost" : "", className].join(" ").trim();
  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
};

const CursorGlow = () => {
  const dotRef = useRef(null);

  useEffect(() => {
    const dot = dotRef.current;
    if (!dot) return;
    const move = (e) => {
      dot.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
    };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, []);

  return <div className="cursor-glow" ref={dotRef} aria-hidden="true" />;
};

const FieldControl = ({ field, value, onChange, empCode }) => {
  const { name, label, type = "text", options = [], warnIfEmpty } = field;
  const placeholder = name === "date_of_birth" ? "dd-mmm-yyyy" : label;
  const base = { name, value, onChange, placeholder, required: !!warnIfEmpty };
  const isEmpty = warnIfEmpty && (!value || `${value}`.trim() === "");
  const inputProps = { ...base };
  const datePickerRef = useRef(null);
  const fieldClass = warnIfEmpty ? "field required" : "field";

  if (type === "date") {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const cutoff = new Date(now);
    cutoff.setFullYear(cutoff.getFullYear() - 18);
    const maxDate = cutoff.toISOString().split("T")[0];
    const minDate = "1900-01-01";
    const isoFromValue = () => {
      if (!value) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) return value;
      const parsed = Date.parse(value);
      if (Number.isNaN(parsed)) return "";
      const d = new Date(parsed);
      const iso = new Date(d.getFullYear(), d.getMonth(), d.getDate()).toISOString().split("T")[0];
      return iso;
    };
    const formatDisplay = () => {
      if (!value) return "";
      if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        const d = new Date(value + "T00:00:00");
        return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }).replace(/ /g, "-");
      }
      return value;
    };
    const displayValue = formatDisplay();
    const pickerValue = isoFromValue();

    const openPicker = () => {
      if (datePickerRef.current?.showPicker) {
        datePickerRef.current.showPicker();
      } else {
        datePickerRef.current?.click();
      }
    };

    const handleDateSelect = (e) => {
      onChange({ ...e, target: { ...e.target, name, value: e.target.value, type: "date" } });
    };

    return (
      <label className={`${fieldClass} ${isEmpty ? "field-error" : ""}`} key={name}>
        <span>
          {label}
          {warnIfEmpty && <span className="required-star">*</span>}
        </span>
        <div className="date-input-wrapper">
          <input
            type="text"
            name={name}
            value={displayValue}
            onChange={onChange}
            placeholder="dd-mmm-yyyy"
            autoComplete="off"
            className="date-text-input"
          />
          <button type="button" className="date-picker-btn" onClick={openPicker} aria-label="Open date picker">
            <svg width="18" height="18" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
              <path
                d="M32.25,6H29V8h3V30H4V8H7V6H3.75A1.78,1.78,0,0,0,2,7.81V30.19A1.78,1.78,0,0,0,3.75,32h28.5A1.78,1.78,0,0,0,34,30.19V7.81A1.78,1.78,0,0,0,32.25,6Z"
                fill="currentColor"
              ></path>
              <rect x="8" y="14" width="2" height="2" fill="currentColor"></rect>
              <rect x="14" y="14" width="2" height="2" fill="currentColor"></rect>
              <rect x="20" y="14" width="2" height="2" fill="currentColor"></rect>
              <rect x="26" y="14" width="2" height="2" fill="currentColor"></rect>
              <rect x="8" y="19" width="2" height="2" fill="currentColor"></rect>
              <rect x="14" y="19" width="2" height="2" fill="currentColor"></rect>
              <rect x="20" y="19" width="2" height="2" fill="currentColor"></rect>
              <rect x="26" y="19" width="2" height="2" fill="currentColor"></rect>
              <rect x="8" y="24" width="2" height="2" fill="currentColor"></rect>
              <rect x="14" y="24" width="2" height="2" fill="currentColor"></rect>
              <rect x="20" y="24" width="2" height="2" fill="currentColor"></rect>
              <rect x="26" y="24" width="2" height="2" fill="currentColor"></rect>
              <path
                d="M10,10a1,1,0,0,0,1-1V3A1,1,0,0,0,9,3V9A1,1,0,0,0,10,10Z"
                fill="currentColor"
              ></path>
              <path
                d="M26,10a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V9A1,1,0,0,0,26,10Z"
                fill="currentColor"
              ></path>
              <rect x="13" y="6" width="10" height="2" fill="currentColor"></rect>
            </svg>
          </button>
          <input
            ref={datePickerRef}
            type="date"
            min={minDate}
            max={maxDate}
            value={pickerValue}
            onChange={handleDateSelect}
            className="native-date-input"
            aria-hidden="true"
          />
        </div>
      </label>
    );
  }

  if (type === "select") {
    const formatLabel = (opt) => {
      if (opt === "") return "Select";
      // Keep abbreviations like blood groups intact
      return /^[A-Z0-9+\-]+$/.test(opt) ? opt : opt.charAt(0).toUpperCase() + opt.slice(1);
    };
    const fieldClass = warnIfEmpty ? "field required" : "field";
    return (
      <label className={fieldClass} key={name}>
        <span>
          {label}
          {warnIfEmpty && <span className="required-star">*</span>}
        </span>
        <select name={name} value={value} onChange={onChange}>
          {options.map((opt) => (
            <option value={opt} key={opt || "blank"}>
              {formatLabel(opt)}
            </option>
          ))}
        </select>
      </label>
    );
  }

  if (type === "file") {
    const inputId = `file-${name}`;
    const code = (empCode || "EMP").trim() || "EMP";
    const extFromFile = value?.name?.split(".").pop()?.toLowerCase();
    const ext = extFromFile && extFromFile.length <= 5 ? extFromFile : "jpg";
    const isSignature = name === "emp_signature";
    const baseName = isSignature ? `sig-${code}` : code;
    const displayName = value ? `${baseName}.${ext}` : isSignature ? "Upload signature" : "Upload photo";
    const fileClass = warnIfEmpty ? "field required" : "field";
    return (
      <div className={`${fileClass} ${isEmpty ? "field-error" : ""}`} key={name}>
        <span>
          {label}
          {warnIfEmpty && <span className="required-star">*</span>}
        </span>
        <div className="file-input">
          <input id={inputId} type="file" name={name} onChange={onChange} accept="image/*" />
          <label htmlFor={inputId} className="file-label">
            {isSignature ? (
              <svg width="20" height="20" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="M17,33.9c-3.9,0-7.9-1.5-10.5-4.5c-0.9,0.7-2,1.3-3.1,1.8c-0.5,0.2-1.1,0-1.3-0.5c-0.2-0.5,0-1.1,0.5-1.3c1-0.4,1.9-0.9,2.7-1.5c-1.2-1.9-1.9-4.3-1.9-7.1c0-5.3,2.5-8.1,4.8-8.1c1.5,0,3.2,1.2,3.2,4.7c0,4.7-1.1,8.2-3.5,10.8c2.2,2.6,5.6,3.9,9,3.9c0.6,0,1,0.4,1,1S17.6,33.9,17,33.9z M8.2,14.6c-1,0-2.8,1.8-2.8,6.1c0,2.2,0.5,4.1,1.4,5.6c1.8-2.1,2.7-5.1,2.7-9.1C9.5,15.7,9,14.6,8.2,14.6z"
                  fill="#ffff"
                />
                <path
                  d="M33.3,4.8c-0.8-1.4-2.1-2.4-3.6-2.8c-0.5-0.1-1.1,0.2-1.2,0.7l-0.9,3.4l-1.6-2.8c-0.1-0.2-0.4-0.4-0.7-0.5c-0.3-0.1-0.6,0-0.8,0.2c-1.1,0.8-1.8,1.9-2.2,3.2l-4.2,15.4c-0.4,1.5-0.2,3.2,0.6,4.6c0.6,1.1,1.6,1.9,2.7,2.5l-1.1,4c-0.1,0.5,0.2,1.1,0.7,1.2c0.1,0,0.2,0,0.3,0c0.4,0,0.8-0.3,1-0.7l1.1-3.9c0.2,0,0.4,0,0.6,0c1,0,2-0.3,3-0.8c1.4-0.8,2.4-2.1,2.8-3.6l1.6-5.8c0,0,0,0,0,0l1.6-5.8c0.1-0.4,0-0.8-0.4-1.1c-0.3-0.2-0.8-0.3-1.1-0.1l-4,2.3l0.6-2.1l5.7-3.2c0.3-0.2,0.5-0.5,0.5-0.8C34.2,7.1,33.9,5.9,33.3,4.8z M24.2,6.8c0.1-0.5,0.3-0.9,0.6-1.3l1.9,3.4l-1.4,5.1l-2.1-3.7L24.2,6.8zM20.4,25.2c-0.5-0.9-0.7-2-0.4-3l2.5-9.2l2.1,3.7L23.2,22c0,0,0,0,0,0l-1.3,4.7C21.3,26.4,20.8,25.9,20.4,25.2z M27.7,24.3c-0.3,1-0.9,1.9-1.9,2.4c-0.6,0.4-1.3,0.5-2,0.5L25,23l3.7-2.1L27.7,24.3z M30.3,15.1l-0.8,3.1l-3.7,2.1l0.8-3.1L30.3,15.1zM28.6,9.6l0.1-0.4c0.1-0.1,0.1-0.3,0.1-0.4l1.2-4.5c0.6,0.3,1.1,0.9,1.5,1.5c0.3,0.6,0.5,1.2,0.5,1.8L28.6,9.6z"
                  fill="#ffff"
                />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="-2 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                <path
                  d="m18.845 17.295c-1.008-1.345-2.437-2.327-4.089-2.754l-.051-.011-1.179 1.99c-.002.552-.448.998-1 1-.55 0-1-.45-1.525-1.774 0-.009 0-.021 0-.032 0-.691-.56-1.25-1.25-1.25s-1.25.56-1.25 1.25v.033-.002c-.56 1.325-1.014 1.774-1.563 1.774-.552-.002-.998-.448-1-1l-1.142-1.994c-1.702.44-3.13 1.421-4.126 2.746l-.014.019c-.388.629-.628 1.386-.655 2.197v.007c.005.15 0 .325 0 .5v2c0 1.105.895 2 2 2h15.5c1.105 0 2-.895 2-2v-2c0-.174-.005-.35 0-.5-.028-.817-.268-1.573-.666-2.221l.011.02zm-14.345-12.005c0 2.92 1.82 7.21 5.25 7.21 3.37 0 5.25-4.29 5.25-7.21 0-.019 0-.042 0-.065 0-2.9-2.351-5.25-5.25-5.25s-5.25 2.351-5.25 5.25v.068z"
                  fill="#ffff"
                />
              </svg>
            )}
            <span>{displayName}</span>
          </label>
        </div>
      </div>
    );
  }

  return (
    <label className={`${fieldClass} ${isEmpty ? "field-error" : ""}`} key={name}>
      <span>
        {label}
        {warnIfEmpty && <span className="required-star">*</span>}
      </span>
      <input {...inputProps} />
    </label>
  );
};

function App() {
  const [activeTab, setActiveTab] = useState("login");
  const [registerForm, setRegisterForm] = useState({ username: "", email: "", password: "" });
  const [loginForm, setLoginForm] = useState({ username: "", password: "" });
  const [message, setMessage] = useState({ type: "", text: "" });
  const [user, setUser] = useState(null);
  const [activePage, setActivePage] = useState("overview");
  const [loading, setLoading] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [empForm, setEmpForm] = useState({
    emp_code: "",
    emp_name: "",
    bang_emp_name: "",
    card_no: "",
    emp_photo: "",
    father_name: "",
    bang_father_name: "",
    mother_name: "",
    bang_mother_name: "",
    husband_name: "",
    bang_husband_name: "",
    date_of_birth: "",
    sex: "",
    religion: "",
    blood_group: "",
    marital_status: "",
    nationality: "",
    town_of_birth: "",
    child_male: "",
    child_female: "",
    education: "",
    employement: "",
    passed_year: "",
    last_exp: "",
    curr_activity: "",
    sob: "",
    contractual: "",
    e_mail: "",
    contact_no: "",
    emergency_cell: "",
    emrg_cell_no: "",
    emrg_address: "",
    national_id: "",
    birth_certificate_no: "",
    smart_id: "",
    pasport_no: "",
    tin_no: "",
    nominee_cell_no: "",
    ref_contact_name: "",
    ref_relation: "",
    ref_address: "",
    present_vill: "",
    bang_present_vill: "",
    present_house: "",
    present_ps: "",
    bang_present_ps: "",
    present_dist: "",
    bang_present_dist: "",
    present_address: "",
    bang_present_post: "",
    present_postal_code: "",
    parmanent_house: "",
    parmanent_vill: "",
    bang_permanent_vill: "",
    parmanent_ps: "",
    bang_permanent_ps: "",
    parmanent_dist: "",
    bang_permanent_dist: "",
    permanent_address: "",
    parmenent_address: "",
    bang_permanent_post: "",
    permanent_postal_code: "",
    pre_house_owner: "",
    pre_house_owner_bang: "",
    remarks: "",
    updated_date: "",
  });

  // Admin-gated registration state
  const [usersExist, setUsersExist] = useState(false);
  const [isAdminValidated, setIsAdminValidated] = useState(false);
  const [adminAuthForm, setAdminAuthForm] = useState({ username: "", password: "" });
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [now, setNow] = useState(new Date());
  const avatarLetter = user?.username ? user.username.charAt(0).toUpperCase() : "?";
  const avatarUrl = user?.avatar || user?.avatar_url;
  const storageKey = "visorhr_user";
  const containerClass = user ? "auth-container dashboard-mode" : "auth-container";

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

  // Restore user session from localStorage
  useEffect(() => {
    const saved = localStorage.getItem(storageKey);
    if (!saved) return;
    try {
      const parsed = JSON.parse(saved);
      if (parsed?.username) setUser(parsed);
    } catch (err) {
      console.warn("Failed to parse stored user", err);
    }
  }, []);

  // Close sidebar when logging out or leaving dashboard
  useEffect(() => {
    if (!user) setSidebarOpen(false);
  }, [user]);

  // Live clock for sidebar
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (setter) => (evt) => {
    const { name, value } = evt.target;
    setter((prev) => ({ ...prev, [name]: value }));
  };

  const handleEmpChange = (evt) => {
    const { name, value, files, type } = evt.target;
    const nextValue = type === "file" ? files?.[0] || "" : value;
    if (name === "date_of_birth" && value) {
      const picked = new Date(value);
      const today = new Date();
      picked.setHours(0, 0, 0, 0);
      today.setHours(0, 0, 0, 0);
      const cutoff = new Date(today);
      cutoff.setFullYear(cutoff.getFullYear() - 18);
      if (picked.getFullYear() < 1900) {
        setMessage({ type: "error", text: "Date of birth cannot be earlier than 1900." });
        return;
      }
      if (picked > cutoff) {
        setMessage({ type: "error", text: "Employee must be at least 18 years old." });
        return;
      }
      setMessage({ type: "", text: "" });
    }
    setEmpForm((prev) => ({ ...prev, [name]: nextValue }));
  };

  const handleNav = (page) => {
    setActivePage(page);
    setMessage({ type: "", text: "" });
    setSidebarOpen(false);
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
      // Ensure we always have a user object even if API omits one
      const fallbackUser = { username: payload.username, email: payload.email };
      const nextUser = data.user || fallbackUser;
      setUser(nextUser);
      localStorage.setItem(storageKey, JSON.stringify(nextUser));
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
      localStorage.removeItem(storageKey);
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

  if (user) {
    const clockTime = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
    const clockDate = now.toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" });
    const tzOffsetMinutes = -now.getTimezoneOffset();
    const tzSign = tzOffsetMinutes >= 0 ? "+" : "-";
    const tzAbs = Math.abs(tzOffsetMinutes);
    const tzHours = String(Math.floor(tzAbs / 60)).padStart(2, "0");
    const tzMins = String(tzAbs % 60).padStart(2, "0");
    const gmtLabel = `GMT${tzSign}${tzHours}:${tzMins}`;
    const employeeSections = [
      {
        id: "info",
        title: "Employee Info",
        fields: [
          { name: "emp_code", label: "Employee Code", warnIfEmpty: true },
          { name: "emp_name", label: "Employee Name", warnIfEmpty: true },
          { name: "bang_emp_name", label: "Bangla Name" },
          { name: "card_no", label: "Card No" },
          { name: "emp_photo", label: "Employee Photo", type: "file", warnIfEmpty: true },
          { name: "emp_signature", label: "Employee Signature", type: "file" },
        ],
      },
      {
        id: "personal",
        title: "Personal Details",
        fields: [
          { name: "father_name", label: "Father" },
          { name: "bang_father_name", label: "Father (Bangla)" },
          { name: "mother_name", label: "Mother" },
          { name: "bang_mother_name", label: "Mother (Bangla)" },
          { name: "husband_name", label: "Spouse" },
          { name: "bang_husband_name", label: "Spouse (Bangla)" },
          { name: "date_of_birth", label: "Date of Birth", type: "date", warnIfEmpty: true },
          { name: "sex", label: "Gender", type: "select", options: ["", "male", "female", "other"], warnIfEmpty: true },
          {
            name: "religion",
            label: "Religion",
            type: "select",
            options: ["", "islam", "hindu", "buddhist", "christian", "other"],
            warnIfEmpty: true,
          },
          {
            name: "blood_group",
            label: "Blood Group",
            type: "select",
            options: ["", "A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"],
            warnIfEmpty: true,
          },
          {
            name: "marital_status",
            label: "Marital Status",
            type: "select",
            options: ["", "single", "married", "divorced", "widowed", "other"],
            warnIfEmpty: true,
          },
          { name: "nationality", label: "Nationality", warnIfEmpty: true },
          { name: "town_of_birth", label: "Town of Birth" },
          { name: "child_male", label: "Sons" },
          { name: "child_female", label: "Daughters" },
        ],
      },
      {
        id: "education",
        title: "Education & Work",
        fields: [
          { name: "education", label: "Education" },
          { name: "employement", label: "Employment" },
          { name: "passed_year", label: "Passed Year" },
          { name: "last_exp", label: "Last Experience" },
          { name: "curr_activity", label: "Current Activity" },
          { name: "sob", label: "Source of Business" },
          { name: "contractual", label: "Contractual", type: "select", options: ["", "Y", "N"] },
        ],
      },
      {
        id: "contact",
        title: "Contact & IDs",
        fields: [
          { name: "e_mail", label: "Email" },
          { name: "contact_no", label: "Contact No", warnIfEmpty: true },
          { name: "emergency_cell", label: "Emergency Cell" },
          { name: "emrg_cell_no", label: "Alt Emergency Cell" },
          { name: "emrg_address", label: "Emergency Address" },
          { name: "national_id", label: "National ID", warnIfEmpty: true },
          { name: "birth_certificate_no", label: "Birth Certificate No" },
          { name: "smart_id", label: "Smart ID" },
          { name: "pasport_no", label: "Passport No" },
          { name: "tin_no", label: "TIN No" },
          { name: "nominee_cell_no", label: "Nominee Cell No" },
          { name: "ref_contact_name", label: "Reference Name" },
          { name: "ref_relation", label: "Reference Relation" },
          { name: "ref_address", label: "Reference Address" },
        ],
      },
      {
        title: "Present Address",
        id: "present",
        fields: [
          { name: "present_vill", label: "Present Village", warnIfEmpty: true },
          { name: "bang_present_vill", label: "Present Village (Bangla)" },
          { name: "present_house", label: "Present House" },
          { name: "present_ps", label: "Present PS" },
          { name: "bang_present_ps", label: "Present PS (Bangla)" },
          { name: "present_dist", label: "Present District", warnIfEmpty: true },
          { name: "bang_present_dist", label: "Present District (Bangla)" },
          { name: "present_address", label: "Present Address", warnIfEmpty: true },
          { name: "bang_present_post", label: "Present Post (Bangla)" },
          { name: "present_postal_code", label: "Present Postal Code" },
        ],
      },
      {
        title: "Permanent Address",
        id: "permanent",
        fields: [
          { name: "parmanent_house", label: "Permanent House" },
          { name: "parmanent_vill", label: "Permanent Village", warnIfEmpty: true },
          { name: "bang_permanent_vill", label: "Permanent Village (Bangla)" },
          { name: "parmanent_ps", label: "Permanent PS" },
          { name: "bang_permanent_ps", label: "Permanent PS (Bangla)" },
          { name: "parmanent_dist", label: "Permanent District", warnIfEmpty: true },
          { name: "bang_permanent_dist", label: "Permanent District (Bangla)" },
          { name: "permanent_address", label: "Permanent Address", warnIfEmpty: true },
          { name: "parmenent_address", label: "Permanent Address (Alt)" },
          { name: "bang_permanent_post", label: "Permanent Post (Bangla)" },
          { name: "permanent_postal_code", label: "Permanent Postal Code" },
        ],
      },
      {
        title: "Other",
        id: "other",
        fields: [
          { name: "pre_house_owner", label: "Previous House Owner" },
          { name: "pre_house_owner_bang", label: "Previous House Owner (Bangla)" },
          { name: "remarks", label: "Remarks" },
        ],
      },
    ];

    const sectionsWithPreview = [
      employeeSections[0],
      { id: "photo", title: "Photo Preview", isPhoto: true },
      employeeSections[1],
      ...employeeSections.slice(2),
    ];

    const previewUrl = empForm.emp_photo ? URL.createObjectURL(empForm.emp_photo) : null;
    const signatureUrl = empForm.emp_signature ? URL.createObjectURL(empForm.emp_signature) : null;
    const hasSignature = !!empForm.emp_signature;
    const isSignaturePng =
      !!empForm.emp_signature &&
      typeof empForm.emp_signature.name === "string" &&
      empForm.emp_signature.name.toLowerCase().endsWith(".png");

    const renderEmployeeForm = () => (
      <form
        className="employee-form"
        onSubmit={(e) => {
          e.preventDefault();
          setMessage({ type: "success", text: "Employee draft saved locally." });
        }}
      >
        <div className="section-grid">
          {sectionsWithPreview.map((section, index) => {
            if (section.isPhoto) {
              return (
                <div className="section-card photo-card" key={section.id || index}>
                  <div className="photo-preview-box">
                    {previewUrl ? <img src={previewUrl} alt="Employee" /> : <span>No photo selected</span>}
                  </div>
                  <div
                    className={`signature-preview-box ${hasSignature ? "signature-has" : ""} ${
                      isSignaturePng ? "signature-png" : ""
                    }`}
                  >
                    {signatureUrl ? <img src={signatureUrl} alt="Signature" /> : <span>No signature selected</span>}
                  </div>
                </div>
              );
            }
            return (
              <div
                className={`section-card ${
                  section.id === "info"
                    ? "info-card"
                    : section.id === "personal"
                      ? "personal-card"
                      : section.id === "education"
                        ? "education-card"
                        : section.id === "contact"
                          ? "contact-card"
                          : section.id === "present"
                            ? "present-card"
                            : section.id === "permanent"
                              ? "permanent-card"
                              : section.id === "other"
                                ? "other-card"
                                : ""
                }`}
                key={section.id || section.title || index}
              >
                <div className="section-header">
                  <h3>{section.title}</h3>
                </div>
                <div className="field-grid">
                  {section.fields.map((field) => (
                    <FieldControl
                      field={field}
                      value={empForm[field.name]}
                      onChange={handleEmpChange}
                      empCode={empForm.emp_code}
                      key={field.name}
                    />
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        <div className="section-actions">
          <Button type="submit">Save Draft</Button>
          <Button
            type="button"
            variant="ghost"
            onClick={() => setEmpForm((prev) => Object.fromEntries(Object.keys(prev).map((k) => [k, ""])))}
          >
            Clear Form
          </Button>
        </div>
      </form>
    );

    return (
      <main className={containerClass}>
        <CursorGlow />
        <div className="blob blob-1"></div>
        <div className="blob blob-2"></div>
        <div className="blob blob-3"></div>

        <div className="dashboard-layout">
          <button
            className="sidebar-toggle"
            type="button"
            aria-label="Open navigation"
            onClick={() => setSidebarOpen((open) => !open)}
          >
            <div className="sidebar-toggle-brand">
              <div className="dashboard-brand-icon">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 3C21 3 15 3 12 8C9 13 3 12 3 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <span className="sidebar-title">Visor HR</span>
            </div>
            <div className="hamburger-bars">
              <svg width="24" height="24" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g fill="currentColor">
                  <rect x="21.6" y="53.6" width="10.64" height="5.92" />
                  <rect x="21.62" y="38.36" width="21.12" height="5.92" />
                  <rect x="21.62" y="23.14" width="31.64" height="5.92" />
                </g>
              </svg>
            </div>
          </button>

          <aside className={`dashboard-sidebar ${sidebarOpen ? "open" : ""}`}>
            <button className="sidebar-close" type="button" aria-label="Close navigation" onClick={() => setSidebarOpen(false)}>
              ✕
            </button>
            <div className="sidebar-top">
              <div className="dashboard-brand-icon">
                <svg width="52" height="52" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  <path d="M21 3C21 3 15 3 12 8C9 13 3 12 3 12" stroke="white" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </div>
              <div className="sidebar-branding">
                <h2 className="sidebar-title">Visor HR</h2>
              </div>
            </div>

            <div className="sidebar-clock">
              <div className="clock-row">
                <div className="clock-time">{clockTime}</div>
                <div className="clock-gmt">{gmtLabel}</div>
              </div>
              <div className="clock-date">{clockDate}</div>
            </div>

            <div className="sidebar-nav">
              <button className={`sidebar-nav-item ${activePage === "overview" ? "active" : ""}`} type="button" onClick={() => handleNav("overview")}>
                Overview
              </button>
              <button className={`sidebar-nav-item ${activePage === "employee" ? "active" : ""}`} type="button" onClick={() => handleNav("employee")}>
                Employee
              </button>
              <button className="sidebar-nav-item" type="button">Leave</button>
              <button className="sidebar-nav-item" type="button">Payroll</button>
              <button className="sidebar-nav-item" type="button">Settings</button>
            </div>

              <div className="sidebar-bottom">
                <div className="sidebar-bottom-info">
                  <div className="avatar-circle">
                    {avatarUrl ? <img src={avatarUrl} alt="Profile avatar" /> : <span>{avatarLetter}</span>}
                  </div>
                  <div className="sidebar-user">
                    <span className="user-name">{user.username}</span>
                    {user.email && <span className="user-email">{user.email}</span>}
                  </div>
                </div>
                <button
                  className="logout-bar"
                  type="button"
                  onClick={logout}
                  disabled={loading}
                  aria-label="Logout"
                >
                  {loading ? "Logging out..." : "Logout"}
                </button>
            </div>
          </aside>

          <section className="dashboard-main">
            {sidebarOpen && <div className="sidebar-backdrop" onClick={() => setSidebarOpen(false)}></div>}
            <div className="dashboard-card">
              <div className="dashboard-heading">
                <h2>{activePage === "employee" ? "Employee" : "Overview"}</h2>
              </div>

              {message.text && (
                <div className={`alert ${message.type === "error" ? "alert-error" : "alert-success"}`}>
                  {message.text}
                </div>
              )}

              {activePage === "employee" ? (
                renderEmployeeForm()
              ) : (
                <div className="dashboard-placeholder">
                  <p>Ready to manage your HR tasks.</p>
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    );
  }

  return (
    <main className={containerClass}>
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

                <Button type="submit" disabled={loading}>
                  {loading ? <span className="loader"></span> : "Login"}
                </Button>
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

                  <Button type="submit" disabled={loading || (usersExist && !isAdminValidated)}>
                    {loading ? <span className="loader"></span> : "Register"}
                  </Button>
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
                        <Button type="submit" disabled={adminAuthLoading}>
                          {adminAuthLoading ? <span className="loader"></span> : "Validate Admin"}
                        </Button>

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
