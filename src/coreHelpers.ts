import { CoreData } from './data/coreData';

export const getTotalCoresPositive = (cores : CoreData[]) => {
        let count = 0;
        cores.forEach(cr => {
            if (parseInt(cr.gleasonPrimary.value) > 2 || parseInt(cr.gleasonPrimary.value) > 2) {
                count++;
            }
        })
        return count;
}

export const getCountGGFourOrFive = (cores : CoreData[]) =>{
        let count = 0;
        cores.forEach(cr => {
            if (parseInt(cr.gradeGroup.value) > 3) {
                count++;
            }
        })
        return count.toString();
    };

export const getMaxGradeGroup = (cores : CoreData[]) => {
        let maxGG = "0";
        cores.forEach(cr => {
            if (parseInt(cr.gradeGroup.value) > parseInt(maxGG)) {
                maxGG = cr.gradeGroup.value
            }
        })
        return maxGG;
    };

export const getMaxGleasonSum = (cores : CoreData[]) => {
        let maxGS = "0";
        cores.forEach(cr => {
            if (parseInt(cr.gleasonSum.value) > parseInt(maxGS)) {
                maxGS = cr.gleasonSum.value
            }
        })
        return maxGS;
    };


export const getMaxPrimary = (cores : CoreData[]) => {
        let maxPrimary = "0";
        cores.forEach(cr => {
            if (parseInt(cr.gleasonPrimary.value) > parseInt(maxPrimary)) {
                maxPrimary = cr.gleasonPrimary.value
            }
        })
        return maxPrimary;
    };

export const getMaxSecondary = (cores : CoreData[]) =>{
        let maxSecondary = "0";
        cores.forEach(cr => {
            if (parseInt(cr.gleasonSecondary.value) > parseInt(maxSecondary)) {
                maxSecondary = cr.gleasonSecondary.value
            }
        })
        return maxSecondary;
    };

export const getMaxInvolvedPercentage = (cores : CoreData[]) => {
        let maxInvolvedPercentage = "0";
        cores.forEach(cr => {
            if (parseInt(cr.percentageInvolved.value) > parseInt(maxInvolvedPercentage)) {
                maxInvolvedPercentage = cr.percentageInvolved.value
            }
        })
        return maxInvolvedPercentage || 'NA';
};