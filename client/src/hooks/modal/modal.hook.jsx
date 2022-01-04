import React from 'react'
import './modal.hook.css'
import withModal from "../../hocs/modal.hoc";
import GenerateLinkForm from "../../components/create-page/generate-link-form";
import EditLinkForm from "../../components/edit-link-form";
import AssignLinksCard from "../../components/group-details/assign-links-card";
import EditGroupForm from "../../components/edit-group-form";
import withConfirm from "../../hocs/confirm.hoc";

export const useModal = (type = 'add', options = {}) => {
    let modalButton
    let wrappedComponent
    let modalHeader
    let modalButtonClass
    let tooltipText
    let modalContainerClass
    // let focusedInput = React.createRef()
    const modalMode = true
    const modalButtonConstructor = (icon, text) => {
        return(
            <span>
                <i className={'material-icons'}>
                    {icon}
                </i>
                {options.hideButtonText ? null : <span className={'modal-button-text'}>{text}</span>}
            </span>
        )
    }
    switch (type) {
        case 'add':
            modalButton = modalButtonConstructor('add', 'Add link')
            wrappedComponent = GenerateLinkForm
            modalHeader = options.id ? 'Create and assign link' : 'Create Link'
            modalButtonClass = options.showOnLarge ? 'add-link green  show-on-large hide-on-med-and-down' : 'add-link green'
            tooltipText = options.id ? 'Add new link and assign it to this group' :'Add Link'
            modalContainerClass = 'add-link-c'
            // focusedInput = options.focused ? React.createRef() : null
            break
        case 'edit-link':
            modalButton = modalButtonConstructor('edit', 'Edit link')
            wrappedComponent = EditLinkForm
            modalHeader = 'Edit Link'
            modalButtonClass = 'edit-link orange lighten-2'
            tooltipText = 'Edit Link'
            modalContainerClass = 'edit-link-c'
            // focusedInput = options.focused ? focusedInput : null
            break
        case 'assign-links':
            modalButton = modalButtonConstructor('playlist_add', 'Assign links')
            wrappedComponent =  AssignLinksCard
            modalHeader = 'Links to assign'
            modalButtonClass= 'assign-link'
            tooltipText = 'Assign links to this group'
            modalContainerClass = 'assign-link-c'
            break
        case 'edit-group':
            modalButton = modalButtonConstructor('edit', 'Edit group')
            wrappedComponent =  EditGroupForm
            modalHeader = 'Edit group'
            modalButtonClass= 'edit-group orange lighten-2'
            tooltipText = 'Edit this group'
            modalContainerClass = 'edit-group-c'
            break
        case 'confirm-delete':
            modalButton = modalButtonConstructor('delete', 'Delete')
            wrappedComponent = withConfirm
            modalHeader = options.tooltipName ? `Delete the ${options.name} ${options.tooltipName}, really?` : 'Delete this item, really?'
            modalButtonClass= 'confirm-delete red lighten-1'
            tooltipText = options.tooltipName ? `Remove ${options.tooltipName}` : 'Remove item'
            modalContainerClass = 'confirm-delete-c'
            break
        default:
            modalButton = modalButtonConstructor('add', 'Add link')
            wrappedComponent = GenerateLinkForm
            modalHeader = options.id ? 'Create and assign link' : 'Create Link'
            modalButtonClass = options.showOnLarge ? 'add-link green  show-on-large hide-on-med-and-down' : 'add-link green'
            tooltipText = options.id ? 'Add new link and assign it to this group' :'Add Link'
            modalContainerClass = 'add-link-c'
            // focusedInput = options.focused ? focusedInput : null
            break

    }
    const props = {modalMode, modalButton, modalHeader, modalButtonClass, modalContainerClass, tooltipText, ...options}

    return withModal(wrappedComponent, {...props})
}
