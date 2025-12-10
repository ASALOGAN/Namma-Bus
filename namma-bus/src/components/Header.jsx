import { FaBars } from "react-icons/fa"; // getting the bar icon from react-icons
import "../css/header.css"; // css file for header styles

const Header = ({ onMenuClick, menuOpen }) => { // Header component with onMenuClick and menuOpen props
  return ( // returning the jsx
    <button
      className={`floating-menu-btn ${menuOpen ? "hidden" : ""}`} // button style changes when menuOpen
      onClick={onMenuClick} // calls function when button clicked
    >
      <FaBars size={20} /> {/* icon for menu with size 20 */}
    </button>
  );
};

export default Header; // makes Header available somewhere else
