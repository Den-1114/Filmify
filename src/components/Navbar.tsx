import {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import {
    Home,
    Search,
    X,
    User,
    Settings,
    Bookmark,
    Clock,
    LogOut,
    LogIn,
    UserPlus,
    Info,
    Star,
    ChevronRight,
} from "lucide-react";
import api from "../api.ts";
import { useAuth } from "../lib/hooks.ts";

type Movie = {
    id: number;
    title: string;
    poster_path: string | null;
    release_date: string;
    name: string;
    media_type: string;
    first_air_date: string;
};

export function Navbar() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Movie[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isFocused, setIsFocused] = useState(false);
    const [isProfileOpen, setIsProfileOpen] = useState(false);
    const { user, signOut } = useAuth();

    const [profileMounted, setProfileMounted] = useState(false);
    const [profileVisible, setProfileVisible] = useState(false);

    const [searchDropdownMounted, setSearchDropdownMounted] = useState(false);
    const [searchDropdownVisible, setSearchDropdownVisible] = useState(false);

    const [overlayMounted, setOverlayMounted] = useState(false);
    const [overlayVisible, setOverlayVisible] = useState(false);

    const showDropdown = (results.length > 0 || isLoading) && isFocused;
    const showOverlay = showDropdown || isProfileOpen;

    // Profile dropdown animation
    useEffect(() => {
        if (isProfileOpen) {
            setProfileMounted(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setProfileVisible(true);
                });
            });
        } else {
            setProfileVisible(false);
            const timer = setTimeout(() => setProfileMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isProfileOpen]);

    // Search dropdown animation
    useEffect(() => {
        if (showDropdown) {
            setSearchDropdownMounted(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setSearchDropdownVisible(true);
                });
            });
        } else {
            setSearchDropdownVisible(false);
            const timer = setTimeout(() => setSearchDropdownMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [showDropdown]);

    // Overlay animation
    useEffect(() => {
        if (showOverlay) {
            setOverlayMounted(true);
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    setOverlayVisible(true);
                });
            });
        } else {
            setOverlayVisible(false);
            const timer = setTimeout(() => setOverlayMounted(false), 300);
            return () => clearTimeout(timer);
        }
    }, [showOverlay]);

    const handleSearch = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        setResults([]);

        try {
            const response = await api.get(`/search/${query}`);
            const filteredResults = response.data.results.filter(
                (item: Movie) => item.media_type === "movie" || item.media_type === "tv"
            );
            setResults(filteredResults);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleResultClick = (id: number, mediaType: string) => {
        window.location.href = `/video/${id}/${mediaType}`;
        setQuery("");
        setResults([]);
        setIsFocused(false);
    };

    const clearSearch = () => {
        setQuery("");
        setResults([]);
    };

    return (
        <nav className="fixed top-0 w-full z-50 flex flex-row items-center justify-between px-6 py-4 transition-all duration-500 ease-in-out">
            {/* Home Button */}
            <Link
                to="/"
                className="group relative p-2.5 bg-zinc-800/80 hover:bg-red-600 rounded-full text-white transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-red-600/25 active:scale-95"
            >
                <Home className="w-5 h-5 transition-transform duration-300" />
                <span className="absolute -bottom-10 left-1/2 -translate-x-1/2 px-2 py-1 bg-zinc-900 text-white text-xs rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-1 group-hover:translate-y-0 pointer-events-none">
                    Home
                </span>
            </Link>

            {/* Overlay */}
            {overlayMounted && (
                <div
                    className={`fixed inset-0 z-40 bg-black/30 backdrop-blur-[2px] transition-opacity duration-300 ease-out
                        ${overlayVisible ? "opacity-100" : "opacity-0"}
                    `}
                    onClick={() => {
                        setIsFocused(false);
                        setIsProfileOpen(false);
                    }}
                />
            )}

            {/* Search Container */}
            <div className="flex-1 max-w-2xl mx-4 relative z-50">
                <form onSubmit={handleSearch} className="relative group">
                    {/* Search Icon */}
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search
                            className={`w-5 h-5 transition-all duration-300 ${
                                isFocused ? "text-red-500 scale-110" : "text-gray-400"
                            }`}
                        />
                    </div>

                    <input
                        type="text"
                        placeholder="Search movies & shows..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => setIsFocused(true)}
                        className={`w-full bg-zinc-900/80 backdrop-blur-md text-white border pl-11 pr-24 py-3 rounded-full
                            outline-none placeholder:text-zinc-500 transition-all duration-500 shadow-lg
                            ${isFocused
                                ? "border-red-500/50 ring-2 ring-red-600/30 shadow-red-600/10 bg-zinc-900/95 scale-[1.02]"
                                : "border-white/10 hover:border-white/20 hover:bg-zinc-900/90"
                            }`}
                    />

                    {/* Right Side Actions */}
                    <div className="absolute inset-y-0 right-1.5 flex items-center gap-2">
                        {/* Clear Button */}
                        <div
                            className={`transition-all duration-300 ${
                                query ? "opacity-100 scale-100 rotate-0" : "opacity-0 scale-50 rotate-90 pointer-events-none"
                            }`}
                        >
                            <button
                                type="button"
                                onClick={clearSearch}
                                className="p-1.5 text-gray-400 hover:text-white rounded-full hover:bg-white/10 transition-all duration-200 hover:rotate-90 active:scale-90"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>

                        {/* Search Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="relative bg-red-600 text-white px-5 py-1.5 rounded-full text-sm font-semibold hover:bg-red-700 transition-all duration-300 disabled:opacity-50 hover:shadow-lg hover:shadow-red-600/25 active:scale-95 overflow-hidden group/btn"
                        >
                            <span
                                className={`inline-flex items-center transition-all duration-300 ${
                                    isLoading ? "opacity-0 scale-50" : "opacity-100 scale-100"
                                }`}
                            >
                                Search
                            </span>
                            {isLoading && (
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                </div>
                            )}
                            <div className="absolute inset-0 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 bg-linear-to-r from-transparent via-white/10 to-transparent" />
                        </button>
                    </div>
                </form>

                {/* Results Dropdown */}
                {searchDropdownMounted && (
                    <div
                        className={`absolute top-full mt-2 w-full bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 ease-out origin-top
                            ${searchDropdownVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-95 -translate-y-2"}
                        `}
                    >
                        {/* Loading */}
                        {isLoading && (
                            <div className="p-6 flex flex-col items-center gap-3">
                                <div className="relative">
                                    <div className="w-8 h-8 border-2 border-red-600/30 border-t-red-600 rounded-full animate-spin" />
                                    <div
                                        className="absolute inset-0 w-8 h-8 border-2 border-transparent border-b-red-400/50 rounded-full animate-spin"
                                        style={{ animationDirection: "reverse", animationDuration: "1.5s" }}
                                    />
                                </div>
                                <span className="text-gray-400 text-sm animate-pulse">Searching TMDb...</span>
                            </div>
                        )}

                        {/* No Results */}
                        {!isLoading && results.length === 0 && query.length > 0 && (
                            <div className="p-6 text-center">
                                <div className="text-3xl mb-2 animate-bounce">🎬</div>
                                <p className="text-gray-500 text-sm">
                                    No results found for "<span className="text-white">{query}</span>"
                                </p>
                            </div>
                        )}

                        {/* Results List */}
                        {!isLoading && results.length > 0 && (
                            <div className="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-zinc-700">
                                {results.map((movie, index) => (
                                    <div
                                        key={movie.id}
                                        className="flex items-center gap-4 p-3 hover:bg-white/5 transition-all duration-200 cursor-pointer border-b border-white/5 last:border-none group/item"
                                        style={{
                                            animation: `slideInFromRight 0.3s ease-out ${index * 0.05}s both`,
                                        }}
                                        onClick={() => handleResultClick(movie.id, movie.media_type)}
                                    >
                                        {/* Poster */}
                                        <div className="w-10 h-14 shrink-0 bg-zinc-800 rounded-md overflow-hidden ring-1 ring-white/5 group-hover/item:ring-red-500/30 transition-all duration-300">
                                            {movie.poster_path ? (
                                                <img
                                                    src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                                                    alt={movie.title}
                                                    className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-500"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-500">
                                                    🎞️
                                                </div>
                                            )}
                                        </div>

                                        {/* Info */}
                                        <div className="flex flex-col text-left overflow-hidden flex-1">
                                            <span className="text-white text-sm font-medium truncate group-hover/item:text-red-400 transition-colors duration-200">
                                                {movie.title}
                                                {movie.name}
                                            </span>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-zinc-400 bg-zinc-800/80 px-1.5 py-0.5 rounded transition-colors duration-200 group-hover/item:bg-zinc-700">
                                                    {movie.media_type === "movie"
                                                        ? movie.release_date
                                                            ? movie.release_date.split("-")[0]
                                                            : "TBA"
                                                        : movie.first_air_date
                                                            ? movie.first_air_date.split("-")[0]
                                                            : "TBA"}
                                                </span>
                                                <span
                                                    className={`text-xs px-1.5 py-0.5 rounded transition-colors duration-200 ${
                                                        movie.media_type === "tv"
                                                            ? "text-blue-400 bg-blue-500/10 group-hover/item:bg-blue-500/20"
                                                            : "text-amber-400 bg-amber-500/10 group-hover/item:bg-amber-500/20"
                                                    }`}
                                                >
                                                    {movie.media_type === "tv" ? "Series" : movie.media_type === "movie" ? "Movie" : "Unknown"}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Arrow */}
                                        <ChevronRight className="w-4 h-4 text-zinc-600 group-hover/item:text-red-400 transition-all duration-300 group-hover/item:translate-x-1 opacity-0 group-hover/item:opacity-100" />
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* User Profile Button */}
            <div className="relative z-50">
                <button
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className={`group relative p-2.5 rounded-full text-white transition-all duration-300 hover:scale-105 active:scale-95
                        ${isProfileOpen
                            ? "bg-red-600 shadow-lg shadow-red-600/25"
                            : "bg-zinc-800/80 hover:bg-red-600 hover:shadow-lg hover:shadow-red-600/25"
                        }`}
                >
                    <div
                        className={`absolute inset-0 rounded-full border-2 transition-all duration-500 ${
                            isProfileOpen ? "border-red-400/50 scale-125 opacity-0" : "border-transparent scale-100 opacity-0"
                        }`}
                    />

                    {isProfileOpen ? (
                        <X className="w-5 h-5 transition-transform duration-300 scale-90" />
                    ) : (
                        <User className="w-5 h-5 transition-transform duration-300 group-hover:scale-105" />
                    )}

                    <span
                        className={`absolute -bottom-10 right-0 px-2 py-1 bg-zinc-900 text-white text-xs rounded-md whitespace-nowrap transition-all duration-300 pointer-events-none
                            ${isProfileOpen ? "opacity-0" : "opacity-0 group-hover:opacity-100 translate-y-1 group-hover:translate-y-0"}
                        `}
                    >
                        Profile
                    </span>
                </button>

                {/* Profile Dropdown */}
                {profileMounted && (
                    <div
                        className={`absolute right-0 top-full mt-3 w-80 bg-[#18181b]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden transition-all duration-300 ease-out origin-top-right
                            ${profileVisible ? "opacity-100 scale-100 translate-y-0" : "opacity-0 scale-90 -translate-y-3"}
                        `}
                    >
                        {user ? (
                            <>
                                {/* Profile Header */}
                                <div className="p-5 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-br from-red-600/20 via-purple-600/10 to-transparent" />
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/10 rounded-full blur-2xl" />

                                    <div className="relative">
                                        <div className="flex items-start justify-between mb-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative group/avatar">
                                                    <div className="absolute -inset-1 bg-linear-to-r from-red-500 via-purple-500 to-red-500 rounded-full opacity-75 blur-sm group-hover/avatar:opacity-100 transition-opacity duration-300" />
                                                    <div className="relative w-14 h-14 rounded-full bg-linear-to-br from-red-500 to-red-700 flex items-center justify-center text-white font-bold text-xl shadow-lg ring-2 ring-[#18181b] transition-transform duration-300 group-hover/avatar:scale-105">
                                                        {user?.email?.charAt(0).toUpperCase() || "U"}
                                                    </div>
                                                    <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 bg-green-500 rounded-full border-[3px] border-[#18181b]">
                                                        <div className="w-full h-full bg-green-400 rounded-full animate-ping opacity-75" />
                                                    </div>
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-white font-semibold truncate max-w-35">
                                                        {user?.user_metadata?.full_name || user?.email?.split("@")[0]}
                                                    </span>
                                                    <span className="text-xs text-zinc-400 truncate max-w-35">
                                                        {user?.email}
                                                    </span>
                                                    <div className="flex items-center gap-1.5 mt-1">
                                                        <span className="flex items-center gap-1 text-[10px] text-green-400 font-medium">
                                                            <span className="w-1.5 h-1.5 bg-green-400 rounded-full" />
                                                            Online
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>

                                            <button
                                                onClick={() => {
                                                    window.location.href = "/settings";
                                                    setIsProfileOpen(false);
                                                }}
                                                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-all duration-200"
                                            >
                                                <Settings className="w-4 h-4" />
                                            </button>
                                        </div>

                                        {/* Membership Badge */}
                                        <div className="flex items-center gap-2">
                                            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-linear-to-r from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-full">
                                                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                                                <span className="text-[10px] font-semibold text-amber-400 uppercase tracking-wide">
                                                    Premium
                                                </span>
                                            </div>
                                            <span className="text-[10px] text-zinc-500">Member since {new Date(user?.created_at).getFullYear()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mx-4" />

                                {/* Account Menu */}
                                <div className="py-2">
                                    <div className="px-4 py-2">
                                        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                                            Account
                                        </span>
                                    </div>

                                    {[
                                        {
                                            label: "My Profile",
                                            description: "View and edit your profile",
                                            href: "/profile",
                                            icon: User,
                                            color: "blue",
                                        },
                                        {
                                            label: "Watchlist",
                                            description: "Movies & shows to watch",
                                            href: "/watchlist",
                                            icon: Bookmark,
                                            color: "purple",
                                        },
                                        {
                                            label: "Watch History",
                                            description: "Recently watched content",
                                            href: "/history",
                                            icon: Clock,
                                            color: "green",
                                        },
                                    ].map((item, index) => {
                                        const Icon = item.icon;
                                        return (
                                            <Link
                                                key={item.label}
                                                to={item.href}
                                                onClick={() => setIsProfileOpen(false)}
                                                className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300 hover:bg-white/5 transition-all duration-200 group/menu"
                                                style={{
                                                    animation: profileVisible
                                                        ? `fadeSlideIn 0.3s ease-out ${0.2 + index * 0.04}s both`
                                                        : "none",
                                                }}
                                            >
                                                <div
                                                    className={`p-2 rounded-lg transition-colors
                                                        ${item.color === "blue" ? "bg-blue-500/10 group-hover/menu:bg-blue-500/20" : ""}
                                                        ${item.color === "purple" ? "bg-purple-500/10 group-hover/menu:bg-purple-500/20" : ""}
                                                        ${item.color === "green" ? "bg-green-500/10 group-hover/menu:bg-green-500/20" : ""}
                                                    `}
                                                >
                                                    <Icon
                                                        className={`w-4 h-4
                                                            ${item.color === "blue" ? "text-blue-400" : ""}
                                                            ${item.color === "purple" ? "text-purple-400" : ""}
                                                            ${item.color === "green" ? "text-green-400" : ""}
                                                        `}
                                                    />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <div className="flex items-center gap-2">
                                                        <span className="font-medium group-hover/menu:text-white transition-colors">
                                                            {item.label}
                                                        </span>
                                                    </div>
                                                    <span className="text-[11px] text-zinc-500">
                                                        {item.description}
                                                    </span>
                                                </div>
                                                <ChevronRight className="w-4 h-4 text-zinc-600 group-hover/menu:text-zinc-400 transition-all duration-200 opacity-0 group-hover/menu:opacity-100 -translate-x-2 group-hover/menu:translate-x-0" />
                                            </Link>
                                        );
                                    })}
                                </div>

                                {/* Divider */}
                                <div className="h-px bg-linear-to-r from-transparent via-white/10 to-transparent mx-4" />

                                {/* Settings Section */}
                                <div className="py-2">
                                    <div className="px-4 py-2">
                                        <span className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">
                                            Preferences
                                        </span>
                                    </div>

                                    <Link
                                        to="/settings"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-400 hover:bg-white/5 hover:text-zinc-200 transition-all duration-200 group/menu"
                                        style={{
                                            animation: profileVisible ? `fadeSlideIn 0.3s ease-out 0.36s both` : "none",
                                        }}
                                    >
                                        <Settings className="w-4 h-4" />
                                        Settings
                                        <ChevronRight className="w-3 h-3 ml-auto text-zinc-600 group-hover/menu:text-zinc-400 transition-all duration-200 opacity-0 group-hover/menu:opacity-100 -translate-x-2 group-hover/menu:translate-x-0" />
                                    </Link>
                                </div>

                                {/* Sign Out */}
                                <div className="p-3 bg-white/2 border-t border-white/5">
                                    <button
                                        onClick={() => {
                                            signOut();
                                            setIsProfileOpen(false);
                                        }}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500 rounded-xl transition-all duration-200 group/signout"
                                        style={{
                                            animation: profileVisible ? `fadeSlideIn 0.3s ease-out 0.48s both` : "none",
                                        }}
                                    >
                                        <LogOut className="w-4 h-4 group-hover/signout:translate-x-0.5 transition-transform duration-200" />
                                        Sign Out
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                {/* Guest Header */}
                                <div className="p-5 border-b border-white/10 relative overflow-hidden">
                                    <div className="absolute inset-0 bg-linear-to-br from-zinc-600/10 via-transparent to-zinc-800/5" />
                                    <div className="relative flex items-center gap-4">
                                        <div className="relative group/avatar">
                                            <div className="w-12 h-12 rounded-full bg-linear-to-br from-zinc-600 to-zinc-800 flex items-center justify-center text-zinc-400 shadow-lg shadow-zinc-900/30 transition-transform duration-300 group-hover/avatar:scale-110">
                                                <User className="w-6 h-6" />
                                            </div>
                                            <div className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-zinc-500 rounded-full border-2 border-[#18181b]" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-white text-sm font-semibold">Guest User</span>
                                            <span className="text-[10px] text-zinc-500 mt-0.5 font-medium tracking-wide uppercase">
                                                Not signed in
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Info Message */}
                                <div
                                    className="p-4 mx-3 mt-3 bg-red-500/10 border border-red-500/20 rounded-xl"
                                    style={{
                                        animation: profileVisible ? `fadeSlideIn 0.3s ease-out 0.05s both` : "none",
                                    }}
                                >
                                    <div className="flex gap-3">
                                        <div className="shrink-0">
                                            <Info className="w-5 h-5 text-red-400" />
                                        </div>
                                        <p className="text-xs text-zinc-300 leading-relaxed">
                                            <span className="text-red-400 font-semibold">Sign in</span> to access your
                                            watchlist, watch history, and personalized recommendations.
                                        </p>
                                    </div>
                                </div>

                                {/* Auth Buttons */}
                                <div className="p-3 space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-linear-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 rounded-xl transition-all duration-200 shadow-lg shadow-red-600/20 hover:shadow-red-600/40 hover:scale-[1.02] active:scale-[0.98]"
                                        style={{
                                            animation: profileVisible ? `fadeSlideIn 0.3s ease-out 0.1s both` : "none",
                                        }}
                                    >
                                        <LogIn className="w-4 h-4" />
                                        Sign In
                                    </Link>

                                    <Link
                                        to="/signup"
                                        onClick={() => setIsProfileOpen(false)}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-3 text-sm font-semibold text-white bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]"
                                        style={{
                                            animation: profileVisible ? `fadeSlideIn 0.3s ease-out 0.15s both` : "none",
                                        }}
                                    >
                                        <UserPlus className="w-4 h-4" />
                                        Create Account
                                    </Link>
                                </div>

                                {/* Guest Divider */}
                                <div className="flex items-center gap-3 px-4 py-2">
                                    <div className="flex-1 h-px bg-white/10" />
                                    <span className="text-[10px] text-zinc-500 font-medium uppercase tracking-wider">
                                        or continue as guest
                                    </span>
                                    <div className="flex-1 h-px bg-white/10" />
                                </div>
                            </>
                        )}
                    </div>
                )}
            </div>

            {/* Animations */}
            <style>{`
                @keyframes slideInFromRight {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }
                @keyframes fadeSlideIn {
                    from { opacity: 0; transform: translateX(-8px); }
                    to { opacity: 1; transform: translateX(0); }
                }
            `}</style>
        </nav>
    );
}