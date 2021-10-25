import React from 'react'
import {useMessage} from "../../hooks";
import {GroupService} from "../../services";
import {useHistory} from "react-router-dom";



export const GroupList = ({groups, getUserGroups}) => {
    const message = useMessage()
    const history = useHistory()

    const {removeGroup} = GroupService()

    const openDetails = async (id) => {
        history.push(`/groups/${id}`)
    }
    const deleteGroup = async (id) => {
        const deleted = await removeGroup(id)
        message(deleted.message, 'success')
        await getUserGroups()
    }

    if (groups.length === 0) {
        return (
            <p>You have no groups yet</p>
        )
    } else {
        return (
            <div>
                <h2>User Groups</h2>
                <ul className={'group-list'}>
                    {groups.map(group => {
                        return (
                            <li key={group._id} className={'group-item'}>
                                <div className={'group-name'}>{group.name}</div>
                                <div className={'group-tools'}>
                                    <button onClick={() => openDetails(group._id)} className="btn teal lighten-1"><i
                                        className={'material-icons'}>details</i></button>
                                    <button onClick={() => deleteGroup(group._id)} className="btn red lighten-1"><i
                                        className={'material-icons'}>delete</i></button>
                                </div>
                            </li>
                        )
                    })}
                </ul>
            </div>

        )
    }
}
