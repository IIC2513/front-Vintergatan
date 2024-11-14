import {createContext} from 'react';
export const AuthContext = createContext({
    token: null,
    setToken: () => {},
    logout: () => {},
    name: "",
    setName: () => {},
    email: "",
    setEmail: () => {},
  });