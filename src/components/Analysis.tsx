import React from 'react';
import './Analysis.css';

import {
    HIGH_RISK,
    VERY_HIGH_RISK,
    LOW_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    VERY_LOW_RISK
} from '../data/riskConstants';

export interface Result {
    corePercentagePositive: string,
    psaDensity: string,
    maxInvolvedPercentage: string,
    maxGradeGroup: string,
    maxGleasonSum: string,
    maxPrimary: string,
    maxSecondary: string,
    ggFourAndFiveCount: string,
    risk: string,
}

type Props = {
    result: Result;
}
export const risk = (risk : string) => {
    switch (risk) {
        case HIGH_RISK:
            return 'High Risk';
        case VERY_HIGH_RISK:
            return 'Very High Risk';
        case LOW_RISK:
            return 'Low Risk';
        case VERY_LOW_RISK:
            return 'Very Low Risk';
        case INTERMEDIATE_LOW_RISK:
            return 'Favorable Intermediate Risk';
        case INTERMEDIATE_HIGH_RISK:
            return 'Unfavorable Intermediate Risk';
        default:
            return 'NA';
    }
}
const Analisys: React.FC<Props> = ({ result }: Props) => {

    return (
        <div className="AnalysisContainer">
            <h3>Analysis</h3>
            <div className="ResultContainer">
                <p>
                    <span>Percentage of Cores Positive: </span>{result.corePercentagePositive}%
                </p>
                <p>
                    <span>Highest Involved Percentage: </span>{result.maxInvolvedPercentage}%
                </p>
                <p>
                    <span>PSA Density: </span>{result.psaDensity}
                </p>
                <p>
                    <span>Max Primary: </span>{result.maxPrimary}
                </p>
                <p>
                    <span>Max Secondary: </span>{result.maxSecondary}
                </p>
                <p>
                    <span>Max Gleason Sum: </span>{result.maxGleasonSum}
                </p>
                <p>
                    <span>Number of Cores with 4/5 Grade Group: </span>{result.ggFourAndFiveCount}
                </p>
                <p>
                    <span>Max Grade Group: </span>{result.maxGradeGroup}
                </p>
                <p>
                    <span>Risk: </span>{risk(result.risk)}
                </p>
            </div>
        </div>
    );
}
export default Analisys;
