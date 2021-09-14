import React, {useCallback, useContext, useEffect, useState} from "react";
import './links-page.css'
import {AuthContext} from "../../context";
import {useHttp} from "../../hooks";
import Loader from "../loader";
import LinksList from "./links-list";

export const LinksPage = () => {

    const {token} = useContext(AuthContext)
    const {loading, request} = useHttp()
    const [links, setLinks] = useState([])
    const getLinks = useCallback( async () => {
        try {
            const fetched = await request('/api/link', 'GET', null, {
                Authorization: `Bearer ${token}`
            })
            setLinks(fetched)
            console.log(fetched)
        } catch (e) {
            console.log(e)
        }
    }, [token, request])

    useEffect(() => {
        getLinks()
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
