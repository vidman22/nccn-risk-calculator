import React, { useState, useEffect } from 'react';
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

    useEffect(() => {
        setTimeout(() => {
            setShowCopied(false);
        }, 2000 )
    }, [showCopied])
    return (
        <>
            <div className={cssBackDropClasses.join(' ')} onClick={onDismiss}></div>;
            <div className={cssClasses.join(' ')}>
                <div className="AlignRight">
                    <button className="NewBackButton" onClick={onDismiss}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                {showCopied &&
                    <div className="FadeCopied">
                        Copied
                    </div>
                }
                <div className="ClickToCopyWrapper">

                </div>
                <div className="LinkContainer">
                    
                        <CopyToClipboard
                            text={link}
                            onCopy={() => setShowCopied(true)}>
                            <div className="InnerCopyFlex">
                                Copy <FontAwesomeIcon style={{marginLeft: ".25rem", marginRight: "1rem"}} icon={faCopy} />
                                <span>{link}</span>
                            </div>
                        </CopyToClipboard>
                    
                </div>
            </div>
        </>
    );
}
