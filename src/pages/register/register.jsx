import axios from "axios";
import "./register.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
    const [firstName,           setFirstName]           = useState("");
    const [lastName,            setLastName]            = useState("");
    const [email,               setEmail]               = useState("");
    const [phone,               setPhone]               = useState("");
    const [address,             setAddress]             = useState("");
    const [password,            setPassword]            = useState("");
    const [confirmPassword,     setConfirmPassword]     = useState("");
    const [showPassword,        setShowPassword]        = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading,           setIsLoading]           = useState(false);
    const navigate = useNavigate();

    /* ── password requirements ── */
    const requirements = [
        { label: "At least 8 characters",          met: password.length >= 8 },
        { label: "One uppercase letter (A–Z)",      met: /[A-Z]/.test(password) },
        { label: "One lowercase letter (a–z)",      met: /[a-z]/.test(password) },
        { label: "One number (0–9)",                met: /[0-9]/.test(password) },
        { label: "One special character (!@#$...)", met: /[^A-Za-z0-9]/.test(password) },
    ];
    const metCount = requirements.filter((r) => r.met).length;
    const strengthMeta = [
        { label: "",       color: "str-none"   },
        { label: "Weak",   color: "str-weak"   },
        { label: "Weak",   color: "str-weak"   },
        { label: "Fair",   color: "str-fair"   },
        { label: "Good",   color: "str-good"   },
        { label: "Strong", color: "str-strong" },
    ][metCount];

    function handleOnSubmit(e) {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match!");
            return;
        }
        if (metCount < 5) {
            alert("Please meet all password requirements.");
            return;
        }
        setIsLoading(true);
        setTimeout(() => {
            console.log({ firstName, lastName, email, phone, address, password });
            setIsLoading(false);
        }, 1500);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/`, {
            email,
            firstName,
            lastName,
            password,
            address,
            phone,
        }).then(() => {
            toast.success("Registration Success");
            navigate("/login");
        }).catch((err) => {
            toast.error(err?.response?.data?.error || "An error occurred");
        });
    }

    const EyeOff = () => (
        <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
    const EyeOn = () => (
        <svg className="eye-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    return (
        <div className="reg-page">
            <div className="reg-wrapper">
                <form onSubmit={handleOnSubmit}>
                    <div className="reg-card">

                        {/* ── Logo ── */}
                        <div className="reg-logo-wrap">
                            <img src="123.webp" alt="logo" className="reg-logo" />
                        </div>

                        {/* ── Header ── */}
                        <h1 className="reg-title">Create Account</h1>
                        <p className="reg-subtitle">Fill in your details to get started</p>

                        {/* ── First Name & Last Name ── */}
                        <div className="name-row">
                            <div className="reg-field">
                                <label className="reg-label">FIRST NAME</label>
                                <div className="reg-input-wrap">
                                    <input
                                        type="text"
                                        placeholder="First name"
                                        className="reg-input"
                                        value={firstName}
                                        onChange={(e) => setFirstName(e.target.value)}
                                        required
                                    />
                                    <svg className="reg-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                            <div className="reg-field">
                                <label className="reg-label">LAST NAME</label>
                                <div className="reg-input-wrap">
                                    <input
                                        type="text"
                                        placeholder="Last name"
                                        className="reg-input"
                                        value={lastName}
                                        onChange={(e) => setLastName(e.target.value)}
                                        required
                                    />
                                    <svg className="reg-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        {/* ── Email ── */}
                        <div className="reg-field">
                            <label className="reg-label">EMAIL ADDRESS</label>
                            <div className="reg-input-wrap">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    className="reg-input"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                <svg className="reg-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* ── Phone ── */}
                        <div className="reg-field">
                            <label className="reg-label">PHONE NUMBER</label>
                            <div className="reg-input-wrap">
                                <input
                                    type="tel"
                                    placeholder="Enter your phone number"
                                    className="reg-input"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    required
                                />
                                <svg className="reg-input-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                                </svg>
                            </div>
                        </div>

                        {/* ── Address ── */}
                        <div className="reg-field">
                            <label className="reg-label">ADDRESS</label>
                            <div className="reg-input-wrap">
                                <textarea
                                    rows={2}
                                    placeholder="Enter your address"
                                    className="reg-textarea"
                                    value={address}
                                    onChange={(e) => setAddress(e.target.value)}
                                    required
                                />
                                <svg className="reg-input-icon" style={{ top: "14px", transform: "none" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* ── Password ── */}
                        <div className="reg-field">
                            <label className="reg-label">PASSWORD</label>
                            <div className="reg-input-wrap">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Create a password"
                                    className="reg-input"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="eye-btn" onClick={() => setShowPassword(!showPassword)}>
                                    {showPassword ? <EyeOff /> : <EyeOn />}
                                </button>
                            </div>
                        </div>

                        {/* ── Password Strength + Requirements ── */}
                        {password.length > 0 && (
                            <div className="strength-box">
                                <div className="strength-header">
                                    <span className="strength-label-text">Password strength</span>
                                    <span className={`strength-label-value ${strengthMeta.color}`}>
                                        {strengthMeta.label}
                                    </span>
                                </div>
                                <div className="strength-bar-track">
                                    <div className={`strength-bar-fill ${strengthMeta.color}`}
                                        style={{ width: `${(metCount / 5) * 100}%` }} />
                                </div>
                                <div className="req-box">
                                    <p className="req-title">Password must contain:</p>
                                    {requirements.map((req, i) => (
                                        <div key={i} className="req-row">
                                            {req.met ? (
                                                <svg className="req-icon met" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                                </svg>
                                            ) : (
                                                <svg className="req-icon unmet" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                                </svg>
                                            )}
                                            <span className={req.met ? "req-text met" : "req-text unmet"}>
                                                {req.label}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* ── Confirm Password ── */}
                        <div className="reg-field">
                            <label className="reg-label">CONFIRM PASSWORD</label>
                            <div className="reg-input-wrap">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Repeat your password"
                                    className={`reg-input ${
                                        confirmPassword.length > 0
                                            ? password === confirmPassword
                                                ? "input-match"
                                                : "input-mismatch"
                                            : ""
                                    }`}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                                <button type="button" className="eye-btn" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                    {showConfirmPassword ? <EyeOff /> : <EyeOn />}
                                </button>
                            </div>
                            {confirmPassword.length > 0 && (
                                <p className={password === confirmPassword ? "match-msg match" : "match-msg mismatch"}>
                                    {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                                </p>
                            )}
                        </div>

                        {/* ── Sign Up Button ── */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="reg-submit-btn"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="reg-spinner" viewBox="0 0 24 24">
                                        <circle className="reg-spinner-track" cx="12" cy="12" r="10"
                                            stroke="currentColor" strokeWidth="4" fill="none" />
                                        <path className="reg-spinner-head" fill="currentColor"
                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                    </svg>
                                    Creating Account...
                                </>
                            ) : "Sign Up"}
                        </button>

                        {/* ── Divider ── */}
                        <div className="reg-divider">
                            <div className="reg-divider-line" />
                            <span className="reg-divider-text">OR</span>
                            <div className="reg-divider-line" />
                        </div>

                        {/* ── Login Link ── */}
                        <p className="reg-bottom">
                            Already have an account?{" "}
                            <a href="/login">Login</a>
                        </p>

                    </div>
                </form>
            </div>
        </div>
    );
}