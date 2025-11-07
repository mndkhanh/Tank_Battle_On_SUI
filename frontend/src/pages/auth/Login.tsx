import { signInWithEmailAndPassword } from "firebase/auth";
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { auth } from "../../config/firebase";
import { saveUserToLocalStorage } from "../../utils/userLocalStorage";
import { FsUser } from "../../data/types";
import SignInWithGG from "./provider/SignInWithGG";
import { GrLinkPrevious } from "react-icons/gr";
import { getUserById } from "../../service/user";

const LoginForm: React.FC = () => {
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");

  const navigate = useNavigate();
  const [loading, setLoading] = React.useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (auth.currentUser) {
        const uid = auth.currentUser.uid;
        const userData: FsUser = await getUserById(uid);
        saveUserToLocalStorage(userData);
        navigate("/", { replace: true });
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleLogin}
      className="flex flex-col justify-between items-center gap-4 p-8"
    >
      <h1 className="font-heading flex-[1] text-2xl font-bold text-darkGreen">
        Welcome to Sunipetto
      </h1>
      {/* sign in with email and password */}
      <div className="flex-[2] flex flex-col gap-3 p-6 bg-white max-w-md w-full">
        {/* Email */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-darkBlue mb-1">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            className="border border-darkGreen rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:border-transparent"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-darkBlue mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            className="border border-darkGreen rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:border-transparent"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-darkGreen text-white rounded-lg py-2 mt-2 transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Logging in..." : "Login"}
        </button>

        {/*  Forgot password / Sign up */}
        <div className="ml-auto text-sm text-gray-600">
          <Link
            to="/auth/forgot-password"
            className="text-darkGreen hover:underline"
          >
            Forgot password?
          </Link>
          <button
            onClick={() => navigate("/auth/signup")}
            className="ml-3 text-darkGreen hover:underline"
          >
            Sign up here
          </button>
        </div>
      </div>
      {/* sign in with google and Github */}
      <div className="flex-[2] flex flex-col items-center justify-center text-center gap-4">
        <span className="text-sm text-gray-500">or sign in with</span>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <SignInWithGG />
        </div>
      </div>

      {/* Go Back  */}
      <div className="flex-[1] w-full flex justify-end items-center">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-medium text-darkGreen"
        >
          <GrLinkPrevious className="group-hover:-translate-x-2" />
          <span>Go Back</span>
        </button>
      </div>
    </form>
  );
};

export default LoginForm;
