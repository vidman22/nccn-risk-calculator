import React, { memo } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPrint } from '@fortawesome/free-solid-svg-icons';
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
            {({ blob, url, loading, error }) => (
                <div className="InnerCopyFlex">
                    {error ? <div>{error.message}</div> :
                        <div className="DownloadPdfIcon">
                            <FontAwesomeIcon icon={faPrint} />
                        </div>
                    }
                    <span>Download PDF</span>
                </div>
            )}
        </PDFDownloadLink>
    )
}

export default memo<Omit<Props, "visible" | "onDismiss">>(LinkWrapper, isEqual);