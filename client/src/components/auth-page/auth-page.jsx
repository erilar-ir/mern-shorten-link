import React, {useContext, useEffect, useState} from "react";
import './auth-page.css'
import {useHttp, useMessage} from "../../hooks";
import {AuthContext} from "../../context";
import {AuthService} from "../../services";

export const AuthPage = () => {
    const auth = useContext(AuthContext)

    const {loading, error, clearError} = useHttp()
    const {login, register} = AuthService()
    const [form, setForm] = useState({
        email: '', password: ''
    })
    const message = useMessage()
    useEffect(() => {
        message(error)
        clearError()
    }, [error, message, clearError])

    const formHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
      try {
          await register(form.email, form.password)
          message(`User created successfully. Activation link sent to ${form.email}.`)
      }catch (e) {
          message(e.message)
          // console.log(e)
      }
    }
    const loginHandler = async () => {
      try {
          const data = await login(form.email, form.password)
          auth.login(data.accessToken, data.user.id)
      }catch (e) {
          message(e.message)

          console.log(e)
      }
    }

  return (
      <div className={'auth-page'}>
         <div className="row">
             <div className="col s6 offset-s3">
                 <h1>Shorten the link</h1>
                 <div className="card grey lighten-5">
                     <div className="card-content black-text">
                         <span className="card-title">Authorization</span>
                         <div className={'auth-form-fields'}>
                            <div className="input-field">
                            <input type="text" id={'email'} name={'email'} onChange={formHandler} value={form.email}/>
                                <label htmlFor="{'email'}">Email</label>
                            </div>
                            <div className="input-field">
                            <input type="password" id={'password'} name={'password'} onChange={formHandler} value={form.password}/>
                                <label htmlFor="{'password'}">Password</label>
                            </div>

                         </div>
                     </div>
                     <div className="card-action buttons">
                         <button className="btn yellow darken-4" onClick={loginHandler} disabled={loading}>Sign In</button>
                         <button className="btn teal lighten-1 " onClick={registerHandler} disabled={loading}>Sign Up</button>
                     </div>
                 </div>
             </div>
         </div>
      </div>
  )
}
