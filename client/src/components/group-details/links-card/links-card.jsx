import React, {useCallback, useContext, useEffect, useState} from "react";
import './links-card.css'
import {useHttp, useMessage} from "../../../hooks";
import {LinksService} from "../../../services";
import Loader from "../../loader";
import {AuthContext} from "../../../context";

export const LinksCard = ({group, assignLink}) => {
    const {logout} = useContext(AuthContext)
    const {loading} = useHttp()
    const [links, setLinks] = useState(null)
    const {fetchLinks} = LinksService()
    const message = useMessage()
    const getLinks = useCallback(async () => {
        try {
            const fetched = await fetchLinks()
            const linksIds = group.links.map(link => link._id)
            const filteredLinks = fetched.filter(fetchLink => !linksIds.includes(fetchLink._id))
            setLinks(filteredLinks)
        } catch (e) {
            console.log(e)
            message(e.message, 'error')
            if (e.status === 401) {
                await logout()
            }
        }
    }, [group])
    const renderLinks = (links) => {
        if (links.length === 0) {
            return <p>No links left to assign</p>
        }
        return (
            <ul className="links-list">
                {links.map(link => {
                    return (
                        <li className={'link-item'} key={link._id}>
                            <div className={'assign-link'}>
                                <button className=" waves-effect waves-light btn btn-small" onClick={() => assignLink(link._id)}><i
                                    className=" material-icons">library_add</i>
                                </button>

                            </div>
                            <div className={'link-name'}>
                                {link.to}
                            </div>

                        </li>
                    )
                })}
            </ul>
        )
    }


    useEffect(async () => {
        await getLinks()
    }, [getLinks])

    if (loading) {
        return <Loader/>
    }
    return (
        <div className={'links-card'}>
            <h1>Assign Links</h1>
            {links && renderLinks(links)}
        </div>
    )
}
