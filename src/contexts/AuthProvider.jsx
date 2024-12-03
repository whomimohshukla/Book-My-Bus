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
            role: user.role || null // Ensure role is always present
          },
          isAuthenticated: true
        };
      }
    } catch (error) {
      console.error('Error restoring auth state:', error);
      localStorage.removeItem('authToken');
      localStorage.removeItem('userData');
    }
    
    return {
      token: null,
      user: null,
      isAuthenticated: false
    };
  });

  // useEffect(() => {
  // //   console.log('Auth state changed:', {
  // //     isAuthenticated: auth.isAuthenticated,
  // //     userRole: auth.user?.role,
  // //     hasToken: !!auth.token,
  // //     hasUser: !!auth.user
  // //   });
  // // }, [auth]);

  const login = (token, user) => {
    if (!token || !user) {
      console.error('Login failed: Missing token or user data');
      return;
    }

    // Ensure user object has a role
    const userWithRole = {
      ...user,
      role: user.role || null
    };

    // Store in localStorage
    localStorage.setItem('authToken', token);
    localStorage.setItem('userData', JSON.stringify(userWithRole));

    // Update state
    setAuth({
      token,
      user: userWithRole,
      isAuthenticated: true
    });

    console.log('Login successful:', {
      role: userWithRole.role,
      email: userWithRole.email
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
      isPassenger,
      user: auth.user,
      isAuthenticated: auth.isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};
