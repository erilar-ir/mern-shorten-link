import React from "react";
import './links-list.css'
import {LinkItem} from "./link-item";

export const LinksList = ({links}) => {
    if (links.length === 0) {
        return (
            <div className={'links-list'}>
                <div className={'no-links'}>
                    <p> There is no links yet</p>
                </div>
            </div>
        )
    }

    return (
        <div className={'links-list'}>
            <table className={'responsive-table highlight '}>
                <thead>
                <tr>
                    <th>#</th>
                    <th>Title / Destination</th>
                    <th>Short link</th>
                    <th>Clicks</th>
                    <th>Details</th>
                    {/*<th>Edit</th>*/}
                </tr>
                </thead>
                <tbody>
                {links.map((link, index) => {
                    return <LinkItem key={link._id} link={link} index={index} />
                })}
                </tbody>
            </table>
        </div>
    )
}
