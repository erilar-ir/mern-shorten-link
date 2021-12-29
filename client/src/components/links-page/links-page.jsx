import React, {useEffect} from "react";
import './links-page.css'
import Loader from "../loader";
import LinksList from "./links-list";
import {useDispatch, useSelector} from "react-redux";
import {getLinks, linksSliceStatus, selectAllLinks} from '../../store/link-slice'
import {useMessage} from "../../hooks";

export const LinksPage = () => {
    const dispatch = useDispatch()
    const reduxLinks = useSelector(selectAllLinks)
    const linksStatus = useSelector(linksSliceStatus)
    const linksError = useSelector(state => state.links.error)
    const message = useMessage()

    useEffect(async () => {
        if (linksStatus === 'idle') {
            try {
                await dispatch(getLinks()).unwrap()
            } catch (e) {
                message(e.message, 'error')
            }
        }

    }, [])

    let content

    switch (linksStatus) {
        case 'loading':
            content = <Loader/>
            break
        case 'succeeded':
            content = <LinksList links={reduxLinks}/>
            break
        case 'failed':
            message(linksError.message)
            console.log(linksError.message)
            content = <p>Something went wrong</p>
            break
        default:
            content = <Loader/>
            break
    }

    return (
        <div className={'links-page row section'}>
            <div className="links-col col s12 m12 l12">
                {content}
            </div>
        </div>
    )
}
