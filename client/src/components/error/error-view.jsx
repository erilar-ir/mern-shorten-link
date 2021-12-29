import React from 'react'
import './error-view.css'

export const ErrorView = ({err}) => {
    // const {error, errorInfo} = err
    return (
        <div className={'error-view'}>
            <i className={'medium material-icons red-text lighten-1'}>error_outline</i>
            <p>Something went wrong.</p>
            {/*<details style={{whiteSpace: 'pre-wrap'}}>*/}
            {/*    {error && error.toString()}*/}
            {/*    <br/>*/}
            {/*    {errorInfo?.componentStack ? errorInfo.componentStack : null}*/}
            {/*</details>*/}
        </div>
    )
}
