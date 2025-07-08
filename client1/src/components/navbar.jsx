import { Link } from "react-router-dom";
import logo from "../logo/output-onlinepngtools.png";
import "../css/nav.css";

function Navbar() {
  return (
    <nav className="navBar">
      <div className="navContainer">
        {/* Left */}
        <div className="Nav-left">
          <Link to="/home" className="logo">
            <img src={logo} alt="COLOQ logo" />
          </Link>
          <Link to="/home" className="Home">Home</Link>
        </div>

        {/* Center */}
        <div className="Navcen">
          <input type="text" placeholder="Search your projects..." />
        </div>

        {/* Right */}
        <div className="Nav-right">
          <span title="Notifications">🔔</span>
          <span title="Profile">👤</span>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
