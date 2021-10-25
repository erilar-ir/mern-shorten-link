import React from 'react'
import {useHistory} from "react-router-dom";
import {useHttp, useMessage} from "../../../hooks";
import {GroupService} from "../../../services";
import Loader from "../../loader";
import './group-card.css'

export const GroupCard = ({group, withdrawLink}) => {
    const {loading} = useHttp()
    const {removeGroup} = GroupService()
    const history = useHistory()
    const message = useMessage()
    const groupId = group._id

    const deleteGroup = async (id) => {
        try {
            const deleted = await removeGroup(id)
            message(deleted.message, 'success')
            history.push('/uconsole')
        } catch (e) {
            message(e.message, 'error')
            history.push('/uconsole')
        }

    }
    const renderGroupLinks = () => {
        if (group.links.length === 0) {
            return <p>No links assigned to group</p>
        }
        return(
            <ul className={'group-links'}>
                {group.links.map((link) => {
                    return(
                        <li className={'group-link'} key={link._id} >
                            <div className={'withdraw-link'}>
                                <button className="btn  orange lighten-1 btn-small" onClick={() => withdrawLink(link._id)}>
                                    <i className=" material-icons">clear</i>
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

    if (loading) {
        return <Loader/>
    }
    const groupLinks = renderGroupLinks()

    return (
        <div className="group-card">
            <h1>{group?.name}</h1>
            {group && groupLinks}
            <button className="btn red lighten-1" onClick={() => deleteGroup(groupId)}>Delete Group</button>
        </div>
    )
}
