import React, {useEffect, useState} from 'react'
import './password-reset.css'
import {useHistory, useLocation} from "react-router-dom";
import {useMessage} from "../../hooks";
import $api from '../../services'
import M from 'materialize-css'

export const PasswordReset = () => {
    const { search } = useLocation()
    const query = React.useMemo(() => new URLSearchParams(search), [search])
    const [form, setForm] = useState({
        password: '',
        passwordConfirm: ''
    })
    const [error, setError] = useState(null)
    const [passwordError, setPasswordError] = useState(null)

    const message = useMessage()
    const history = useHistory()
    const formHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const setNewPasswordHandler = async () => {
        try {
            const {password, passwordConfirm} = form
            if (password !== passwordConfirm) {
                return message('Passwords in both fields should be equal', 'warn')
            }
            const token = query.get("token")
            const userId = query.get("id")
            const renewedPassword = await $api.post('/api/auth/resetPassword', {userId: userId, token: token, password: password})
            message(renewedPassword.data.message, 'success')
            history.push('/auth')
        } catch (e) {
            setError(e)
            message(e.message, 'warn')
        }
    }
    const disableOnEmptyInputs = !(form.passwordConfirm.length === 0 || form.password.length === 0)
    useEffect(() => {
        if (error && error.errors.length > 0) {
            let errorArray = null
            error.errors.forEach(error => {
                errorArray = errorArray ? `${errorArray}, ${error}` : error
            })
            setPasswordError(errorArray)
        }
        M.updateTextFields()
    }, [error])
    return (
        <div className={'password-reset'}>
            <div className="row">
                <div className="col s12 m10 l4 offset-l4 offset-m1">
                    <div className="card grey lighten-5">
                        <div className="card-content black-text  ">
                            <h4 className="card-title ">Set new password</h4>
                            <div className={'forgot-password-form-fields'}>
                                <div className="input-field">
                                    <input
                                        type="password"
                                        id={'password'}
                                        name={'password'}
                                        onChange={formHandler}
                                        value={form.password}
                                        className={passwordError ? 'invalid': undefined}
                                    />
                                    <label htmlFor={'password'}>Password</label>
                                    {passwordError && <span className="helper-text" data-error={passwordError}>Helper text</span>}
                                </div>
                                <div className="input-field">
                                    <input
                                        type="password"
                                        id={'passwordConfirm'}
                                        name={'passwordConfirm'}
                                        onChange={formHandler}
                                        value={form.passwordConfirm}
                                    />
                                    <label htmlFor={'passwordConfirm'}>Confirm password</label>
                                </div>
                            </div>
                        </div>
                        <div className="card-action buttons">
                            <button className="btn darken-1 full-width" onClick={setNewPasswordHandler} disabled={!disableOnEmptyInputs}>Reset Password</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
