import React, {useEffect, useState} from 'react'
import './edit-link-form.css'
import {useDispatch, useSelector} from "react-redux";
import {editLink, selectLinkById} from "../../store/link-slice";
import {useMessage} from "../../hooks";
import M from 'materialize-css'

const noop = () => {
}
export const EditLinkForm = (props) => {
    const {id, modalMode = false, closeModal = noop, focusedInput = null} = props
    const dispatch = useDispatch()
    const message = useMessage()
    const link = useSelector(state => selectLinkById(state, id))
    const [form, setForm] = useState({
        from: link.from,
        title: link.title || ''
    })

    const formHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    const editLinkHandler = async () => {
        try {
            const editedLink = await dispatch(editLink({linkId: id, from: form.from, title: form.title})).unwrap()
            message(editedLink.message, 'success')
            if (modalMode) {
                closeModal()
            }
        } catch (e) {
            message(e.message, 'error')
        }

    }
    const enterPressHandler = async event => {
        if (event.key === 'Enter') {
            await editLinkHandler()
        }
    }
    useEffect(() => {
        M.updateTextFields()
    }, [])
    return (
        <div className={'edit-link-form'}>
            <div className="input-field">
                <i className="material-icons prefix">link</i>
                <input
                    ref={focusedInput ? focusedInput : null}
                    type="text"
                    id={'from'}
                    name={'from'}
                    value={form.from}
                    onChange={formHandler}
                    placeholder={'Enter long url'}
                    onKeyPress={enterPressHandler}
                />
                <label htmlFor="{'link'}">Url</label>
            </div>
            <div className="input-field">
                <i className="material-icons prefix">title</i>
                <input type="text"
                       id={'title'}
                       name={'title'}
                       value={form.title}
                       onChange={formHandler}
                       placeholder={'Enter custom title'}
                       onKeyPress={enterPressHandler}
                />
                <label htmlFor="{'title'}">Title</label>
            </div>
            <div className="buttons">
                <button className="btn teal lighten-2" onClick={editLinkHandler}>Save changes</button>
            </div>

        </div>
    )
}
