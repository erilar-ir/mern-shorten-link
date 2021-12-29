import React from 'react'

import Loader from "../loader";
import {Link, useHistory, useParams} from "react-router-dom";

import GroupCard from "./group-card";
import './group-details.css'
import {useSelector, useDispatch} from "react-redux";
import {deleteGroup, selectGroupById} from "../../store/group-slice";
import {selectAllLinks} from "../../store/link-slice";
import {useMessage, useModal} from "../../hooks";
import GroupStatistics from "./group-statistics";


export const GroupDetails = () => {
    const groupId = useParams().id
    const dispatch = useDispatch()
    const history = useHistory()
    const message = useMessage()
    const allLinks = useSelector(selectAllLinks)
    const group = useSelector(state => selectGroupById(state, groupId))

    const removeGroup = async () => {
        try {
            history.push('/management')
            const deleted = await dispatch(deleteGroup(groupId)).unwrap()
            message(deleted.message, 'success')
        } catch (e) {
            history.push('/management')
            message(e.message, 'error')
        }
    }
    if (!group) {
        return <Loader/>
    }
    const linksToAssign = allLinks.filter(link => !group.links.includes(link._id))
    const assignedLinks = allLinks.filter(link => group.links.includes(link._id))

    const assignLinksModal = useModal('assign-links', {linksToAssign, hideButtonText: true})
    const editGroupModal = useModal('edit-group', {id: groupId, hideButtonText: true, focused: true})
    const deleteWithConfirmation = useModal('confirm-delete', {doubt: removeGroup, tooltipName: 'group', id: `delete-${groupId}`, name: group.name, hideButtonText: true})
    const addLinkModal = useModal('add', {id: groupId, hideButtonText: true, focused: true})
    const groupLinks = group ? <GroupCard group={group} assignedLinks={assignedLinks} /> : <Loader />

    return (
        <div className="group-details">
            <Link className={'back-to-console'} to={'/management'}>
                <i className="material-icons">arrow_back</i>
                <p> Back to Group list</p>
            </Link>
            <div className="row group-row">
                <div className="col s12 m12 l6">
                    {groupLinks}
                    <div className={'button-group'}>
                        {deleteWithConfirmation}
                        {assignLinksModal}
                        {editGroupModal}
                        {addLinkModal}
                    </div>
                </div>
                <div className="col s12 m12 l6">
                    <GroupStatistics assignedLinks={assignedLinks} />
                </div>
            </div>
        </div>
    )


}

