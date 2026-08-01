import "./SearchSection.css";
import Recommendation from "./Recommendation";
import { useState, useEffect } from "react";
import axios from "axios";

function SearchSection() {

    const [movies, setMovies] = useState([]);
    const [search, setSearch] = useState("");
    const [filtered, setFiltered] = useState([]);
    const [recommendations, setRecommendations] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load movie titles
    useEffect(() => {

        axios
            .get("http://127.0.0.1:5000/movies")
            .then((res) => {
                setMovies(res.data);
            })
            .catch((err) => {
                console.log(err);
            });

    }, []);

    // Search while typing
    const handleChange = (e) => {

        const value = e.target.value;

        setSearch(value);

        if (value === "") {
            setFiltered([]);
            return;
        }

        const result = movies.filter((movie) =>
            movie.toLowerCase().includes(value.toLowerCase())
        );

        setFiltered(result.slice(0, 8));
    };

    // Select movie from dropdown
    const selectMovie = (movie) => {
        setSearch(movie);
        setFiltered([]);
    };

    // Recommend movies
    const handleRecommend = async () => {

        if (search.trim() === "") {
            alert("Please enter a movie name.");
            return;
        }

        try {

            setLoading(true);

            const res = await axios.post(
                "http://127.0.0.1:5000/recommend",
                {
                    movie: search
                }
            );

            setRecommendations(res.data);

        } catch (err) {

            console.log(err);

        } finally {

            setLoading(false);

        }
    };

    return (
        <>
            <section className="search-section">

                <h2>Find Similar Movies</h2>

                <p>
                    Search any movie from the dataset.
                </p>

                <div className="search-container">

                    <input
                        type="text"
                        placeholder="Search Movie..."
                        value={search}
                        onChange={handleChange}
                    />

                    <button onClick={handleRecommend}>
                        {loading ? "Loading..." : "Recommend"}
                    </button>

                    {filtered.length > 0 && (

                        <div className="suggestions">

                            {filtered.map((movie, index) => (

                                <div
                                    key={index}
                                    className="suggestion"
                                    onClick={() => selectMovie(movie)}
                                >
                                    🎬 {movie}
                                </div>

                            ))}

                        </div>

                    )}

                </div>

            </section>

            <Recommendation movies={recommendations} />
        </>
    );
}

export default SearchSection;