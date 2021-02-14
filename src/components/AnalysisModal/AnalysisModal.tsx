import React, {useCallback, useEffect, useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy, faPrint, faTimes} from '@fortawesome/free-solid-svg-icons';
import Analysis, {Result} from '../Analysis';
import CopyToClipboard from 'react-copy-to-clipboard';
import PDFDocument from '../../containers/PDFDocument/PDFDocument';
import {PDFDownloadLink} from '@react-pdf/renderer';
import {FormData} from '../../data/formData';
import RiskFactorDisplay from '../RiskFactorDisplay';
import './AnalysisModal.css';
import {CoreData} from '../../data/coreData';
import {FavorableRiskFactors, HighRiskFactor, IntRiskFactor, VeryLowRiskFactor, VHighRiskFactor} from "../../containers/AppForm/AppForm";

type Props = {
    visible: boolean;
    result: Result;
    cores: CoreData[];
    form: FormData;
    onDismiss: () => void;
    intRiskFactors: IntRiskFactor;
    favorableRiskFactors: FavorableRiskFactors;
    unfavorableRiskFactors: FavorableRiskFactors;
    vHighRiskFactors: VHighRiskFactor;
    highRiskFactors: HighRiskFactor;
    lowRiskFactors: IntRiskFactor;
    veryLowRiskFactors: VeryLowRiskFactor;
}

export default function ShareLinkModal({
                                           visible,
                                           onDismiss,
                                           result,
                                           cores,
                                           form,
                                           intRiskFactors,
                                           vHighRiskFactors,
                                           highRiskFactors,
                                           favorableRiskFactors,
                                           unfavorableRiskFactors,
                                           lowRiskFactors,
                                           veryLowRiskFactors
                                       }: Props) {
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

        }, [cores, form])

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
            <div className={cssBackDropClasses.join(' ')} onClick={onDismiss}></div>
            ;
            <div className={cssClasses.join(' ')}>
                <div className="AlignRight">
                    <button className="NewBackButton" onClick={onDismiss}>
                        <FontAwesomeIcon icon={faTimes}/>
                    </button>
                </div>

                <div className="AnalysisWrapper">
                    <RiskFactorDisplay
                        riskAssessment={result.risk}
                        unfavorableRiskFactors={unfavorableRiskFactors}
                        favorableRiskFactors={favorableRiskFactors}
                        intRiskFactors={intRiskFactors}
                        highRiskFactors={highRiskFactors}
                        vHighRiskFactors={vHighRiskFactors}
                        lowRiskFactors={lowRiskFactors}
                        veryLowRiskFactors={veryLowRiskFactors}
                        capra={result.capra}
                    />
                    <div className="LinkContainer">
                        <Analysis result={result}/>
                    </div>
                    <div style={{cursor: "pointer"}} className="LinkContainer">
                        <CopyToClipboard
                            text={link}
                            onCopy={() => setShowCopied(true)}>
                            <div className="InnerCopyFlex">
                                <FontAwesomeIcon style={{marginLeft: ".25rem", marginRight: "1rem"}} icon={faCopy}/>
                                {showCopied ?
                                    <span className="FadeCopied">
                                        Copied
                                    </span>
                                    :
                                    <span>Click here to copy a sharable link of your data</span>
                                }
                            </div>
                        </CopyToClipboard>
                    </div>
                    <div className="LinkContainer">
                        <PDFDownloadLink document={<PDFDocument
                                                        riskAssessment={result.risk}
                                                        unfavorableRiskFactors={unfavorableRiskFactors}
                                                        favorableRiskFactors={favorableRiskFactors}
                                                        intRiskFactors={intRiskFactors}
                                                        highRiskFactors={highRiskFactors}
                                                        vHighRiskFactors={vHighRiskFactors}
                                                        lowRiskFactors={lowRiskFactors}
                                                        veryLowRiskFactors={veryLowRiskFactors}
                                                        coreData={cores}
                                                        resultData={result}
                                                        formData={form}/>}
                                         fileName="nccn-risk-result.pdf">
                            {({blob, url, loading, error}) => (
                                <div className="InnerCopyFlex">
                                    <div className="DownloadPdfIcon">
                                        <FontAwesomeIcon icon={faPrint}/>
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
