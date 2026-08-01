import "./Navbar.css";

function Navbar() {

  const handleClick = (page) => {
    alert(`${page} dummy button ahn bro.. 🚧`);
  };

  return (
    <nav className="navbar">

      <div className="logo">
        Cinema<span>.ai</span>
      </div>

      <ul className="nav-links">
        <li onClick={() => handleClick("Home")}>Home</li>
        <li onClick={() => handleClick("Movies")}>Movies</li>
        <li onClick={() => handleClick("Recommendations")}>Recommendations</li>
      </ul>

    </nav>
  );
}

export default Navbar;