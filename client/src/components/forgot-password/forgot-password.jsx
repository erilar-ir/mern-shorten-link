import React, {useState} from 'react'
import './forgot-password.css'
import botImg from "../error/bot-thinking.svg";
import {useDispatch, useSelector} from "react-redux";
import {selectAuthError, resetPasswordRequest} from "../../store/auth-slice";
import {useMessage} from "../../hooks";

export const ForgotPassword = () => {

    const [email, setEmail] = useState('')
    const disableOnEmptyInputs = !(email.length === 0)
    const dispatch = useDispatch()
    const message = useMessage()
    const authError = useSelector(selectAuthError)
    const emailErrorMessage = authError ? authError.message : null
    const formHandler = event => {
        event.preventDefault()
        setEmail(event.target.value)
    }
    const resetHandler = async () => {
        try {
            const resetRequest = await dispatch(resetPasswordRequest({email})).unwrap()
            message(resetRequest.message, 'success')
        } catch (e) {
            message(e, 'warn')
            console.log(e)
        }
    }

    return (
        <div className="forgot-password">
            <div className="row">
                <div className="col s12 m10 l4 offset-l4 offset-m1">
                    <div className="card grey lighten-5">
                        <div className="card-content black-text center-align ">
                            <div className={'card-image forgot-bot'}>
                                <img className={'bot-img'} src={botImg} alt={'bot-thinking'} />
                            </div>
                            <h4 className="card-title orange-text forgot-title">Forgot your password?</h4>
                            <span className={'card-content grey-text text-darken-1'}>It could happen to everyone. Enter your email to request password reset link.</span>
                            <div className={'forgot-password-form-fields'}>
                                <div className="input-field">
                                    <input
                                        type="email"
                                        id={'user_email'}
                                        name={'email'}
                                        onChange={formHandler}
                                        value={email}
                                        className={emailErrorMessage ? 'invalid': undefined}
                                    />
                                    <label htmlFor={'user_email'}>Email</label>
                                    {emailErrorMessage && <span className="helper-text" data-error={emailErrorMessage}>Helper text</span>}

                                </div>

                            </div>
                        </div>
                        <div className="card-action buttons">
                            <button className="btn orange darken-1 full-width" onClick={resetHandler} disabled={!disableOnEmptyInputs}>Reset Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
