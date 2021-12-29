import React, {useEffect, useRef} from 'react'
import {selectLockAssignAndDeleteButtons, withdrawLinkFromGroup} from "../../../store/group-slice";
import {useDispatch, useSelector} from "react-redux";
import {useMessage} from "../../../hooks";
import {useParams} from "react-router-dom";
import M from "materialize-css";

export const GroupCardLinkItem = ({link}) => {
    const dispatch = useDispatch()
    const message = useMessage()
    const groupId = useParams().id
    const locked = useSelector(selectLockAssignAndDeleteButtons)
    const tooltip = useRef()

    const withdrawLink = async (linkId) => {
        try {
            const withdrawnLink = await dispatch(withdrawLinkFromGroup({groupId, linkId})).unwrap()
            message(withdrawnLink.data.message, 'success')
        } catch (e) {
            message(e.message, 'warn')
            console.log(e)
        }
    }
    useEffect(() => {
        M.Tooltip.init(tooltip.current)
    }, [])
    return (
        <>
            <div className={'withdraw-link'}>
                <button
                    className="btn orange lighten-1 btn-small tooltipped"
                    onClick={() => withdrawLink(link._id)}
                    disabled={locked}
                    ref={tooltip}
                    data-tooltip={'Withdraw link from group'}
                    data-position={'top'}
                >
                    <i className=" material-icons">clear</i>
                </button>

            </div>
            <div className={'link-names'}>
                <span className={'from'}>Source: <span>{link.title ? link.title : link.from}</span></span>
                <span className={'to orange lighten-4 text-accent-1'}>Short link: <span>{link.to}</span></span>
            </div>
        </>
    )
}
