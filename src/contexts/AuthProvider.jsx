import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();
// token is a string
// user is an object with the following properties:
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
      
      console.log('Initializing auth state:', {
        token: !!token,
        userData
      });
      
      if (token && userData) {
        const user = JSON.parse(userData);
        console.log('Parsed user data:', user);
        
        const normalizedUser = {
          ...user,
          role: user.role ? user.role.toLowerCase() : null
        };
        
        console.log('Normalized user data:', normalizedUser);
        
        return {
          token,
          user: normalizedUser,
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

  const login = (token, user) => {
    if (!token || !user) {
      console.log('Login failed - missing token or user data');
      return;
    }

    console.log('Login data:', { token: !!token, user });

    const userWithRole = {
      ...user,
      role: user.role ? user.role.toLowerCase() : null
    };

    console.log('Normalized login data:', userWithRole);

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

  const isAdmin = () => {
    const hasRole = auth.user?.role === 'admin';
    console.log('isAdmin check:', { role: auth.user?.role, hasRole });
    return hasRole;
  };

  const isPassenger = () => {
    const hasRole = auth.user?.role === 'passenger';
    console.log('isPassenger check:', { role: auth.user?.role, hasRole });
    return hasRole;
  };

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
