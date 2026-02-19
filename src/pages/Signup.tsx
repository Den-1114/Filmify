import {useState} from 'react'
import {Link, useNavigate} from 'react-router-dom'
import {useAuth} from "../lib/hooks.ts";
import {Navbar} from "../components/Navbar.tsx";

export default function SignUp() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)
    const {signUp, loading} = useAuth()
    const navigate = useNavigate()

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setSuccess(false)

        if (password !== confirmPassword) {
            setError("Passwords don't match")
            return
        }


        const {error} = await signUp(email, password)
        if (error) {
            setError(error.message)
        } else {
            setSuccess(true)
            setTimeout(() => navigate('/login'), 2000)
        }
    }

    return (
        <div className="bg-[#121212] min-h-screen text-white">
            <div className="flex flex-col items-center justify-center w-full gap-4 pt-8">
                <Navbar/>
            </div>

            <div className="max-w-md mx-auto px-6 pt-20 pb-12">
                <div className="bg-[#18181b] border border-gray-800 rounded-xl shadow-2xl p-8">
                    <h1 className="text-3xl font-extrabold mb-8 text-center drop-shadow-md">
                        Sign Up
                    </h1>

                    {error && (
                        <div className="bg-red-900/30 border border-red-700 text-red-300 px-4 py-3 rounded-lg mb-6">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div
                            className="bg-green-900/30 border border-green-700 text-green-300 px-4 py-3 rounded-lg mb-6">
                            Account created! Check your email for confirmation.
                        </div>
                    )}

                    <form onSubmit={handleSignUp} className="space-y-6">
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

                        <div>
                            <label className="block text-sm font-medium mb-2 text-gray-300">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
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
                                    Creating Account...
                                </>
                            ) : (
                                'Sign Up'
                            )}
                        </button>
                    </form>

                    <p className="text-center text-gray-400 mt-8">
                        Already have an account?{' '}
                        <Link to="/login" className="text-red-500 hover:text-red-400 font-semibold">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}