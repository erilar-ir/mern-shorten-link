import React from 'react'
import botImg from './bot-notfound.svg'
import './no-link.css'
import {NavLink} from "react-router-dom";
export const NoLink = () => {
return (
    <div className={'container no-link'}>
        <div className={'error-bot'}>
            <img className={'bot-img'} src={botImg} alt={'bot-notfound'} />
            <h4 className={'grey-text text-darken-1'}>Link not Found</h4>
        </div>
        <div className="action-button">
            <NavLink to={'/links'} className={'btn teal lighten-2'}><i className={'material-icons left'}>arrow_back
            </i> Back to all links</NavLink>
        </div>
    </div>
)
}
