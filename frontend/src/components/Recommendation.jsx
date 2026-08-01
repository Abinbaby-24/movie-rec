import "./Recommendation.css";

function Recommendation({ movies }) {

    return (

        <section className="recommendation" id="recommendation">

            <h2>Recommended Movies</h2>

            {movies && movies.length > 0 ? (

                <div className="movie-grid">

                    {movies.map((movie, index) => (

                        <div className="movie-card" key={index}>

                            <img
                                src={movie.poster}
                                alt={movie.title}
                                className="movie-image"
                                onError={(e) => {
                                    e.target.src =
                                        "https://via.placeholder.com/500x750?text=No+Poster";
                                }}
                            />

                            <h3>{movie.title}</h3>

                        </div>

                    ))}

                </div>

            ) : (

                <div className="empty-state">

                    <div className="movie-poster-large">
                        🎥
                    </div>

                    <h3>No Recommendations Yet</h3>

                    <p>
                        Search for your favourite movie above and we'll
                        recommend similar movies instantly.
                    </p>

                </div>

            )}

        </section>

    );
}

export default Recommendation;