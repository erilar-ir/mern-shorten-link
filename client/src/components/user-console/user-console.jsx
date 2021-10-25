import React, {useCallback, useContext, useEffect, useState} from 'react';
import './user-console.css'
import {AuthContext} from "../../context";
import {useHttp, useMessage} from "../../hooks";
import {GroupService} from "../../services";
import Loader from "../loader";
import CreateGroup from "../create-group";
import GroupList from "../group-list";

const UserConsole = () => {
    const {loading} = useHttp()
    const {logout} = useContext(AuthContext)
    const [groups, setGroups] = useState(null)

    const message = useMessage()
    const {getGroups} = GroupService()


    const getUserGroups = useCallback(async () => {
        try {
            const fetched = await getGroups()
            setGroups(fetched)
            // setGroupCount(fetched.length)
        } catch (e) {
            console.log(e)
            message(e.message, 'warn')
            if (e.status === 401) {
                await logout()
            }
        }
    }, [getGroups])

    useEffect(async () => {
        await getUserGroups()
    }, [])





    if (loading) {
        return <Loader/>
    }

    const groupsView = groups ? <GroupList groups={groups} getUserGroups={getUserGroups} />: <Loader/>

    return (
        <div className={'user-console'}>
            <div className="row">
                <div className="col s6">
                    {groupsView}
                </div>
                <div className="col s6">
                    <CreateGroup getUserGroups={getUserGroups}/>
                </div>
            </div>

        </div>
    );
};

export default UserConsole;
