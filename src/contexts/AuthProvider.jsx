// import React, { createContext, useContext, useState, useEffect } from "react";

// const AuthContext = createContext();

// export const useAuth = () => {
//   return useContext(AuthContext);
// };

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     // Check if user is logged in (look for JWT in localStorage)
//     const token = localStorage.getItem("authToken");
//     if (token) {
//       // Here, you could also verify the token by making a request to the backend
//       setUser({ token }); // Simplified, just saving the token for now
//     }
//   }, []);

//   const login = (token) => {
//     localStorage.setItem("authToken", token);
//     setUser({ token });
//   };

//   const logout = () => {
//     localStorage.removeItem("authToken");
//     setUser(null);
//   };

//   return (
//     <AuthContext.Provider value={{ user, login, logout }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };



import { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState({ token: null, role: null });

  const login = (token, role) => setAuth({ token, role });
  const logout = () => setAuth({ token: null, role: null });

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
