import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import Analysis, { Result } from '../Analysis';
import { faShareSquare, faPrint } from '@fortawesome/free-solid-svg-icons';
import CopyToClipboard from 'react-copy-to-clipboard';
import PDFDocument from '../../containers/PDFDocument/PDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { FormData } from '../../data/formData';
import Analisys from '../Analysis';
import './AnalysisModal.css';
import { CoreData } from '../../data/coreData';

type Props = {
    visible: boolean;
    result: Result;
    cores: CoreData[];
    form: FormData;
    onDismiss: () => void;
}

export default function ShareLinkModal({ visible, onDismiss, result, cores, form }: Props) {
    const [showCopied, setShowCopied] = useState(false);
    const [link, setLink] = useState('');
    const cssClasses = [
        "Modal",
        visible ? "ModalOpen" : "ModalClosed"
    ];
    const cssBackDropClasses = ['Backdrop', visible ? 'BackdropOpen' : 'BackdropClosed'];

    const generateUrl = () => {
        let pattern = '';
        cores.forEach((core, index) => {
            Object.keys(core).forEach((key, ind) => {
                //remove the final ampersand
                if (Object.keys(core).length === ind + 1 && cores.length === index + 1) {
                    pattern = pattern + `${index}${core[key as keyof CoreData].shortName}=${(core[key as keyof CoreData].value || core[key as keyof CoreData].initialValue)}`;
                } else {
                    pattern = pattern + `${index}${core[key as keyof CoreData].shortName}=${(core[key as keyof CoreData].value || core[key as keyof CoreData].initialValue)}&`;
                }
            })
        })

        return window.location.origin + '/?' + pattern;
    }

    useEffect(() => {
        setTimeout(() => {
            setShowCopied(false);
        }, 3000)
    }, [showCopied]);

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

                {link &&
                    <button
                        className="LabelIconAppFunction"
                        onClick={() => {
                            setLink(generateUrl());
                        }}>
                        <FontAwesomeIcon icon={faShareSquare} />
                        <span>Get link to share your data</span>
                    </button>}

                <PDFDownloadLink document={<PDFDocument coreData={cores} resultData={result} formData={form} />} fileName="nccn-risk-result.pdf">
                    {({ blob, url, loading, error }) => (
                        <button className="LabelIconAppFunction">
                            <FontAwesomeIcon icon={faPrint} />
                            <span>Download PDF</span>
                        </button>
                    )}
                </PDFDownloadLink>
                {/* <div className="ButtonWrapper"> */}
                
                {/* </div> */}

                <div className="LinkContainer">

                    <CopyToClipboard
                        text={link}
                        onCopy={() => setShowCopied(true)}>
                        <div className="InnerCopyFlex">
                            Copy <FontAwesomeIcon style={{ marginLeft: ".25rem", marginRight: "1rem" }} icon={faCopy} />
                            <span>{link}</span>
                        </div>
                    </CopyToClipboard>

                </div>



                <div className="LinkContainer">


                    <Analisys result={result} />

                </div>
            </div>
        </>
    );
}
