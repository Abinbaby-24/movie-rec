import "./Hero.css";

function Hero() {

  const scrollToRecommendation = () => {
    const section = document.getElementById("recommendation");

    if (section) {
      section.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  return (
    <section className="hero">

      <div className="overlay"></div>

      <div className="hero-content">

        <h1>
          Discover Your <span>Next Favorite Movie</span>
        </h1>

        <p>
          Get personalized movie recommendations instantly using
          Machine Learning.
        </p>

        <button
          className="hero-btn"
          onClick={scrollToRecommendation}
        >
          Start Exploring
        </button>

      </div>

    </section>
  );
}

export default Hero;