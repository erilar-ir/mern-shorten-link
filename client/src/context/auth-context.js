import {createContext} from "react";
function noop () {}
export const AuthContext = createContext({
    login: noop,
    logout: noop,
    checkAuth: noop,
    isAuthenticated: false
})
