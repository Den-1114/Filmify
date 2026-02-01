import "../App.css";
import MovieRow from "../components/movies/MovieRow.tsx";
import Navbar from "../components/Navbar.tsx";
import Footer from "../components/Footer.tsx";
import HeroCarousel from "../components/movies/HeroCarousel.tsx";
import TopMovies from "../components/movies/TopMovies.tsx";

function Main() {
    return (
        <div className="flex flex-col w-full gap-4 pt-8">
            <Navbar/>
            <HeroCarousel/>
            <div className="w-full gap-4 pt-8">
                <TopMovies/>
                <MovieRow title="Trending" theme="trending" time="week"/>
                <MovieRow title="Top Rated" theme="top_rated" time="week"/>
                <MovieRow title="Now Playing" theme="now_playing" time="week"/>
                <MovieRow title="Upcoming" theme="upcoming" time="week"/>
                <MovieRow title="Popular" theme="popular" time="week"/>
            </div>
            <Footer/>
        </div>
    );
}

export default Main;
