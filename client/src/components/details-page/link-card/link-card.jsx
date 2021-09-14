import React from "react";
import './link-card.css'

export const LinkCard = ({
                             link
                         }) => {
    const {
        to, from, clicks, date
    } = link
    return (
        <div className="link-card">
            <h2>Link info</h2>
            <p>Short link: <a href={to} target={'_blank'} rel={'noreferrer noopener'}>{to}</a></p>
            <p>Destination link: <a href={from} target={'_blank'} rel={'noreferrer noopener'}>{from}</a></p>
            <p>Link clicks: <strong>{clicks}</strong></p>
            <p>Create date: <strong>{new Date(+date).toLocaleDateString()}</strong></p>
        </div>
    )
}
