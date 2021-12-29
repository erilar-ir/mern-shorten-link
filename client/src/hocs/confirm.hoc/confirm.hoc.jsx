import React from 'react'
import './confirm.hoc.css'

export const withConfirm = (props) => {
    const {doubt = () => {}, closeModal = () => {}} = props
    return (
        <div className={'confirm-container'}>
            <button className={'waves-effect waves-light btn green lighten-1 confirm'} onClick={doubt}>Yes</button>
            <button className={'waves-effect waves-light btn red lighten-1 decline'} onClick={closeModal}>No</button>
        </div>
    )
}
