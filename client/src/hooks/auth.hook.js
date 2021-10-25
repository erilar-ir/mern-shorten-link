import {useCallback, useEffect, useState} from "react";
import axios from "axios";
import Cookies from 'js-cookie'
import {useMessage} from "./index";

const storageName = 'userData'

export const useAuth = () => {

    const [token, setToken] = useState(null)
    // const [refreshToken, setRefreshToken] = useState(null)
    const [userId, setUserId] = useState(null)
    const [ready, setReady] = useState(false)

    const message = useMessage()

    const login = useCallback((jwtToken, id) => {
        setToken(jwtToken)
        setUserId(id)


        const userData = {
            userId: id, accessToken: jwtToken
        }
        localStorage.setItem(storageName, JSON.stringify(userData))
    }, [])

    const logout = useCallback(async  () => {
        await axios.post('/api/auth/logout', {withCredentials: true})
        setToken(null)
        setUserId(null)
        localStorage.removeItem(storageName)
    }, [])

    const checkAuth = useCallback(async () => {
        const refreshToken = Cookies.get('refreshToken')
        if (refreshToken) {
            try {
                const response = await axios.get('/api/auth/refresh', {withCredentials: true})
                const userData = response.data
                const storageData = {
                    userId: userData.user.id, accessToken: userData.accessToken
                }
                localStorage.setItem(storageName, JSON.stringify(storageData))
                setToken(userData.accessToken)
                setUserId(userData.user.id)
            } catch (e) {
                const error = e.response.data
                console.log(`axios error: ${error.message}`)
                await logout()
                message('Please login again', 'warn')
            }
        }
        else {
            message('Please login again', 'warn')
        }

    }, [])

    useEffect(async () => {
        const data = JSON.parse(localStorage.getItem(storageName))
        if (data && data.accessToken) {
            await checkAuth()

        } else {
            message('Please login again', 'warn')

        }
        setReady(true)
    }, [checkAuth, login])

    return {login, logout, token, userId, ready, checkAuth}
}
