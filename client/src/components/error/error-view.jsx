import React from 'react'
import './error-view.css'
import botImg from "./bot-thinking.svg";
import {NavLink} from "react-router-dom";

export const ErrorView = ({err}) => {
    // const {error, errorInfo} = err
    return (
        <div className={'container error-view'}>
            <div className={'error-bot'}>
                <img className={'bot-img'} src={botImg} alt={'bot-thinking'} />
            </div>
            <h5 className={'grey-text text-darken-1'}>Something went wrong.</h5>
            <div className="action-button">
                <NavLink to={'/'} className={'btn teal lighten-2'}><i className={'material-icons left'}>arrow_back
                </i> Back to homepage</NavLink>
            </div>
            {/*<details style={{whiteSpace: 'pre-wrap'}}>*/}
            {/*    {error && error.toString()}*/}
            {/*    <br/>*/}
            {/*    {errorInfo?.componentStack ? errorInfo.componentStack : null}*/}
            {/*</details>*/}
        </div>
    )
}
