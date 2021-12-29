import React, {useState} from "react";
import './auth-page.css'
import { useMessage} from "../../hooks";
import {useDispatch, useSelector} from "react-redux";
import {login, register, selectAuthReady} from "../../store/auth-slice";

export const AuthPage = () => {

    const dispatch = useDispatch()
    // const error = useSelector(selectAuthError)
    const ready = useSelector(selectAuthReady)

    const [form, setForm] = useState({
        email: '', password: ''
    })
    const message = useMessage()
    // useEffect(async () => {
    //     if (error) {
    //         message(error.message, 'warn')
    //         dispatch(clearError)
    //     }
    // }, [error])

    const formHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const registerHandler = async () => {
      try {
          const email = form.email
          const password = form.password
          await dispatch(register({email: email, password: password})).unwrap()
          message(`User created successfully. Activation link sent to ${form.email}.`, 'success')
      }catch (e) {
          message(e.message, 'error')
      }
    }
    const loginHandler = async () => {
      try {
          const email = form.email
          const password = form.password
          await dispatch(login({email: email, password: password})).unwrap()
      }catch (e) {
          message(e.message, 'error')
      }
    }

  return (
      <div className={'auth-page'}>
         <div className="row">
             <div className="col s12 m10 l6 offset-l3 offset-m1">
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
                         <button className="btn yellow darken-4" onClick={loginHandler} disabled={!ready}>Sign In</button>
                         <button className="btn teal lighten-1 " onClick={registerHandler} disabled={!ready}>Sign Up</button>
                     </div>
                 </div>
             </div>
         </div>
      </div>
  )
}
