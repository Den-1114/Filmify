import "./App.css";
import Main from "./pages/Main.tsx";
import Movie from "./pages/Movie.tsx";
import Watch from "./pages/Watch.tsx";
import {Route, Routes} from 'react-router-dom'

function App() {
    return (
        <>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/video/:id/:mediaType" element={<Movie />}/>
                <Route path="/watch/:id/:mediaType" element={<Watch />} />
            </Routes>
        </>
    );
}

export default App;
