import React, { memo } from 'react';
import { PrinterIcon } from '@heroicons/react/solid'
import PDFDocument from '../../containers/PDFDocument/PDFDocument';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { Props } from '../AnalysisModal/AnalysisModal';
import isEqual from 'react-fast-compare';

const LinkWrapper = ({
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
}: Omit<Props, "visible" | "onDismiss">) => {

    return (
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
            formData={form} />}
            fileName="prostate-risk-result.pdf">
            {({ error }) => (
                <div className='cursor-pointer flex justify-center text-gray-700 items-center border border-gray-600 rounded-lg py-2 hover:bg-gray-600 hover:text-gray-50 transition-all duration-75'>
                    {error ? <div>{error.message}</div> :
                            <PrinterIcon className='h-5 w-5 mr-2'/>
                    }
                    <span>Download PDF</span>
                </div>
            )}
        </PDFDownloadLink>
    )
}

export default memo<Omit<Props, "visible" | "onDismiss">>(LinkWrapper, isEqual);