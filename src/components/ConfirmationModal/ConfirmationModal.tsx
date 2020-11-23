import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import './ConfirmationModal.css';

type Props = {
    visible: boolean;
    confirmAction: () => void;
    onDismiss: () => void;
}

export default function ConfirmationModal({ visible, confirmAction, onDismiss }: Props) {
    const cssClasses = [
        "Modal",
        visible ? "ModalOpen" : "ModalClosed"
    ];
    const cssBackDropClasses = ['Backdrop', visible ? 'BackdropOpen' : 'BackdropClosed'];
    return (
        <>
            <div className={cssBackDropClasses.join(' ')} onClick={onDismiss}></div>;
            <div className={cssClasses.join(' ')}>
                <div className="AlignRight">
                    <button className="NewBackButton" onClick={onDismiss}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <h2>Are you sure you want to clear your core data?</h2>
                <span>This action is irreversible</span>
                <div className="ModalButtonWrappers">
                    <button className="ClearButton" onClick={onDismiss}>Cancel</button>
                    <button className="SubmitButton" onClick={confirmAction}>Okay</button>
                </div>
            </div>
        </>
    );
}
