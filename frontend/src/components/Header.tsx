import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="text-black p-4 bg-white flex justify-between items-center">
      <span className="text-white">Header here</span>
      <Link to="/auth/login">Login</Link>
    </header>
  );
};

export default Header;
