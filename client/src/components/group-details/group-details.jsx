import React, {useCallback, useEffect, useState} from 'react'
import {useHttp, useMessage} from "../../hooks";
import Loader from "../loader";
import {Link, useHistory, useParams} from "react-router-dom";
import {GroupService} from '../../services'
import GroupCard from "./group-card";
import LinksCard from "./links-card";
import './group-details.css'


export const GroupDetails = () => {
    const {loading} = useHttp()
    const history = useHistory()
    const message = useMessage()
    const [group, setGroup] = useState(null)
    const {getGroupDetails, assignLinkToGroup, withdrawLinkFromGroup} = GroupService()
    const groupId = useParams().id

    useEffect(async () => {
        await getGroup()
    }, [])

    const getGroup = useCallback(async () => {
        try {
            const group = await getGroupDetails(groupId)
                .catch(error => {
                    history.push('/uconsole')
                    message(error.message, 'error')
                })
            await setGroup(group)

        } catch (e) {
            history.push('/uconsole')
            message(e.message, 'error')
            console.log(e)
        }

    }, [])

    const assignLink = useCallback(async (linkId) => {
        try {
            // await setProcessing(true)
            const assignedLink = await assignLinkToGroup(groupId, linkId)
            message(assignedLink.message, 'success')
            // await setProcessing(false)
            await getGroup()
        } catch (e) {
            // setProcessing(false)
            message(e.message, 'warn')
            console.log(e)
        }
    }, [])
    const withdrawLink = useCallback(async (linkId) => {
        try {
            // await setProcessing(true)
            const assignedLink = await withdrawLinkFromGroup(groupId, linkId)
            message(assignedLink.message, 'success')
            // await setProcessing(false)
            await getGroup()
        } catch (e) {
            // setProcessing(false)
            message(e.message, 'warn')
            console.log(e)
        }
    }, [])


    if (loading) {
        return <Loader/>
    }
    if (!group) {
        return <Loader/>
    }
    const groupLinks = group ? <GroupCard group={group} withdrawLink={withdrawLink}/> : <Loader />
    const availableLinks = group ? <LinksCard group={group} assignLink={assignLink}/> : <Loader />
    return (
        <div className="group-details">
            <Link className={'back-to-console'} to={'/uconsole'}>
                <i className="material-icons">arrow_back</i>
                <p> Back to Group list</p>
            </Link>
            <div className="row">
                <div className="col s6">
                    {groupLinks}
                </div>
                <div className="col s6">
                    {availableLinks}
                </div>
            </div>

        </div>
    )


}

