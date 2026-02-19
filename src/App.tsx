import "./App.css";
import Main from "./pages/Main.tsx";
import Movie from "./pages/Movie.tsx";
import Watch from "./pages/Watch.tsx";
import Login from "./pages/Login.tsx";
import SignUp from "./pages/Signup.tsx";
import History from "./pages/History.tsx";
import Watchlist from "./pages/Watchlist.tsx";
import {Route, Routes} from 'react-router-dom'

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main/>}/>
                <Route path="/video/:id/:mediaType" element={<Movie/>}/>
                <Route path="/watch/:id/:mediaType" element={<Watch/>}/>
                <Route path="/login" element={<Login/>}/>
                <Route path="/signup" element={<SignUp/>}/>
                <Route path="/history" element={<History/>}/>
                <Route path="/watchlist" element={<Watchlist/>}/>
            </Routes>
        </>
    );
}

export default App;
