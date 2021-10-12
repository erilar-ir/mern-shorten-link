import React from "react";
import './link-card.css'

export const LinkCard = ({link, removeLink, openInNewTab}) => {
    const {to, from, clicks, date} = link


    return (
        <div className="link-card">
            <h2>Link info</h2>
            <p>Short link: <span className={'blue-text text-darken-2 span-link short'} onClick={() => openInNewTab(to)}>{to}</span></p>
            <p>Destination link: <span className={'blue-text text-darken-2 span-link'} onClick={() => openInNewTab(from)}>{from}</span></p>
            <p>Link clicks: <strong>{clicks}</strong></p>
            <p>Create date: <strong>{new Date(+date).toLocaleDateString()}</strong></p>

            <button className="btn red lighten-1" onClick={removeLink}>Remove link</button>
        </div>
    )
}
