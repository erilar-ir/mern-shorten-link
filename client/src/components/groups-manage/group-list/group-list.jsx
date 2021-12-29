import React from 'react'

import {useSelector} from "react-redux";
import {selectGroups} from "../../../store/group-slice";
import {GroupItem} from "./group-item";
import ErrorBoundary from "../../error-boundary";


export const GroupList = () => {

    const groups = useSelector(selectGroups)

    if (groups.length === 0) {
        return (
            <div>
                <h2>User Groups</h2>
                <p>You have no groups yet</p>
            </div>

        )
    } else {
        return (
            <div>
                <h3>User Groups</h3>
                <ul className={'group-list'}>
                    {groups.map(group => {
                        return (
                            <li key={group._id} className={'group-item row'}>
                                <ErrorBoundary>
                                    <GroupItem group={group} />
                                </ErrorBoundary>
                            </li>
                        )
                    })}
                </ul>
            </div>

        )
    }
}
