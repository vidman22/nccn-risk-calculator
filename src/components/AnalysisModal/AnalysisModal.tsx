import React, { useCallback, useEffect, useState } from 'react';
import { XIcon, DocumentDuplicateIcon } from '@heroicons/react/solid';
import Analysis, { Result } from '../Analysis';
import CopyToClipboard from 'react-copy-to-clipboard';
import { FormData } from '../../data/formData';
import RiskFactorDisplay from '../RiskFactorDisplay';
import LinkWrapper from '../MemoizedPDF/MemoizedPDF';
import './AnalysisModal.css';
import { CoreData } from '../../data/coreData';

import { FavorableRiskFactors, HighRiskFactor, IntRiskFactor, VeryLowRiskFactor, VHighRiskFactor } from "../../containers/LandingPage";

export type Props = {
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
        'AnalysisModal fixed bg-white p-4 text-center rounded-lg overflow-scroll box-border',
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
            pattern = pattern + "&age=" + (form.age.value || form.age.initialValue) + "&stage=" + (form.clinicalStage.value || form.clinicalStage.initialValue) + "&psa=" + (form.psa.value || form.psa.initialValue) + "&size=" + (form.prostateSize.value || form.prostateSize.initialValue) + "&cores=" + (form.totalCores.value || form.totalCores.initialValue);
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
            <div className={cssClasses.join(' ')}>
                <div className='flex relative'>
                    <button className='absolute' style={{ top: '.5rem', right: '.5rem' }} onClick={onDismiss}>
                        <XIcon className='h-5 w-5 text-gray-800 hover:text-green-500 duration-75 transition-all' />
                    </button>
                </div>
                <div className='block m-auto mt-6 sm:mt-0 w-full sm:w-11/12'>
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
                    <div className='w-full my-2 rounded'>
                        <Analysis result={result} />
                    </div>
                    <CopyToClipboard
                        text={link}
                        onCopy={() => setShowCopied(true)}>
                        <div className='cursor-pointer flex justify-center text-gray-700 items-center border border-gray-600 rounded-lg py-2 hover:bg-gray-600 hover:text-gray-50 transition-all duration-75'>
                            <div className='flex justify-center items-center'>
                                <DocumentDuplicateIcon className='h-5 w-5 mr-2'/>
                                {showCopied ?
                                    <span className='text-white bg-gray-600 rounded FadeCopied'>
                                        Copied
                                    </span>
                                    :
                                    <span>Click for a link of your data</span>
                                }
                            </div>
                        </div>
                    </CopyToClipboard>
                    <div className='w-full mt-2 rounded'>
                        <LinkWrapper
                            result={result}
                            cores={cores}
                            form={form}
                            intRiskFactors={intRiskFactors}
                            vHighRiskFactors={vHighRiskFactors}
                            highRiskFactors={highRiskFactors}
                            favorableRiskFactors={favorableRiskFactors}
                            unfavorableRiskFactors={unfavorableRiskFactors}
                            lowRiskFactors={lowRiskFactors}
                            veryLowRiskFactors={veryLowRiskFactors}
                        />
                    </div>
                </div>
            </div>
        </>
    );
}
