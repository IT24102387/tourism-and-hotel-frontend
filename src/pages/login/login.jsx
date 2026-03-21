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
    const navigate= useNavigate()
    const googleLogin=useGoogleLogin(
        {
            onSuccess:(res)=>{
                console.log(res)
                axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/google`,{
                    accessToken:res.access_token
                }).then((res)=>{
                    console.log(res)
                    toast.success("Login Success")
                    const user =res.data.user
                    localStorage.setItem("token",res.data.token)
                    if(user.role==="admin"){
                        navigate("/admin/")
                    }else{
                        navigate("/")
                    }
                }).catch((err)=>{
                    console.log(err)
                })
            }
        }
    );

    function  handleOnSubmit(e) {
        e.preventDefault();
        setIsLoading(true);
        
        // Simulate login process
        setTimeout(() => {
            console.log(email, password);
            setIsLoading(false);
        }, 1500);
        const backendUrl=import.meta.env.VITE_BACKEND_URL

        axios.post(`${backendUrl}/api/users/login`,
        {
            email:email,
            password :password
        
        }).then((res)=>{
            console.log(res)
            toast.success("Login success")

            const user=res.data.user
            localStorage.setItem("token",res.data.token)

            if(user.role == "admin"){
                navigate("/admin/dashboard")
            }else{
                navigate("/")
            }


        }).catch((err)=>{
            console.log(err)
            toast.error(err.response.data.error)

        })
    }

    return (
        <div className="bg-picture w-full min-h-screen flex justify-center items-center p-4">
            <form onSubmit={handleOnSubmit} className="w-full max-w-md">
                <div className="glass-container w-full rounded-3xl flex justify-center items-center flex-col p-8 shadow-2xl">
                    {/* Logo Section */}
                    <div className="logo-wrapper mb-8 transform transition-transform duration-300 hover:scale-105">
                        <img 
                            src="123.webp" 
                            alt="logo" 
                            className="w-24 h-24 object-cover rounded-full ring-4 ring-white/30 shadow-lg"
                        />
                    </div>

                    {/* Welcome Text */}
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-white mb-2 tracking-wide">
                            Welcome Back
                        </h1>
                        <p className="text-white/80 text-sm">
                            Please login to your account
                        </p>
                    </div>

                    {/* Email Input */}
                    <div className="input-group w-full mb-6">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">
                            Email Address
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="input-field w-full h-12 px-4 bg-white/10 border-2 border-white/30 
                                         text-white text-base rounded-xl outline-none
                                         focus:border-[#efac38] focus:bg-white/15
                                         transition-all duration-300 placeholder-white/50"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                            <svg 
                                className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                                fill="none" 
                                stroke="currentColor" 
                                viewBox="0 0 24 24"
                            >
                                <path 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    strokeWidth={2} 
                                    d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" 
                                />
                            </svg>
                        </div>
                    </div>

                    {/* Password Input */}
                    <div className="input-group w-full mb-6">
                        <label className="block text-white/90 text-sm font-medium mb-2 ml-1">
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Enter your password"
                                className="input-field w-full h-12 px-4 pr-12 bg-white/10 border-2 border-white/30 
                                         text-white text-base rounded-xl outline-none
                                         focus:border-[#efac38] focus:bg-white/15
                                         transition-all duration-300 placeholder-white/50"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 
                                         hover:text-white/80 transition-colors duration-200"
                            >
                                {showPassword ? (
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}  />
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

                    {/* Remember Me & Forgot Password */}
                    <div className="w-full flex justify-between items-center mb-8">
                        <label className="flex items-center cursor-pointer group">
                            <input 
                                type="checkbox" 
                                className="w-4 h-4 rounded border-2 border-white/30 bg-white/10 
                                         checked:bg-[#efac38] checked:border-[#efac38]
                                         focus:ring-2 focus:ring-[#efac38]/50 cursor-pointer"
                            />
                            <span className="ml-2 text-white/80 text-sm group-hover:text-white transition-colors">
                                Remember me
                            </span>
                        </label>
                        <a 
                            href="#" 
                            className="text-[#efac38] text-sm hover:text-[#ffb84d] transition-colors
                                     hover:underline underline-offset-2"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    
                
        <div className="w-full flex gap-3">
            {/* Login Button */}
            <button 
                type="submit"
                disabled={isLoading}
                className="flex-1 h-12 bg-gradient-to-r from-[#efac38] to-[#ffb84d] 
                 text-base font-semibold text-white rounded-xl
                 hover:shadow-lg hover:shadow-[#efac38]/50
                 active:scale-95 transition-all duration-300
                 disabled:opacity-70 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
            >
                    {isLoading ? (
                <>
                    <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    <span>Logging in...</span>
                </>
                ) : (
                <span>Login</span>
                )}
            </button>

    {/* Login with Google Button */}
    <button 
        type="button" 
        onClick={googleLogin}
        disabled={isLoading}
        className="flex-1 h-12 bg-white border-2 border-white/80
                 text-base font-semibold text-gray-700 rounded-xl
                 hover:bg-gray-50 hover:shadow-lg hover:shadow-black/20
                 active:scale-95 transition-all duration-300
                 disabled:opacity-70 disabled:cursor-not-allowed
                 flex items-center justify-center gap-2"
    >
        {isLoading ? (
            <>
                <svg className="animate-spin h-5 w-5 text-gray-500" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Signing in...</span>
            </>
        ) : (
            <>
                <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                <span>Google</span>
            </>
        )}
    </button>
</div>


                    {/* Sign Up Link */}
                    <div className="mt-8 text-center">
                        <p className="text-white/70 text-sm">
                            Don't have an account?{' '}
                            <a 
                                href="/register" 
                                className="text-[#efac38] font-semibold hover:text-[#ffb84d] 
                                         transition-colors hover:underline underline-offset-2"
                            >
                                Sign Up
                            </a>
                        </p>
                    </div>
                </div>
            </form>
        </div>
    );
}