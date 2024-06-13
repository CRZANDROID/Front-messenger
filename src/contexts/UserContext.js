import React, { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [users, setUsers] = useState([
    { username: 'josue@example.com', password: 'josue' },
    { username: 'darinel@example.com', password: 'darinel' },
    { username: 'cesar@example.com', password: 'cesar' }
  ]);
  const [chats, setChats] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [messages, setMessages] = useState({});

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
  };

  const getUserByUsername = (username) => {
    return users.find(user => user.username === username);
  };

  const createChat = (chat) => {
    setChats(prevChats => [...prevChats, chat]);
  };

  const addChat = (chat) => {
    setChats([...chats, chat]);
  };

  const addMessageToChat = (chatId, message) => {
    setMessages(prevMessages => {
      const chatMessages = prevMessages[chatId] || [];
      return { ...prevMessages, [chatId]: [...chatMessages, message] };
    });
  };

  return (
    <UserContext.Provider value={{ currentUser, users, chats, isAuthenticated, login, logout, register, getUserByUsername, createChat, addChat, messages, addMessageToChat }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);

