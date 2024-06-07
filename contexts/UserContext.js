import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { username: 'josue@example.com', password: 'josue' },
    { username: 'darinel@example.com', password: 'darinel' },
    { username: 'cesar@example.com',password:'cesar'}
  ]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const login = (userData) => {
    setCurrentUser(userData);
    setIsAuthenticated(true);
  };

  const logout = () => {
    setCurrentUser(null);
    setIsAuthenticated(false);
  };

  const register = (userData) => {
    setUsers(prevUsers => [...prevUsers, userData]);
    
    setIsAuthenticated(true);
  };
  

  const getUserByUsername = (username) => {
    return users.find(user => user.username === username);
  };

  return (
    <UserContext.Provider value={{ currentUser, isAuthenticated, users, login, logout, register, getUserByUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

