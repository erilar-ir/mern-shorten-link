import React, {useEffect, useState} from "react"
import './auth-page.css'
import {useMessage} from "../../hooks"
import {useDispatch, useSelector} from "react-redux"
import {login, register, selectAuthError, selectAuthReady, selectUserForm, setUserForm} from "../../store/auth-slice"
import {NavLink} from "react-router-dom";
import M from 'materialize-css'

export const AuthPage = () => {
    const dispatch = useDispatch()
    const ready = useSelector(selectAuthReady)
    const userForm = useSelector(selectUserForm)
    const authError = useSelector(selectAuthError)
    let emailErrorMessage,
        passwordErrorMessage = null
    if (authError) {
        if (authError.message.toLowerCase().includes('user')) {
            emailErrorMessage = authError.message
        }
        if (authError.message.toLowerCase().includes('password')) {
            passwordErrorMessage = authError.message
        }
        if (authError.errors.length > 0) {
            authError.errors.forEach(err => {
                if (err.toLowerCase().includes('email')) {
                    emailErrorMessage = emailErrorMessage ? `${emailErrorMessage}, ${err}` : err
                }
                if (err.toLowerCase().includes('password')) {
                    passwordErrorMessage = passwordErrorMessage ? `${passwordErrorMessage}, ${err}` : err
                }
            })
        }
    }
    const [form, setForm] = useState({
        email: userForm ? userForm.email : '',
        password: userForm ? userForm.password : ''
    })
    const message = useMessage()
    const formHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
        try {
            const {email, password} = form
            dispatch(setUserForm(form))
            await dispatch(register({email: email, password: password})).unwrap()
            message(`User created successfully. Activation link sent to ${form.email}.`, 'success')
        } catch (e) {
            message(e.message, 'warn')
        }
    }
    const loginHandler = async () => {
        try {
            const {email, password} = form
            dispatch(setUserForm(form))
            await dispatch(login({email: email, password: password})).unwrap()
        } catch (e) {
            message(e.message, 'warn')
        }
    }
    useEffect(() => {
        M.updateTextFields()
    }, [])
    const disableOnEmptyInputs = !(form.email.length === 0 || form.password.length === 0)
    return (
        <div className={'auth-page'}>
            <div className="row">
                <div className="col s12 m10 l6 offset-l3 offset-m1">
                    <div className="card grey lighten-5">
                        <div className="card-content black-text">
                            <span className="card-title">Authorization</span>
                                <div className={'auth-form-fields'}>
                                    <div className="input-field">
                                        <input
                                            type="email"
                                            id={'user_email'}
                                            name={'email'}
                                            onChange={formHandler}
                                            value={form.email}
                                            className={emailErrorMessage ? 'invalid': undefined}
                                        />
                                        <label htmlFor={'user_email'}>Email</label>
                                        {emailErrorMessage && <span className="helper-text" data-error={emailErrorMessage}>Helper text</span>}

                                    </div>
                                    <div className="input-field">
                                        <input
                                            type="password"
                                            id={'user_password'}
                                            name={'password'}
                                            onChange={formHandler}
                                            value={form.password}
                                            className={passwordErrorMessage ? 'invalid': undefined}/>
                                        <label htmlFor={'user_password'}>Password</label>
                                        {passwordErrorMessage && <span className="helper-text" data-error={passwordErrorMessage}>Helper text</span>}

                                    </div>
                                </div>
                        </div>
                        <div className="card-action buttons">
                            <button className="btn orange darken-1" onClick={loginHandler} disabled={!ready || !disableOnEmptyInputs}>Sign In</button>
                            <button className="btn teal lighten-1 " onClick={registerHandler} disabled={!ready || !disableOnEmptyInputs}>Sign Up</button>
                            <NavLink className={'orange-text forgot'} to={'/forgotten'}>Forgot your password?</NavLink>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
