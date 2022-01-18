import axios from "axios";


const storageName = 'userData'

const $api = axios.create({
    withCredentials: true,
    headers: {
        'Content-Type': 'application/json;charset=UTF-8',
        "Access-Control-Allow-Origin": "*",
    }
})

$api.interceptors.request.use((config) => {
    const localStore = JSON.parse(localStorage.getItem(storageName))
    config.headers.Authorization = `Bearer ${localStore?.accessToken}`
    return config
})
$api.interceptors.response.use((config) => {
    return config
}, async error => {
    const originalRequest = error.config

    if (error.response && error.response.status === 401 && error.config && !error.config._isRetry ) {
        originalRequest._isRetry = true
        try {
            const response = await axios.get('/api/auth/refresh', {withCredentials: true})
            // console.log(response)
            const userData = {accessToken: response.data.accessToken}
            // console.log(userData)
            localStorage.setItem(storageName, JSON.stringify(userData))
            return await $api.request(originalRequest)

        } catch (e) {
            const error = e.response.data
            error.status = e.response.status
            error.message = 'Session expired. Please login again.'
            console.error('Response interceptor error', error)
            return Promise.reject(error)
        }
    }
    // console.log('error response data ', error.response.data)
    const err = error.response.data
    err.status = error.response.status
    return Promise.reject(err)
})


export default $api
