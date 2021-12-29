import React from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useMessage} from "../../../hooks";
import {useParams} from "react-router-dom";
import {assignLinkToGroup, selectLockAssignAndDeleteButtons} from "../../../store/group-slice";
import {useModal} from "../../../hooks/";

export const AssignLinkItem = ({link}) => {
    const dispatch = useDispatch()
    const message = useMessage()
    const groupId = useParams().id
    const locked = useSelector(selectLockAssignAndDeleteButtons)
    const editLinkModal = useModal('edit-link', {id: link._id})
    const assignLink = async (linkId) => {
        try {
            const assignedLink = await dispatch(assignLinkToGroup({groupId, linkId})).unwrap()
            message(assignedLink.data.message, 'success')
        } catch (e) {
            message(e.message, 'warn')
        }
    }
    return (
        <>
            <div className={'assign-link'}>
                <button className=" waves-effect waves-light btn btn-small"
                        onClick={() => assignLink(link._id)} disabled={locked}><i
                    className=" material-icons">library_add</i>
                </button>
            </div>
            <div className={'link-names'}>
                <span className={'from'}>Source: <span>{link.title ? link.title : link.from}</span></span>
                <span className={'to teal lighten-4 text-accent-1'}>Short link: <span>{link.to}</span></span>
            </div>
            <div className={'edit-link'}>
                {editLinkModal}
            </div>
        </>
    )
}
