import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import './ShareLinkModal.css';

type Props = {
    visible: boolean;
    link: string;
    onDismiss: () => void;
}

export default function ShareLinkModal({ visible, onDismiss, link }: Props) {
    const [showCopied, setShowCopied] = useState(false);
    const cssClasses = [
        "Modal",
        visible ? "ModalOpen" : "ModalClosed"
    ];
    const cssBackDropClasses = ['Backdrop', visible ? 'BackdropOpen' : 'BackdropClosed'];
    console.log("showCopied", showCopied);
    return (
        <>
            <div className={cssBackDropClasses.join(' ')} onClick={onDismiss}></div>;
            <div className={cssClasses.join(' ')}>
                <button className="NewBackButton" onClick={onDismiss}>
                    <FontAwesomeIcon icon={faTimes} />
                </button>

                {showCopied &&
                    <div className="FadeCopied">
                        Copied
                    </div>
                }
                <div className="ClickToCopyWrapper">

                    <CopyToClipboard
                        text={link}
                        onCopy={() => setShowCopied(true)}>
                        <div>
                            Click here to copy <FontAwesomeIcon icon={faCopy} />
                        </div>
                    </CopyToClipboard>
                </div>
                <div className="LinkContainer">
                    <span>{link}</span>
                </div>
            </div>
        </>
    );
}
