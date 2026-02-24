import axios from "axios";
import "./login.css";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    function handleOnSubmit(e) {
        e.preventDefault();
        setIsLoading(true);

        const backendUrl = import.meta.env.VITE_BACKEND_URL;

        axios.post(`${backendUrl}/api/users/login`, {
            email: email,
            password: password
        }).then((res) => {
            localStorage.setItem("token", res.data.token);
            const tokenData = JSON.parse(atob(res.data.token.split(".")[1]));
            toast.success("Login successful!");
            if (tokenData.role == "admin") {
                navigate("/admin/dashboard");
            } else {
                navigate("/");
            }
            setIsLoading(false);
        }).catch((err) => {
            console.log(err);
            toast.error(err.response?.data?.error || "Login failed");
            setIsLoading(false);
        });
    }

    return (
        <div className="bg-picture w-full min-h-screen flex justify-center items-center p-4">
            <form onSubmit={handleOnSubmit} className="w-full max-w-md">
                <div className="glass-container w-full rounded-3xl flex justify-center items-center flex-col p-8 shadow-2xl">

                    <div className="logo-wrapper mb-8">
                        <img
                            src="123.webp"
                            alt="logo"
                            className="w-24 h-24 object-cover rounded-full ring-4 ring-white/30 shadow-lg"
                        />
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                            Welcome Back
                        </h1>
                        <p className="text-white/80 text-sm">
                            Please login to your account
                        </p>
                    </div>

                    <div className="input-group w-full mb-6">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">
                            Email Address
                        </label>
                        <input
                            type="email"
                            placeholder="Enter your email"
                            className="w-full h-12 px-4 bg-white/10 border-2 border-white/30 text-white text-base rounded-xl outline-none focus:border-[#efac38] transition-all duration-300 placeholder-white/50"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group w-full mb-6">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="w-full h-12 px-4 pr-12 bg-white/10 border-2 border-white/30 text-white text-base rounded-xl outline-none focus:border-[#efac38] transition-all duration-300 placeholder-white/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white/80"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                ) : (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                )}
                            </button>
                        </div>
                    </div>

                    <div className="w-full flex justify-between items-center mb-8">
                        <label className="flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="w-4 h-4 rounded border-2 border-white/30 bg-white/10 cursor-pointer"
                            />
                            <span className="ml-2 text-white/80 text-sm">
                                Remember me
                            </span>
                        </label>
                        <a href="#" className="text-[#efac38] text-sm hover:text-[#ffb84d] hover:underline">
                            Forgot Password?
                        </a>
                    </div>

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full h-12 bg-gradient-to-r from-[#efac38] to-[#ffb84d] text-xl font-semibold text-white rounded-xl hover:shadow-lg active:scale-95 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    >
                        {isLoading ? (
                            <div className="flex items-center gap-2">
                                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                </svg>
                                <span>Logging in...</span>
                            </div>
                        ) : (
                            <span>Login</span>
                        )}
                    </button>

                    <div className="mt-8 text-center">
                        <p className="text-white/70 text-sm">
                            Don&apos;t have an account?{" "}
                            <a href="/register" className="text-[#efac38] font-semibold hover:text-[#ffb84d] hover:underline">
                                Sign Up
                            </a>
                        </p>
                    </div>

                </div>
            </form>
        </div>
    );
}