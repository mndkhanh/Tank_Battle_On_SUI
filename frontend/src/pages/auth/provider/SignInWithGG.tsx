import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

import { FaGoogle } from "react-icons/fa";
import { auth } from "../../../config/firebase";
import { useNavigate, useSearchParams } from "react-router-dom";
import type { FsUser } from "../../../data/types";
import { saveUserToLocalStorage } from "../../../utils/userLocalStorage";
import { saveUserData } from "../../../service/user";

const SignInWithGG = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider).then(async (result) => {
      console.log(result);
      const user = result.user;
      if (result.user) {
        const userData: FsUser = {
          uid: user.uid,
          email: user.email,
          name: user.displayName,
          photo: user.photoURL || import.meta.env.VITE_ANON_PHOTO,
        };
        await saveUserData(userData);
        saveUserToLocalStorage(userData);
        navigate(redirectTo, { replace: true });
      }
    });
  };
  return (
    <button
      onClick={handleClick}
      className="flex max-w-full items-center justify-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50"
    >
      <FaGoogle />
      <span>Sign in with Google</span>
    </button>
  );
};

export default SignInWithGG;
