import React, {useContext, useEffect, useState} from "react";
import './create-page.css'
import {useHttp, useMessage} from "../../hooks";
import {AuthContext} from "../../context";
import {useHistory} from "react-router-dom";
import Loader from "../loader";

export const CreatePage = () => {
    const message = useMessage()
    const {isAuthenticated, checkAuth} = useContext(AuthContext)
    const {request, loading} = useHttp()
    const history = useHistory()
    const [link, setLink] = useState('')

    useEffect(async ()=> {
        await checkAuth()
    }, [checkAuth])

    const linkHandler = event => {
      setLink(event.target.value)
    }

    const generateLink = async () => {
        try {
          const data = await request('/api/link/generate', 'POST', {from: link})
            history.push(`/details/${data.link._id}`)
            message(`Short link created for ${data.link.from}`)
             // console.log('Generate data', data)
        } catch (e) {
            message(e.message)
            console.log(e)
        }
    }

    const enterPressHandler = async event => {
        if (event.key === 'Enter') {
             await generateLink()
        }
    }
    if (loading) {
        return <Loader />
    }
    if (!isAuthenticated) {
        return history.push('/')
    }
    return (
        <div className={'create-page'}>
            <div className="row">
                <div className="col s8 offset-s2">
                    <div className="input-field">
                        <input type="text" id={'link'} value={link} onChange={linkHandler} onKeyPress={enterPressHandler}/>
                        <label htmlFor="{'email'}">Enter link</label>
                    </div>
                    <div className="buttons">
                        <button className="btn teal lighten-2" onClick={generateLink}>Generate Link</button>

                    </div>
                </div>
            </div>

        </div>
    )
}
