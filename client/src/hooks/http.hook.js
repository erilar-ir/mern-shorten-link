import {useCallback, useState} from "react";
import $api from "../services/api.service";


export const useHttp = () => {

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const request = useCallback(async (url, method = 'GET', body = null) => {
        await setLoading(true)

        try {
            const response = await $api(url, {method: method, data: body})

            const data =  response.data

            await setLoading(false)

            return data
        } catch (e) {
            await setLoading(false)
            await setError(e)
            console.log(e)
            return Promise.reject(e)
        }
    }, [])



    const clearError = useCallback(async () => {
        await setError(null)
    } ,[])


    return {loading, error, request, clearError}
}
