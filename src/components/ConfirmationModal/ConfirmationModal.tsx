import React from 'react';
import { XIcon } from '@heroicons/react/solid';
import './ConfirmationModal.css';

type Props = {
    visible: boolean;
    confirmAction: () => void;
    onDismiss: () => void;
}

export default function ConfirmationModal({ visible, confirmAction, onDismiss }: Props) {
    const cssClasses = [
        "Modal fixed bg-white p-2 text-center rounded-lg border-box w-4/5",
        visible ? "ModalOpen" : "ModalClosed"
    ];
    const cssBackDropClasses = ['Backdrop', visible ? 'BackdropOpen' : 'BackdropClosed'];
    return (
        <div className='relative'>
            <div className={cssBackDropClasses.join(' ')} onClick={onDismiss}></div>
            <div className={cssClasses.join(' ')}>
                <button style={{top: '1rem', right: '1rem'}} className='absolute' onClick={onDismiss}>
                    <XIcon className='h-5 w-5 text-gray-900 hover:text-green-500 duration-75 transition-all'/>
                </button>
                <div className='flex flex-col justify-start items-center mt-8 sm:mt-1'>
                    <h2 className='text-lg font-medium'>Are you sure you want to clear your core data?</h2>
                    <p className='text-sm text-gray-900 text-left'>This action is irreversible</p>
                </div>
                <div className='flex justify-end items-center'>
                    <button className='px-2 py-1 border rounded mr-2' onClick={onDismiss}>Cancel</button>
                    <button className='px-2 py-1 rounded mr-2 text-white' style={{ backgroundColor: "#0858B8" }} onClick={confirmAction}>Okay</button>
                </div>
            </div>
        </div>
    );
}
