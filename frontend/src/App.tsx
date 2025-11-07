import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import SignUp from "./pages/auth/Signup";
import Login from "./pages/auth/Login";

function App() {
  return (
    // <BrowserRouter>
    //   <Routes>
    //     <Route path="/" element={<Home />} />
    //     <Route path="/auth/login" element={<Login />} />
    //     <Route path="/auth/signup" element={<SignUp />} />
    //   </Routes>
    // </BrowserRouter>
    <div className="min-h-screen flex items-center justify-center bg-blue-500 text-white text-3xl font-bold">
      Tailwind Works 🎉
    </div>
  );
}

export default App;
