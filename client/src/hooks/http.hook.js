import {useCallback, useState} from "react";
import $api from "../services/api.service";


export const useHttp = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method = 'GET', body = null) => {
        setLoading(true)

        try {
            const response = await $api(url, {method: method, data: body})

            const data =  response.data

            setLoading(false)

            return data
        } catch (e) {
            setLoading(false)
            setError(e)
            console.log(e)
            return Promise.reject(e)
        }
    }, [])



    const clearError = useCallback(() => {
        setError(null)
    } ,[])


    return {loading, error, request, clearError}
}
