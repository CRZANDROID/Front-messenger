import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([]);

  const login = (userData) => {
    setCurrentUser(userData);
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const register = (userData) => {
    setUsers(prevUsers => [...prevUsers, userData]);
  };
  

  const getUserByUsername = (username) => {
    return users.find(user => user.username === username);
  };

  return (
    <UserContext.Provider value={{ currentUser, users, login, logout, register, getUserByUsername }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

