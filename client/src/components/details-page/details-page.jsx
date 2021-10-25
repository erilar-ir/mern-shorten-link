import React, {useCallback, useEffect, useState} from "react";
import './details-page.css'
import {useHistory, useParams} from "react-router-dom";
import {useHttp, useMessage} from "../../hooks";
import Loader from "../loader";
import LinkCard from "./link-card";
import {LinksService} from "../../services";

export const DetailsPage = () => {
    const {linkDetails, deleteLink} = LinksService()
    const {loading} = useHttp()
    const [link, setLink] = useState(null)
    const [linkClicks, setLinkClicks] = useState(0)
    const history = useHistory()
    const linkId = useParams().id
    const message = useMessage()

    const getLink = useCallback(async () => {
        try {
            const link = await linkDetails(linkId)
                .catch(error => {
                history.push('/links')
                message(error.message, 'error')
            })
            await setLink(link)

        } catch (e) {
            history.push('/links')
            message(e.message, 'error')
        }

    }, [linkClicks])

    const removeLink = useCallback(async () => {
        await deleteLink(linkId)
            .then(
                data => {
                    history.push('/links')
                    message(data.message, 'success')
                })
            .catch(e => {
                console.log(e)
                message(e.message, 'error')
            })

    }, [linkId])

    const openInNewTab = async url => {
        const newWindow = await window.open(url, '_blank', 'noopener,noreferrer')
        if (newWindow) newWindow.opener = null
        await setLinkClicks(linkClicks + 1)
        await getLink()
    }

    useEffect(async () => {
        await getLink()
    }, [getLink])

    if (loading) {
        return <Loader/>
    }

    return (
        <>
            {!loading && link && <LinkCard openInNewTab={openInNewTab} link={link} removeLink={removeLink}/>}
        </>
    )
}
