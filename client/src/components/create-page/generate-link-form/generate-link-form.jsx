import React, {useEffect, useState} from "react";
import {useMessage} from "../../../hooks";
import {useDispatch} from "react-redux";
import {addLink,} from "../../../store/link-slice";
import {useHistory} from "react-router-dom";
import M from 'materialize-css'
import {assignLinkToGroup} from "../../../store/group-slice";

const noop = () => {
}

export const GenerateLinkForm = ({modalMode = false, closeModal = noop, id: groupId = null, focusedInput = null}) => {
    const dispatch = useDispatch()
    const message = useMessage()
    const history = useHistory()
    const [form, setForm] = useState({
        link: '',
        title: ''
    })


    const formHandler = event => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const generateLink = async () => {
        try {
            const {link, title} = form
            const data = await dispatch(addLink({link, title})).unwrap()
            setForm({link: '', title: ''})
            if (groupId) {
                const linkId = data.link._id
                const assigned = await dispatch(assignLinkToGroup({groupId, linkId})).unwrap()
                message(`Short link for ${data.link.from} created and assigned to ${assigned.groupName} group`, 'success')
            } else {
                message(`Short link created for ${data.link.from}`, 'success')
            }
            if (!modalMode) {
                history.push(`/details/${data.link._id}`)
            }
            if (modalMode) {
                closeModal()
            }

        } catch (e) {
            message(e.message, 'warn')
        }
    }

    const enterPressHandler = async event => {
        if (event.key === 'Enter') {
            await generateLink()
        }
    }
    useEffect(() => {
        M.updateTextFields()
    }, [])
    return (
        <div className={'generate-link-form'}>
            <div className="input-field">
                <i className="material-icons prefix">link</i>
                <input
                    ref={focusedInput ? focusedInput : null}
                    type="text"
                    id={'link'}
                    name={'link'}
                    value={form.link}
                    onChange={formHandler}
                    onKeyPress={enterPressHandler}
                    placeholder={'Enter long url like https://www.google.com'}
                />
                <label htmlFor="{'link'}">Url</label>
            </div>
            <div className="input-field">
                <i className="material-icons prefix">title</i>
                <input type="text"
                       name={'title'}
                       id={'title'}
                       value={form.title}
                       onChange={formHandler}
                       onKeyPress={enterPressHandler}
                       placeholder={'Enter custom title'}
                />
                <label htmlFor="{'title'}">Title</label>
            </div>
            <div className="buttons">
                <button className="btn teal lighten-2" onClick={generateLink}>Create Short Link</button>
            </div>

        </div>
    )
}
