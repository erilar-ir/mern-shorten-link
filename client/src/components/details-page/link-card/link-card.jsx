import React from "react";
import './link-card.css'
import {deleteLink} from '../../../store/link-slice'
import {useHistory, useParams} from "react-router-dom";
import {useDispatch} from "react-redux";
import {useMessage} from "../../../hooks";
import {useModal} from "../../../hooks";

export const LinkCard = ({link, openInNewTab}) => {
    const {to, from, clicks, date, title} = link;
    const linkId = useParams().id
    const dispatch = useDispatch()
    const history =  useHistory()
    const message = useMessage()
    const modalEdit = useModal('edit-link', {id: linkId, focused: true})

    const removeLink = async () => {
      const data = await dispatch(deleteLink(linkId)).unwrap()
        history.push('/links')
        message(data.message, 'success')
    }

    const name = title ? title : to
    const headerText = title ? `${title} details` : `Link details`
    const deleteWithConfirmation = useModal('confirm-delete', {doubt: removeLink, tooltipName: 'link', name })
    return (
        <div className="link-card">

            <h3>{headerText}</h3>
            <p>Short link: <span className={'blue-text text-darken-2 span-link short'} onClick={() => openInNewTab(to)}>{to}</span></p>
            <p>Destination link: <a className={'blue-text text-darken-2 span-link'} href={from} target={'_blank'} rel={'noopener noreferrer'}>{from}</a></p>
            <p>Link clicks: <strong>{clicks}</strong></p>
            <p>Create date: <strong>{new Date(+date).toLocaleDateString()}</strong></p>
            <div className={'details-buttons'}>
                {modalEdit}
                {deleteWithConfirmation}
            </div>

        </div>
    )
}
