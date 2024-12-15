import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    try {
      const token = localStorage.getItem('authToken');
      const userData = localStorage.getItem('userData');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        return {
          token,
          user: {
            ...user,
            role: user.role || null
          },
          isAuthenticated: true
        };
      }
    } catch (error) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    return {
      token: null,
      user: null,
      isAuthenticated: false
    };
  });

  useEffect(() => {
  }, [auth]);

  const login = (token, user) => {
    if (!token || !user) {
      return;
    }

    const userWithRole = {
      ...user,
      role: user.role || null
    };

    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userWithRole));

    setAuth({
      token,
      user: userWithRole,
      isAuthenticated: true
    });
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    
    setAuth({
      token: null,
      user: null,
      isAuthenticated: false
    });
  };

  const isAdmin = () => auth.user?.role === 'Admin';
  const isPassenger = () => auth.user?.role === 'Passenger';

  return (
    <AuthContext.Provider value={{
      ...auth,
      login,
      logout,
      isAdmin,
      isPassenger
    }}>
      {children}
    </AuthContext.Provider>
  );
};
