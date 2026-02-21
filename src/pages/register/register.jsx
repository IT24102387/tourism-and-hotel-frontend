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
    const navigate=useNavigate();

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
        { label: "",        bar: "w-0",    color: "bg-transparent" },
        { label: "Weak",    bar: "w-1/5",  color: "bg-red-400"     },
        { label: "Weak",    bar: "w-2/5",  color: "bg-red-400"     },
        { label: "Fair",    bar: "w-3/5",  color: "bg-yellow-400"  },
        { label: "Good",    bar: "w-4/5",  color: "bg-blue-400"    },
        { label: "Strong",  bar: "w-full", color: "bg-green-400"   },
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
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/`,{
            email:email,
            firstName:firstName,
            lastName:lastName,
            password:password,
            address:address,
            phone:phone

        }).then((res)=>{
            toast.success("Registration Success")
            navigate("/login")

        }).catch((err)=>{
            toast.error(err?.response?.data?.error || "An error occured")
        })
    }

    /* ── shared classes ── */
    const inputBase =
        "input-field w-full h-12 px-4 bg-white/10 border-2 border-white/30 " +
        "text-white text-base rounded-xl outline-none focus:border-[#efac38] " +
        "focus:bg-white/15 transition-all duration-300 placeholder-white/50";

    const EyeOff = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
    );
    const EyeOn = () => (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
    );

    return (
        <div className="bg-picture w-full min-h-screen flex justify-center items-center p-4">
            <form onSubmit={handleOnSubmit} className="w-full max-w-md">
                <div className="glass-container w-full rounded-3xl flex justify-center items-center flex-col p-8 shadow-2xl">

                    {/* ── Logo ── */}
                    <div className="logo-wrapper mb-6 transform transition-transform duration-300 hover:scale-105">
                        <img src="123.webp" alt="logo"
                            className="w-24 h-24 object-cover rounded-full ring-4 ring-white/30 shadow-lg" />
                    </div>

                    {/* ── Header ── */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">Create Account</h1>
                        <p className="text-white/80 text-sm">Fill in your details to get started</p>
                    </div>

                    {/* ── First Name & Last Name ── */}
                    <div className="w-full flex gap-3 mb-5">
                        <div className="input-group flex-1">
                            <label className="block text-white/90 text-sm font-medium mb-2 ml-1">First Name</label>
                            <div className="relative">
                                <input type="text" placeholder="First name" className={inputBase}
                                    value={firstName} onChange={(e) => setFirstName(e.target.value)} required />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                        <div className="input-group flex-1">
                            <label className="block text-white/90 text-sm font-medium mb-2 ml-1">Last Name</label>
                            <div className="relative">
                                <input type="text" placeholder="Last name" className={inputBase}
                                    value={lastName} onChange={(e) => setLastName(e.target.value)} required />
                                <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/50"
                                    fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* ── Email ── */}
                    <div className="input-group w-full mb-5">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">Email Address</label>
                        <div className="relative">
                            <input type="email" placeholder="Enter your email" className={inputBase}
                                value={email} onChange={(e) => setEmail(e.target.value)} required />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Phone ── */}
                    <div className="input-group w-full mb-5">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">Phone Number</label>
                        <div className="relative">
                            <input type="tel" placeholder="Enter your phone number" className={inputBase}
                                value={phone} onChange={(e) => setPhone(e.target.value)} required />
                            <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Address ── */}
                    <div className="input-group w-full mb-5">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">Address</label>
                        <div className="relative">
                            <textarea rows={2} placeholder="Enter your address"
                                className="input-field w-full px-4 py-3 bg-white/10 border-2 border-white/30
                                         text-white text-base rounded-xl outline-none resize-none
                                         focus:border-[#efac38] focus:bg-white/15
                                         transition-all duration-300 placeholder-white/50"
                                value={address} onChange={(e) => setAddress(e.target.value)} required />
                            <svg className="absolute right-4 top-3.5 w-5 h-5 text-white/50"
                                fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        </div>
                    </div>

                    {/* ── Password ── */}
                    <div className="input-group w-full mb-3">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">Password</label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Create a password"
                                className="input-field w-full h-12 px-4 pr-12 bg-white/10 border-2 border-white/30
                                         text-white text-base rounded-xl outline-none
                                         focus:border-[#efac38] focus:bg-white/15
                                         transition-all duration-300 placeholder-white/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50
                                         hover:text-white/80 transition-colors duration-200">
                                {showPassword ? <EyeOff /> : <EyeOn />}
                            </button>
                        </div>
                    </div>

                    {/* ── Password Strength + Requirements ── */}
                    {password.length > 0 && (
                        <div className="w-full mb-5 px-1">

                            {/* Strength bar */}
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-white/50 text-xs">Password strength</span>
                                <span className={`text-xs font-semibold ${
                                    metCount <= 2 ? "text-red-400" :
                                    metCount === 3 ? "text-yellow-400" :
                                    metCount === 4 ? "text-blue-400" : "text-green-400"
                                }`}>{strengthMeta.label}</span>
                            </div>
                            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-3">
                                <div className={`h-full rounded-full transition-all duration-500 ${strengthMeta.color} ${strengthMeta.bar}`} />
                            </div>

                            {/* Requirements checklist */}
                            <div className="bg-white/5 border border-white/10 rounded-xl p-3 space-y-1.5">
                                <p className="text-white/60 text-xs font-medium mb-2">Password must contain:</p>
                                {requirements.map((req, i) => (
                                    <div key={i} className="flex items-center gap-2">
                                        {/* check / cross icon */}
                                        {req.met ? (
                                            <svg className="w-4 h-4 text-green-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                                            </svg>
                                        ) : (
                                            <svg className="w-4 h-4 text-white/30 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        )}
                                        <span className={`text-xs transition-colors duration-300 ${req.met ? "text-green-400" : "text-white/40"}`}>
                                            {req.label}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* ── Confirm Password ── */}
                    <div className="input-group w-full mb-8">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">Confirm Password</label>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Repeat your password"
                                className={`input-field w-full h-12 px-4 pr-12 bg-white/10 border-2
                                         text-white text-base rounded-xl outline-none
                                         transition-all duration-300 placeholder-white/50 focus:bg-white/15
                                         ${confirmPassword.length > 0
                                            ? password === confirmPassword
                                                ? "border-green-400/70 focus:border-green-400"
                                                : "border-red-400/70 focus:border-red-400"
                                            : "border-white/30 focus:border-[#efac38]"
                                         }`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50
                                         hover:text-white/80 transition-colors duration-200">
                                {showConfirmPassword ? <EyeOff /> : <EyeOn />}
                            </button>
                        </div>
                        {confirmPassword.length > 0 && (
                            <p className={`text-xs mt-1.5 ml-1 ${password === confirmPassword ? "text-green-400" : "text-red-400"}`}>
                                {password === confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                            </p>
                        )}
                    </div>

                    {/* ── Sign Up Button ── */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="register-button w-full h-12 bg-gradient-to-r from-[#efac38] to-[#ffb84d]
                                 text-xl font-semibold text-white rounded-xl
                                 hover:shadow-lg hover:shadow-[#efac38]/50
                                 active:scale-95 transition-all duration-300
                                 disabled:opacity-70 disabled:cursor-not-allowed
                                 flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <>
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10"
                                        stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor"
                                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Creating Account...</span>
                            </>
                        ) : (
                            <span>Sign Up</span>
                        )}
                    </button>

                    {/* ── Login Link ── */}
                    <div className="mt-8 text-center">
                        <p className="text-white/70 text-sm">
                            Already have an account?{" "}
                            <a href="/login"
                                className="text-[#efac38] font-semibold hover:text-[#ffb84d]
                                         transition-colors hover:underline underline-offset-2">
                                Login
                            </a>
                        </p>
                    </div>

                </div>
            </form>
        </div>
    );
}