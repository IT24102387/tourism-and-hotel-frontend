import axios from "axios";
import "./login.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const googleLogin = useGoogleLogin({
        onSuccess: (res) => {
            axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`, {
                accessToken: res.access_token,
            }).then((res) => {
                toast.success("Login Success");
                const user = res.data.user;
                localStorage.setItem("token", res.data.token);
                if (user.role === "admin") {
                    navigate("/admin/");
                } else {
                    navigate("/");
                }
            }).catch((err) => {
                console.log(err);
                toast.error("Google login failed");
            });
        },
    });

    function handleOnSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
            email,
            password,
        }).then((res) => {
            toast.success("Login success");
            const user = res.data.user;
            localStorage.setItem("token", res.data.token);
            if (user.role === "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
        }).catch((err) => {
            console.log(err);
            toast.error(err?.response?.data?.error || "Login failed");
        }).finally(() => {
            setIsLoading(false);
        });
    }

    return (
        <div className="login-page w-full min-h-screen flex items-center justify-center px-4 py-10"
            style={{ background: "#FFFBF5" }}>

            {/* Decorative background blobs */}
            <div className="login-blob login-blob-1" />
            <div className="login-blob login-blob-2" />

            <div className="relative z-10 w-full max-w-md">

                {/* Card */}
                <div className="rounded-3xl p-8 sm:p-10 shadow-xl border"
                    style={{ background: "#FFFFFF", borderColor: "#F5EACF", boxShadow: "0 8px 48px rgba(217,119,6,0.12)" }}>

                    {/* Logo + Brand */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-20 h-20 rounded-full overflow-hidden border-4 mb-4 shadow-md"
                            style={{ borderColor: "#FBBF24" }}>
                            <img src="123.webp" alt="logo" className="w-full h-full object-cover" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight" style={{ color: "#292524" }}>
                            Welcome Back
                        </h1>
                        <p className="text-sm mt-1" style={{ color: "#78716C" }}>
                            Sign in to your account to continue
                        </p>
                    </div>

                    <form onSubmit={handleOnSubmit} className="space-y-5">

                        {/* Email */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                                style={{ color: "#92400E" }}>
                                Email Address
                            </label>
                            <div className="relative">
                                <input
                                    type="email"
                                    placeholder="you@example.com"
                                    autoComplete="email"
                                    inputMode="email"
                                    required
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="login-input w-full h-12 pl-4 pr-11 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        background: "#FFFBF5",
                                        border: "1.5px solid #F5EACF",
                                        color: "#292524",
                                        fontSize: "16px",
                                    }}
                                />
                                <svg className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 pointer-events-none"
                                    style={{ color: "#D97706" }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-xs font-bold uppercase tracking-widest mb-1.5"
                                style={{ color: "#92400E" }}>
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    autoComplete="current-password"
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="login-input w-full h-12 pl-4 pr-11 rounded-xl text-sm outline-none transition-all"
                                    style={{
                                        background: "#FFFBF5",
                                        border: "1.5px solid #F5EACF",
                                        color: "#292524",
                                        fontSize: "16px",
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    aria-label={showPassword ? "Hide password" : "Show password"}
                                    className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 flex items-center justify-center rounded-lg transition-colors"
                                    style={{ color: "#D97706" }}>
                                    {showPassword ? (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88L6.59 6.59m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                        </svg>
                                    ) : (
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                                d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                        </svg>
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Remember + Forgot */}
                        <div className="flex items-center justify-between">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                                <input type="checkbox"
                                    className="w-4 h-4 rounded border-2 cursor-pointer"
                                    style={{ accentColor: "#F59E0B", borderColor: "#F5EACF" }} />
                                <span className="text-sm" style={{ color: "#78716C" }}>Remember me</span>
                            </label>
                            <a href="#" className="text-sm font-semibold transition-colors hover:underline underline-offset-2"
                                style={{ color: "#D97706" }}>
                                Forgot password?
                            </a>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl font-bold text-sm transition-all duration-200 hover:opacity-90 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-2 shadow-md"
                            style={{
                                background: isLoading ? "#E8D9B8" : "linear-gradient(135deg,#FBBF24,#F59E0B)",
                                color: "#1C1917",
                                cursor: isLoading ? "not-allowed" : "pointer",
                                boxShadow: "0 4px 14px rgba(251,191,36,0.40)",
                            }}>
                            {isLoading ? (
                                <>
                                    <span className="w-4 h-4 border-2 rounded-full animate-spin flex-shrink-0"
                                        style={{ borderColor: "#92400E", borderTopColor: "transparent" }} />
                                    Logging in…
                                </>
                            ) : "Login"}
                        </button>

                        {/* Divider */}
                        <div className="flex items-center gap-3">
                            <div className="flex-1 h-px" style={{ background: "#F5EACF" }} />
                            <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "#A8A29E" }}>or</span>
                            <div className="flex-1 h-px" style={{ background: "#F5EACF" }} />
                        </div>

                        {/* Google Button */}
                        <button
                            type="button"
                            onClick={googleLogin}
                            disabled={isLoading}
                            className="w-full h-12 rounded-xl font-semibold text-sm border-2 transition-all duration-200 hover:-translate-y-0.5 active:scale-95 flex items-center justify-center gap-3"
                            style={{
                                background: "#FFFFFF",
                                borderColor: "#F5EACF",
                                color: "#292524",
                                cursor: isLoading ? "not-allowed" : "pointer",
                            }}>
                            <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                            Continue with Google
                        </button>
                    </form>

                    {/* Sign Up */}
                    <p className="text-center text-sm mt-8" style={{ color: "#78716C" }}>
                        Don't have an account?{" "}
                        <a href="/register" className="font-bold transition-colors hover:underline underline-offset-2"
                            style={{ color: "#D97706" }}>
                            Sign Up
                        </a>
                    </p>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs mt-6" style={{ color: "#A8A29E" }}>
                    © 2026 Yala &amp; Kataragama Travel Hub
                </p>
            </div>
        </div>
    );
}