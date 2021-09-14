import React, {useContext, useState} from "react";
import './create-page.css'
import {useHttp} from "../../hooks";
import {AuthContext} from "../../context";
import {useHistory} from "react-router-dom";

export const CreatePage = () => {
    const {token} = useContext(AuthContext)
    const {request} = useHttp()
    const history = useHistory()
    const [link, setLink] = useState('')

    const linkHandler = event => {
      setLink(event.target.value)
    }

    const generateLink = async () => {
        try {
          const data = await request('/api/link/generate', 'POST', {from: link}, {
              Authorization: `Bearer ${token}`
          })
            history.push(`/details/${data.link._id}`)
             console.log(data)
        } catch (e) {

        }
    }

    const enterPressHandler =  event => {
        if (event.key === 'Enter') {
             generateLink()
        }
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
