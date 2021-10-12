import React, {useCallback, useContext, useEffect, useState} from "react";
import './links-page.css'
import {useHttp, useMessage} from "../../hooks";
import Loader from "../loader";
import LinksList from "./links-list";
import {AuthContext} from "../../context";

export const LinksPage = () => {
    const {logout} = useContext(AuthContext)
    const message = useMessage()
    const {loading, request} = useHttp()
    const [links, setLinks] = useState([])
    const getLinks = useCallback( async () => {
        try {
            const fetched = await request('/api/link')
            setLinks(fetched)
        } catch (e) {
            console.log(e)
            message(e.message)
            if (e.status === 401) {
                await logout()
            }
        }
    }, [request])

    useEffect(async () => {
        await getLinks()
    }, [getLinks])

    if (loading) {
        return <Loader />
    }

    return (
       <>
           {!loading && <LinksList links={links} />}
       </>
    )
}
