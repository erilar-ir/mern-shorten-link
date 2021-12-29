import {useCallback, useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import {useMessage} from "./index";
import {AuthService} from "../services";
const storageName = 'userData'

export const useAuth = () => {

    const authService = AuthService()
    const [isAuthenticated, setAuthenticated] = useState(null)

    const [ready, setReady] = useState(false)

    const message = useMessage()

    const login = useCallback(async (form) => {
    try {
        const data = await authService.login(form.email, form.password)

        setAuthenticated(true)
        const userData = {
            userId: data.user.id, accessToken: data.accessToken
        }
        localStorage.setItem(storageName, JSON.stringify(userData))
    }
    catch (e) {
        console.log('auth hook login error', e)
        return Promise.reject(e)
    }

    }, [])

    const logout = useCallback(async  () => {
        try {
            console.log('logging out')
            await authService.logout()
            await setAuthenticated(false)
            // await setUserId(null)
            localStorage.removeItem(storageName)
            // await history.push('/')
        } catch (e) {
            console.log('error caught in logout hook', e)
            return Promise.reject(e)
        }

    }, [])

    const checkAuth = useCallback(async () => {
        setReady(false)
        const refreshToken = Cookies.get('refreshToken')
        console.log('check auth refresh token', refreshToken)
        if (refreshToken) {
            try {
                const response = await axios.get('/api/auth/refresh', {withCredentials: true})
                const userData = response.data
                const storageData = {
                    userId: userData.user.id, accessToken: userData.accessToken
                }
                localStorage.setItem(storageName, JSON.stringify(storageData))
                setAuthenticated(true)
                // setUserId(userData.user.id)
            } catch (e) {
                const error = e.response.data
                console.log(`hook checkAuth error: ${error.message}`)
                await logout()
                message('Session expired. Please login again.', 'warn')
                return Promise.reject(e)
            } finally {
                setReady(true)
            }
        }
        else {
            await logout()
            message('Session expired. Please login again.', 'warn')
            setAuthenticated(false)
            setReady(true)
            // history.push('/')
        }

    }, [])

    return {login, logout, isAuthenticated, ready, checkAuth}
}
