import React from "react";
import './assign-links-card.css'
import {AssignLinkItem} from "./assign-link-item";

export const AssignLinksCard = ({linksToAssign}) => {
    if (linksToAssign.length === 0) {
        return (
            <div className={'links-card'}>
                <p>No links left to assign</p>
            </div>
        )
    }
    return (
        <div className={'links-card'}>
            <ul className="links-list">
                {linksToAssign.map(link => {
                    return (
                        <li className={'link-item card'} key={link._id}>
                            <AssignLinkItem link={link} />
                        </li>
                    )
                })}
            </ul>
        </div>
    )
}
