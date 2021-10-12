import {useHttp} from "../hooks";
import {useCallback} from "react";


export const AuthService = () => {
    const {request} = useHttp()
    const login = useCallback(async (email, password) => {
        return request('/api/auth/login', 'POST', {email, password})
            .catch(err => {
                return Promise.reject(err)

            })
    }, [])
    const register = useCallback(async (email, password) => {
        return request('/api/auth/register', 'POST', {email, password})
            .catch(err => {
                return Promise.reject(err)
            })
    }, [])
    const logout = useCallback(async () => {
            return request('/api/auth/logout', 'POST')
        }
        , [])

    return {login, register, logout}
}
