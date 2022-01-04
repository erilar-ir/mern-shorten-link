import React, {useEffect, useRef} from 'react'
import {deleteGroup} from "../../../store/group-slice";
import {useMessage, useModal} from "../../../hooks";
import {useHistory} from "react-router-dom";
import {useDispatch} from "react-redux";
import M from "materialize-css";

export const GroupItem = ({group}) => {
    const message = useMessage()
    const history = useHistory()
    const dispatch = useDispatch()
    const tooltip = useRef()

    const openDetails = async () => {
        history.push(`/groups/${group._id}`)
    }

    const removeGroup = async () => {
        try {
            console.log(`delete ${group._id}`)
            const deleted = await dispatch(deleteGroup(group._id)).unwrap()
            message(deleted.message, 'success')
        } catch (e) {
            message(e.message, 'error')
        }
    }
    const deleteWithConfirmation = useModal('confirm-delete', {doubt: removeGroup, tooltipName: 'group', id: group._id, name: group.name, hideButtonText: true})
    useEffect(() => {
        M.Tooltip.init(tooltip.current)
    }, [])

    return (
        <div className={'group-item'}>
            <div
                className={'group-name col l6 m8 s8'}

            >{group.name}</div>
            <div className={'group-tools col l4 m4 s4'}>
                <button
                    ref={tooltip}
                    onClick={openDetails}
                    className="btn teal lighten-1 tooltipped"
                    data-tooltip={'Open group details'}
                    data-position={'top'}
                ><i
                    className={'material-icons'}>details</i></button>

                {/*<button onClick={removeGroup} className="btn red lighten-1"><i*/}
                {/*    className={'material-icons'}>delete</i></button>*/}

                {deleteWithConfirmation}
            </div>
        </div>
    )
}
