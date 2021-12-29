import {useHttp} from "../hooks";
import {useCallback} from "react";


export const AuthService = () => {
    const {request} = useHttp()
    const login = useCallback(async (email, password) => {
        try {
            return request('/api/auth/login', 'POST', {email, password})
        } catch (e) {
            return Promise.reject(e)
        }
    }, [])
    const register = useCallback(async (email, password) => {
        try {
            return request('/api/auth/register', 'POST', {email, password})
        } catch (e) {
            return Promise.reject(e)
        }
    }, [])
    const logout = useCallback(async () => {
        try {
            return request('/api/auth/logout', 'POST')
        } catch (e) {
            return Promise.reject(e)
        }
        }, [])

    return {login, register, logout}
}
