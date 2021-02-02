import React, { useState, useEffect, useCallback } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Result } from '../Analysis';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
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
        "AnalysisModal",
        visible ? "ModalOpen" : "ModalClosed"
    ];
    const cssBackDropClasses = ['Backdrop', visible ? 'BackdropOpen' : 'BackdropClosed'];

    const generateUrl = useCallback(
        () => {
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
            pattern = pattern + "&ptage=" + (form.age.value || form.age.initialValue) + "&stage=" + (form.clinicalStage.value || form.clinicalStage.initialValue) + "&psa=" + (form.psa.value || form.psa.initialValue) + "&size=" + (form.prostateSize.value || form.prostateSize.initialValue);

            return window.location.origin + '/?' + pattern;

        }, [cores])

    useEffect(() => {
        setLink(generateUrl());
    }, [generateUrl])

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

                <div className="AnalysisWrapper">
                    <h2>Analysis</h2>

                    <div className="LinkContainer">

                        <Analisys result={result} />

                    </div>
                    <div style={{cursor: "pointer"}} className="LinkContainer">

                        <CopyToClipboard
                            text={link}
                            onCopy={() => setShowCopied(true)}>
                            <div className="InnerCopyFlex">
                                <FontAwesomeIcon style={{ marginLeft: ".25rem", marginRight: "1rem" }} icon={faCopy} />
                                <span>Click here to copy a sharable link of your data</span>
                            </div>
                        </CopyToClipboard>


                    </div>
                    <div className="LinkContainer">
                        <PDFDownloadLink document={<PDFDocument coreData={cores} resultData={result} formData={form} />} fileName="nccn-risk-result.pdf">
                            {({ blob, url, loading, error }) => (
                                <div className="InnerCopyFlex">
                                    <div className="DownloadPdfIcon">
                                        <FontAwesomeIcon icon={faPrint} />
                                    </div>
                                    <span>Download PDF</span>
                                </div>
                            )}
                        </PDFDownloadLink>
                    </div>
                </div>
            </div>
        </>
    );
}
