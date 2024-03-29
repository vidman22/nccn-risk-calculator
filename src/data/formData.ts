import {
    T1a,
    T1b,
    T1c,
    T2a,
    T2b,
    T2c,
    T3a,
    T3b,
    T4,
    N1,
    M1,

} from './riskConstants';

type Validation = {
    touched: boolean;
    valid: boolean;
    msg: string;
}

export type ClinicalStage = 'T1a' | 'T1b' | 'T1c' | 'T2a' | 'T2b' | 'T2c' | 'T3a' | 'T3b' | 'T4' | 'N1' | 'M1';

export interface FormValue {
    value: string;
    isDate?: boolean;
    initialValue: string;
    type: string;
    step?: string;
    options?: ClinicalStage[];
    validation: Validation;
    label: string;
    min: string;
    max: string;
    placeholder: string;
    description: string;
}

export interface FormData {
    age: FormValue;
    psa: FormValue;
    clinicalStage: FormValue;
    prostateSize: FormValue;
    month: FormValue;
    day: FormValue;
    year: FormValue;
    totalCores: FormValue;
}

export const formData = {
    age: {
        value: '',
        initialValue: '0',
        type: "number",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        label: "Age",
        min: '0',
        max: '100',
        placeholder: "0",
        description: "Input the patient's age at time of diagnosis.",
    },
    psa: {
        value: '',
        initialValue: '0',
        step: 'any',
        type: "number",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        label: "PSA",
        min: '0',
        max: '10000',
        placeholder: "0",
        description: "The latest PSA score; this ranges from 0-10,000.",
    },
    totalCores: {
        value: '',
        initialValue: '0',
        type: "number",
        validation: {
            touched: false,
            valid: true,
            msg: "",
        },
        label: "Total Cores",
        min: '6',
        max: '50',
        placeholder: '0',
        description: "Input the total number of cores extracted in the biopsy; the min value is 6.",
    },
    prostateSize: {
        value: '',
        initialValue: '0',
        type: 'number',
        validation: {
            touched: false,
            valid: true,
            msg: "",
        },
        label: "Prostate Size",
        min: '9',
        max: '250',
        placeholder: "0",
        description: "Input the size of the prostate in cc (cubic centimeters)",
    },
    month: {
        value: '',
        isDate: true,
        initialValue: '',
        type: 'text',
        validation: {
            touched: false,
            valid: true,
            msg: '',
        },
        max: '2',
        min: '2',
        label: 'Month',
        placeholder: 'MM',
        description: 'Select the date of diagnosis',
    },
    day: {
        value: '',
        isDate: true,
        initialValue: '',
        type: 'text',
        validation: {
            touched: false,
            valid: true,
            msg: '',
        },
        max: '2',
        min: '2',
        label: 'Day',
        placeholder: 'DD',
        description: 'Select the date of diagnosis',
    },
    year: {
        value: '',
        isDate: true,
        initialValue: '',
        type: 'text',
        validation: {
            touched: false,
            valid: true,
            msg: '',
        },
        max: '4',
        min: '4',
        label: 'Year',
        placeholder: 'YYYY',
        description: 'Select the date of diagnosis',
    },
    clinicalStage: {
        value: 'T1c',
        initialValue: 'T1c',
        type: "select",
        options: [
            T1a,
            T1b,
            T1c,
            T2a,
            T2b,
            T2c,
            T3a,
            T3b,
            T4,
            N1,
            M1,
            ],
        validation: {
            touched: true,
            valid: true,
            msg: "",
        },
        label: "Clinical Stage",
        min: '0',
        max: '5',
        placeholder: "T1c",
        description: "Select the cancer stage from the dropdown.",
    },
   
   
} as FormData;