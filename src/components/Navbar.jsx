import React, { useState,useEffect } from "react";
import { auth, provider, signInWithPopup, signOut } from "../firebase/firebase";
import { toast } from "react-toastify";
import { onAuthStateChanged } from "firebase/auth";

const Navbar = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  
// Persist authentication state across refreshes
useEffect(() => {
  const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
    setUser(currentUser);
  });
  return () => unsubscribe(); // Cleanup listener on unmount
}, []);

  const signInWithGitHub = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      console.log("User:", result.user);
      setUser(result.user);
      setError("");
      console.log("User:", result.user);
      toast(`LoggedIn Successfully! ${result.user.email}`, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.error("GitHub Login Failed", error);
      setError("Google Sign-In failed");
    }
  };
  const handleLogout = async () => {
    let confirmLogout = window.confirm("Are you sure you want to log out?");
    if (confirmLogout) {
      try {
        await signOut(auth);
        setUser(null); // Clear user data
        toast(`Logout Successfully! ${user.email}`, {
          position: "top-right",
          autoClose: 4000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      } catch (error) {
        console.error("Logout Failed", error);
      }
    }
  };
  return (
    <nav className="text-white">
      <div className="mycontainer flex justify-between items-center px-4  py-5 h-14">
        <div className="logo font-bold text-white text-2xl">
          <span className="text-green-700"> &lt;</span>
          Pass<span className="text-green-700">OP/&gt;</span>
        </div>
        {user ? (
          <button
            onClick={() => handleLogout()}
            className="text-white bg-green-700 my-5 mx-2 rounded-full flex justify-between items-center ring-black ring-1"
          >
            <img
              src={user.photoURL}
              alt="github logo"
              className="w-10 p-2"
            />
            
            <span className="font-bold px-2">GitHub</span>
          </button>
        ) : (
          <button
            onClick={() => signInWithGitHub()}
            className="text-white bg-green-700 my-5 mx-2 rounded-full flex justify-between items-center ring-black ring-1"
          >
            <img
              src="/icons/github.svg"
              alt="github logo"
              className="invert w-10 p-1"
            />
            <span className="font-bold px-2">GitHub</span>
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
