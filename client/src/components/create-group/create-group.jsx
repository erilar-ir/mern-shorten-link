import React, {useEffect, useState} from 'react';
import {useMessage} from "../../hooks";
import {createGroup} from '../../store/group-slice'
import {useDispatch} from "react-redux";
import M from 'materialize-css'

export const CreateGroup = () => {
    const dispatch = useDispatch()
    const [form, setForm] = useState({
        name: '',
        description: ''
    })
    const message = useMessage()
    const enterPressHandler = async event => {
        if (event.key === 'Enter') {
            await addGroup()
        }
    }
    const addGroup = async () => {
        try {
            const {name, description} = form
            const data = await dispatch(createGroup({name, description})).unwrap()
            message(data.message, 'success')
            setForm({
                name: '',
                description: ''
            })
            window.M.updateTextFields();
        } catch (e) {
            message(e.message, 'warn')
            console.log(e)
        }
    }

    const formHandler = (event) => {
        setForm({...form, [event.target.name]: event.target.value})
    }

    useEffect(()=>{
        M.updateTextFields()
    },[])
    return (
        <>
            <h3>Create new Group</h3>
            <div className="input-field">
                <i className="material-icons prefix">title</i>
                <input type="text"
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
                <button className="btn teal lighten-2" onClick={addGroup}>Add Group</button>
            </div>
        </>

    )
}
