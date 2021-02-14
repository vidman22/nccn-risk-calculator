import {
    HIGH_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    INTERMEDIATE_RISK,
    LOW_RISK,
    VERY_HIGH_RISK,
    VERY_LOW_RISK
} from './data/riskConstants';
import { T1, T1c, T2a, T2b, T2c, T3a, T3b, T4 } from './data/riskConstants';

import { ClinicalStage } from './data/formData';

export type HighRiskParams = {
    clinicalStage: string;
    psa: number;
    maxGradeGroup: number;
}

type CalculateRiskParams = {
    maxPrimary: number;
    maxGradeGroup: number;
    ggFourAndFiveCount: number;
    psaDensity: number;
    maxInvolvedPercentage: number;
    psa: number;
    clinicalStage: ClinicalStage;
    totalCoresPositive: number;
}

type CalculateIntRiskParams = {
    maxGradeGroup: number;
    percentageCoresPositive: number;
    psa: number;
    numIntRiskFactors: number;
    clinicalStage: ClinicalStage;
}

type CalculateCapraParams = {
    maxPrimary: number;
    maxSecondary: number;
    percentageCoresPositive: number;
    age: number;
    psa: number;
    clinicalStage: ClinicalStage;
}


export const calculateNumHighRisk = ({ psa, clinicalStage, maxGradeGroup }: HighRiskParams) => {
    let int = 0;
    if (psa > 20) {
        int++;
    }
    if (clinicalStage === T3a) {
        int++;
    }
    if (maxGradeGroup > 3) {
        int++;
    }
    return int;
};

export const calculateNumIntRiskFactors = ({ maxGradeGroup, clinicalStage, psa }: HighRiskParams) => {
    let numRF = 0;

    if (maxGradeGroup === 3 || maxGradeGroup === 2) {
        numRF++
    }
    if (clinicalStage === T2b || clinicalStage === T2c) {
        numRF++
    }
    if (psa >= 10 && psa < 20) {
        numRF++
    }
    return numRF;
}

export const calculateRisk = ({ maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage, psa, clinicalStage, totalCoresPositive }: CalculateRiskParams) => {
    //'T1c', 'T1', 'T2a', 'T2b', 'T2c', 'T3a', 'T3b', 'T4';
    console.log("maxPrimary,", maxPrimary);
    console.log("maxGradeGroup", maxGradeGroup );
    console.log("ggFourAndFiveCount", ggFourAndFiveCount );
    console.log("psaDensity", psaDensity );
    console.log("maxInvolvedPercentage",maxInvolvedPercentage );
    console.log(" psa", psa );
    console.log("clinicalStage", clinicalStage,);
    console.log("totalCoresPositive", totalCoresPositive);
    let risk = '';
    // This means at least two of the three high risk factors that should bump it to very high risk
    // If T3b goto Very High Risk ; ClinicalStage
    // If T4, goto Very High Risk ; ClinicalStage
    // If MaxPrimary = 5, goto Very High Risk ; MaxPrimary
    // If NumGG4or5 &gt;=4 cores with Group 4 or Group 5 goto Very High Risk ;
    // NumGG4or5
    if (maxPrimary === 5 || ggFourAndFiveCount >= 4 || clinicalStage === T3b || clinicalStage === T4) {
        risk = VERY_HIGH_RISK;
    }
    // intMaxGradeGroup is 4 or 5 i.e. greater than 3
    if (psa > 20 || clinicalStage === T3a || maxGradeGroup > 3) {
        if (!risk) {
            risk = HIGH_RISK;
        }
    }
    //this means if they have a clinical stage above T1 and T2a
    if ((psa >= 10 && psa < 20) || maxGradeGroup > 1 || clinicalStage === T2b || clinicalStage === T2c) {
        if (!risk) {
            risk = INTERMEDIATE_RISK;
        }
    }
    // Must have all of the following for very low risk, if doesn't pass then you can calculate low risk
    if (clinicalStage === T1c && maxGradeGroup === 1 && psa < 10 && psaDensity < 0.15 && (totalCoresPositive <= 3 && maxInvolvedPercentage <= 50)  ){
        if (!risk) {
            risk = VERY_LOW_RISK
        }
    }
    if ( maxGradeGroup === 1 && psa < 10 && (clinicalStage === T1 || clinicalStage === T2a)) {
        if (!risk) {
            risk = LOW_RISK;
        }
    }
    return risk;
}

export const calculateIntermediateRisk = ({ maxGradeGroup, percentageCoresPositive, psa, numIntRiskFactors, clinicalStage }: CalculateIntRiskParams) => {
    // At this stage we've already determined that the patient has at least one of the intermediate risk factors
    // We can check for the high risk factors exceeding 2-3 IRFs but don't need to check the number int risk factors
    // for favorable intermediate risk
    if (clinicalStage === T2b || clinicalStage === T2c || maxGradeGroup === 3 || psa >= 10 || percentageCoresPositive > 50 || numIntRiskFactors >= 2) {
        return INTERMEDIATE_HIGH_RISK;
    }

    if (maxGradeGroup >= 2 && percentageCoresPositive < 50) {
        return INTERMEDIATE_LOW_RISK;
    }
    return 'x';
};

export const calculateCapra = ({ maxPrimary, maxSecondary, percentageCoresPositive, age, psa, clinicalStage }: CalculateCapraParams) => {

    let capra = 0;

    if (age > 49) {
        capra++;
    }
    // If the psa is less than six do nothing, if it is greater than six but less than 10 add one
    if (psa > 6 && psa < 10) {
        capra++;
    }
    // If the psa is between 10 and 20 add two
    if (psa > 10 && psa < 20) {
        capra += 2
    }
    if (psa > 20 && psa < 30) {
        capra += 3
    }
    if (psa > 30 && psa < 40) {
        capra += 4
    }
    if (maxPrimary > 3) {
        capra += 3
    } else if (maxSecondary > 3) {
        capra++
    }
    if (clinicalStage === T3a) {
        capra++
    }
    if (percentageCoresPositive >= 34) {
        capra++
    }
    return capra.toString()
};