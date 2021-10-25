import React, {useState} from 'react';
import {useMessage} from "../../hooks";
import {GroupService} from "../../services";


export const CreateGroup = (props) => {
    const {createGroup} = GroupService()
    const {getUserGroups} = props
    const [groupName, setGroupName] = useState('')
    const message = useMessage()
    const enterPressHandler = async event => {
        if (event.key === 'Enter') {
            await addGroup()
        }
    }
    const addGroup = async () => {
        try {
            const data = await createGroup(groupName)
            message(data.message, 'success')
            setGroupName('')
            window.M.updateTextFields();
            await getUserGroups()

            // console.log('Generate data', data)
        } catch (e) {
            message(e.message, 'warn')
            console.log(e)
        }
    }

    const inputHandler = event => {
        setGroupName(event.target.value)
    }

    return (
        <>
            <h2>Create new Group</h2>
            <div className="input-field">
                <input type="text" id={'groupName'} value={groupName} onChange={inputHandler}
                       onKeyPress={enterPressHandler}/>
                <label htmlFor="{'groupName'}">Enter link</label>
            </div>
            <div className="buttons">
                <button className="btn teal lighten-2" onClick={addGroup}>Add Group</button>
            </div>
        </>

    )
}
