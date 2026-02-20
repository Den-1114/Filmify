import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from "../lib/hooks.ts";
import {Navbar} from "../components/Navbar.tsx";
import type {Provider} from "@supabase/supabase-js";

export default function Login() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const {signIn, signInWithOAuth, loading} = useAuth()
    const navigate = useNavigate()

    const handleSignIn = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)

        const {error} = await signIn(email, password)
        if (error) {
            setError(error.message)
        } else {
            navigate('/')
        }
    }

    const handleOAuth = async (provider: Provider) => {
        const {error} = await signInWithOAuth(provider)
        if (error) setError(error.message)
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <div className="flex flex-col items-center justify-centerls w-full gap-4 pt-8">
                <Navbar/>
            </div>

            <div className="max-w-md mx-auto px-6 pt-20 pb-12">
                <div className="bg-[#18181b] border border-gray-800 rounded-xl shadow-2xl p-8">
                    <h1 className="text-3xl font-extrabold mb-8 text-center drop-shadow-md">
                        Sign In
                    </h1>

                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSignIn} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-600 focus:border-red-600 transition"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition duration-200 flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div
                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"/>
                                    Signing In...
                                </>
                            ) : (
                                'Sign In'
                            )}
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-800">
                        <div className="flex flex-col items-center justify-center w-full">


                            <button
                                onClick={() => handleOAuth('discord')}
                                className="flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-700 border border-gray-700 px-4 py-3 rounded-lg transition duration-200"
                            >
                                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                                    <path
                                        d="M20.317 4.369a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.211.375-.444.864-.608 1.249a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.249.077.077 0 0 0-.079-.037 19.736 19.736 0 0 0-4.885 1.515.07.07 0 0 0-.032.027C.533 9.045-.32 13.579.099 18.057a.082.082 0 0 0 .031.056 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.027c.462-.63.874-1.295 1.226-1.994a.076.076 0 0 0-.041-.105 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128c.126-.094.252-.192.372-.291a.074.074 0 0 1 .077-.01c3.927 1.793 8.18 1.793 12.061 0a.074.074 0 0 1 .078.009c.12.099.246.198.373.292a.077.077 0 0 1-.006.128 12.299 12.299 0 0 1-1.873.891.076.076 0 0 0-.04.106c.36.698.772 1.363 1.225 1.993a.076.076 0 0 0 .084.028 19.876 19.876 0 0 0 6.002-3.03.077.077 0 0 0 .031-.055c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.028zM8.02 15.331c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.094 2.156 2.418 0 1.334-.955 2.419-2.156 2.419zm7.975 0c-1.182 0-2.156-1.085-2.156-2.419 0-1.333.955-2.418 2.156-2.418 1.21 0 2.174 1.094 2.156 2.418 0 1.334-.946 2.419-2.156 2.419z"/>
                                </svg>

                                Discord
                            </button>
                        </div>
                    </div>

                    <p className="text-center text-gray-400 mt-8">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-red-500 hover:text-red-400 font-semibold">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}