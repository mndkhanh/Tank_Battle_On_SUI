import { Link } from "react-router-dom";

const Header = () => {
  return (
    <header className="bg-red-500 p-4 flex justify-between items-center">
      <span>Header here</span>
      <Link to="/auth/login">Login</Link>
    </header>
  );
};

export default Header;
