import React, {useEffect} from 'react';
import './groups-management.css'
import Loader from "../loader";
import CreateGroup from "../create-group";
import GroupList from "./group-list";
import {errorSelector, getGroups, selectGroupSliceStatus} from '../../store/group-slice'
import {useDispatch, useSelector} from "react-redux";
import {useMessage} from "../../hooks";
import ErrorBoundary from "../error-boundary";


const GroupsManagement = () => {
    const dispatch = useDispatch()
    const groupsStatus = useSelector(selectGroupSliceStatus)
    const groupsError = useSelector(errorSelector)
    const message = useMessage()

    useEffect(() => {
        if (groupsStatus === 'idle') {
            dispatch(getGroups())
        }
    }, [])


    let groupsContent

    switch (groupsStatus) {
        case 'loading' :
            groupsContent = <Loader/>
            break
        case 'succeeded':
            groupsContent = <GroupList />
            break
        case 'failed':
            message(groupsError.message)
            groupsContent = <p>Something went wrong</p>
            break
        default:
            groupsContent = <Loader/>
            break
    }


    return (
        <div className={'groups-manage'}>
            <div className="row">
                <div className="col s12 m6">
                    {groupsContent}
                </div>
                <div className="col s12 m6">
                    <ErrorBoundary >
                        <CreateGroup />
                    </ErrorBoundary>
                </div>
            </div>
        </div>
    );
};

export default GroupsManagement;
