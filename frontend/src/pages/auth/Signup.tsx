import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { GrLinkPrevious } from "react-icons/gr";
import SignInWithGG from "./provider/SignInWithGG";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../config/firebase";
import type { FsUser } from "../../data/types";
import { saveUserData } from "../../service/user";
import { saveUserToLocalStorage } from "../../utils/userLocalStorage";

const SignUp = () => {
  const [loading, setLoading] = React.useState(false);

  const navigate = useNavigate();

  const [fullname, setFullname] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [confirmPassword, setConfirmPassword] = React.useState("");

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    try {
      setLoading(true);
      await createUserWithEmailAndPassword(auth, email, password);
      const user = auth.currentUser;
      if (user) {
        const userData: FsUser = {
          uid: user.uid,
          email: user.email || "",
          name: fullname,
          photo: import.meta.env.VITE_ANON_PHOTO,
        };
        await saveUserData(userData);
        saveUserToLocalStorage(userData);
        navigate("/", { replace: true });
      } else {
        alert("User not found!");
        setLoading(false);
      }
    } catch (error: any) {
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSignUp}
      className="flex flex-col justify-between items-center gap-4 p-8"
    >
      <h1 className="font-heading flex-[1] text-2xl font-bold text-darkGreen">
        Create your Sunipetto account
      </h1>

      {/* Email / Password / Confirm */}
      <div className="flex-[2] flex flex-col gap-3 p-6 bg-white max-w-md w-full">
        {/* Name */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-darkBlue mb-1">Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            className="border border-darkGreen rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:border-transparent"
            onChange={(e) => setFullname(e.target.value)}
            required
          />
        </div>

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
            required
          />
        </div>

        {/* Password */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-darkBlue mb-1">
            Password
          </label>
          <input
            type="password"
            placeholder="Create a password"
            className="border border-darkGreen rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:border-transparent"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        {/* Confirm Password */}
        <div className="flex flex-col">
          <label className="text-sm font-medium text-darkBlue mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            placeholder="Confirm your password"
            className="border border-darkGreen rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-darkGreen focus:border-transparent"
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        {/* Sign Up Button */}
        <button
          type="submit"
          disabled={loading}
          className={`bg-darkGreen text-white rounded-lg py-2 mt-2 transition-all duration-200 ${
            loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-700"
          }`}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>

        {/* Already have an account? */}
        <div className="text-sm text-gray-600 text-center">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-darkGreen hover:underline">
            Sign in here
          </Link>
        </div>
      </div>

      {/* Social sign in */}
      <div className="flex-[2] flex flex-col items-center justify-center text-center gap-4">
        <span className="text-sm text-gray-500">or sign up with</span>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full">
          <SignInWithGG />
        </div>
      </div>

      {/* Go Back */}
      <div className="flex-[1] w-full flex justify-end items-center">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-medium text-darkGreen"
        >
          <GrLinkPrevious className="group-hover:-translate-x-2 transition-transform" />
          <span>Go Back</span>
        </button>
      </div>
    </form>
  );
};

export default SignUp;
