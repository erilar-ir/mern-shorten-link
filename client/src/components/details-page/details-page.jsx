import React, {useCallback, useContext, useEffect, useState} from "react";
import './details-page.css'
import {useParams} from "react-router-dom";
import {useHttp} from "../../hooks";
import {AuthContext} from "../../context";
import Loader from "../loader";
import LinkCard from "./link-card";

export const DetailsPage = () => {
    const {token} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const [link, setLink] = useState(null)
    const linkId = useParams().id

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

    useEffect(() => {
        getLink()
    }, [getLink])

    if (loading) {
        return <Loader />
    }

    return (
        <>
            {!loading && link && <LinkCard link={link} />}
        </>
    )
}
