import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const AuthContext = createContext();

export const AuthContextProvider = ({ children }) => {
  // Retrieve user data from localStorage
  const storedUserData = localStorage.getItem("user");

  // Parse the data only if it's defined and not null
  const initialUser = storedUserData ? JSON.parse(storedUserData) : null;

  const [currentUser, setCurrentUser] = useState(initialUser);

  const login = async (inputs) => {
    try {
      const res = await axios.post(
        "http://localhost:8800/api/auth/login",
        inputs,
        {
          withCredentials: true,
        }
      );

      setCurrentUser(res.data);
    } catch (error) {
      // Handle login error here, e.g., set an error state or display an error message.
      console.error("Login error:", error);
    }
  };

  useEffect(() => {
    // Store the user data in localStorage
    localStorage.setItem("user", JSON.stringify(currentUser));
  }, [currentUser]);

  return (
    <AuthContext.Provider value={{ currentUser, login }}>
      {children}
    </AuthContext.Provider>
  );
};