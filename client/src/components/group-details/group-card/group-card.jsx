import React from 'react'
import './group-card.css'
import {GroupCardLinkItem} from "./group-card-link-item";

export const GroupCard = ({assignedLinks, group}) => {
    const renderGroupLinks = () => {
        if (assignedLinks.length === 0) {
            return <p>No links assigned to group</p>
        }
        return(
            <ul className={'group-links'}>
                {assignedLinks.map((link) => {
                    return(
                        <li className={'group-link card'} key={link._id} >
                            <GroupCardLinkItem link={link} />
                        </li>
                    )
                })}
            </ul>
        )
    }
    const groupLinks = renderGroupLinks()
    const groupDescription = group.description ? <p>{group.description}</p> : null

    return (
        <div className="group-card">
            <h2>{group?.name}</h2>
            {group && groupDescription }
            {group && groupLinks}
        </div>
    )
}
