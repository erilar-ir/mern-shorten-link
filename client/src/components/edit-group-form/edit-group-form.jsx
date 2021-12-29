import React, {useEffect, useState} from 'react'
import {useDispatch, useSelector} from "react-redux";
import {useMessage} from "../../hooks";
import {editGroup, selectGroupById} from "../../store/group-slice";
import M from "materialize-css";

const noop = () => {
}
export const EditGroupForm = (props) => {
    const {id, modalMode = false, closeModal = noop, focusedInput = null} = props
    const dispatch = useDispatch()
    const message = useMessage()
    const group = useSelector(state => selectGroupById(state, id))
    const [form, setForm] = useState({
        name: group.name,
        description: group.description || ''
    })
    const enterPressHandler = async event => {
        if (event.key === 'Enter') {
            await editGroupHandler()
        }
    }
    const editGroupHandler = async () => {
        try {
            const {name, description} = form
            const editedGroup = await dispatch(editGroup({id, name, description})).unwrap()
            message(editedGroup.message, 'success')
            if (modalMode) {
                closeModal()
            }
        } catch (e) {
            message(e.message, 'warn')
            console.log(e)
        }
    }

    const formHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    useEffect(() => {
        M.updateTextFields()
    }, [])
    return (
        <div className={'edit-group'}>
            <div className="input-field">
                <i className="material-icons prefix">title</i>
                <input
                    ref={focusedInput ? focusedInput : null}
                    type="text"
                    id={'groupName'}
                    name={'name'}
                    value={form.name}
                    onChange={formHandler}
                    onKeyPress={enterPressHandler}
                    placeholder={'Enter group name'}
                />
                <label htmlFor="{'groupName'}">Name</label>
            </div>
            <div className="input-field">
                <i className="material-icons prefix">description</i>
                <textarea
                    className={'materialize-textarea'}
                    id={'groupDescription'}
                    name={'description'}
                    value={form.description}
                    onChange={formHandler}
                    onKeyPress={enterPressHandler}
                    placeholder={'Enter group description'}
                />
                <label htmlFor="{'groupName'}">Description</label>
            </div>
            <div className="buttons">
                <button className="btn teal lighten-2" onClick={editGroupHandler}>Save changes</button>
            </div>
        </div>
    )
}
