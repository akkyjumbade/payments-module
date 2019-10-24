import Swal from 'sweetalert2'
const popupCustomClass = {
    header: 'text-left',
    title: 'text-left',
    content: 'text-left text',
    footer: 'text-left text',
    input: 'form-control',
    confirmButton: 'btn btn-primary',
    cancelButton: 'btn btn-primary',
    actions: 'modal_actions',
    closeButton: 'btn btn-danger',
}
export const Modal = Swal.mixin({
    animation: false,
    buttonsStyling: false,
    padding: '2.5rem',
    showConfirmButton: false,
    customClass: popupCustomClass
})

