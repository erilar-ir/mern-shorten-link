import React, {useCallback, useContext, useEffect, useState} from "react";
import './details-page.css'
import {useHistory, useParams} from "react-router-dom";
import {useHttp, useMessage} from "../../hooks";
import {AuthContext} from "../../context";
import Loader from "../loader";
import LinkCard from "./link-card";

export const DetailsPage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [link, setLink] = useState(null)
    const history = useHistory()
    const linkId = useParams().id
    const message = useMessage()

    const getLink = useCallback(async () => {
        try {
           await request(`/api/link/${linkId}`, 'GET', null, {
                Authorization: `Bearer ${token}`
            }).then((data) => {
                setLink(data)
            })
        }catch (e) {
            console.log(e)
        }

    }, [token, request, linkId])

    const removeLink = useCallback(async () => {
        try {
            await request(`/api/link/remove/${linkId}`, 'POST', null, {
                Authorization: `Bearer ${token}`
            }).then((data) => {
                history.push('/links')
                message(data.message)
            })
        }catch (e) {
            console.log(e)
        }
    }, [token, request, linkId])


    useEffect(() => {
        getLink()
    }, [getLink])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && link && <LinkCard link={link} removeLink={removeLink} />}
        </>
    )
}
