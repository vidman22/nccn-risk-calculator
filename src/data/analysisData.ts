type AnalysisDataValue = {
    value: number;
    label: string;
    description: string;
};

export interface AnalysisData {
    totalCores: AnalysisDataValue;
    coresPositive: AnalysisDataValue;
    coresWithGroup45: AnalysisDataValue;
    numCoresGreaterThan50: AnalysisDataValue;
}

export const analysisData = {
    totalCores: {
        value: 0,
        label: "Total Cores",
        description: "How many cores were taken?",
    },
    coresPositive: {
        value: 0,
        label: "Number Cores Positive",
        description: "How many were deemed positive?",
    },
    coresWithGroup45: {
        value: 0,
        label: "Cores With Group 4 or 5",
        description: "How many cores were labelled as group 4 or 5",
    },
    numCoresGreaterThan50: {
        value: 0,
        label: "Number of Cores > 50%",
        description: "How many cores had more than 50% of ... This can range from 5-40",
    }
} as AnalysisData;