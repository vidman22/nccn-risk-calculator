import React from 'react';
import './Analysis.css';

import {
    HIGH_RISK,
    VERY_HIGH_RISK,
    LOW_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    VERY_LOW_RISK,
    INTERMEDIATE_RISK,
    Risks,
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
    risk: Risks,
    capra: string,
}

type Props = {
    result: Result;
}
export const getRisk = (risk : Risks) => {
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
        case INTERMEDIATE_RISK:
            return 'Intermediate Risk';
        default:
            return 'NA';
    }
}
const Analysis: React.FC<Props> = ({ result }: Props) => {

    return (
            <div className='border border-gray-800 rounded-lg p-2 flex flex-col h-full sm:h-32 flex-wrap text-left'>
                <p>
                    <span className='font-medium'>Percentage of Cores Positive: </span>{result.corePercentagePositive}%
                </p>
                <p>
                    <span className='font-medium'>Highest Involved Percentage: </span>{result.maxInvolvedPercentage}%
                </p>
                <p>
                    <span className='font-medium'>PSA Density: </span>{result.psaDensity}
                </p>
                <p>
                    <span className='font-medium'>Max Primary: </span>{result.maxPrimary}
                </p>
                <p>
                    <span className='font-medium'>Max Secondary: </span>{result.maxSecondary}
                </p>
                <p>
                    <span className='font-medium'>Max Gleason Sum: </span>{result.maxGleasonSum}
                </p>
                <p>
                    <span className='font-medium'>Number of Cores with 4/5 Grade Group: </span>{result.ggFourAndFiveCount}
                </p>
                <p>
                    <span className='font-medium'>Max Grade Group: </span>{result.maxGradeGroup}
                </p>
            </div>
    );
}
export default Analysis;
