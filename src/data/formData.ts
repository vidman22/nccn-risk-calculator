import {
    T1,
    T1c,
    T2a,
    T2b,
    T2c,
    T3a,
    T3b,
    T3c,
    T4,
    N1,
    M1,

} from './riskConstants';

type Validation = {
    touched: boolean;
    valid: boolean;
    msg: string;
}

export type ClinicalStage = 'T1' | 'T1c' | 'T2a' | 'T2b' | 'T2c' | 'T3a' | 'T3b' | 'T3c' | 'T4' | 'N1' | 'M1';

export interface FormValue {
    value: string;
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
        description: "The patient's age",
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
        description: "The latest PSA score: this ranges from 0-10,000",
    },
    clinicalStage: {
        value: 'T1c',
        initialValue: 'T1c',
        type: "select",
        options: [
            T1,
            T1c,
            T2a,
            T2b,
            T2c,
            T3a,
            T3b,
            T3c,
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
        description: "What is the clinical stage? Select from the dropdown.",
    },
    prostateSize: {
        value: '10',
        initialValue: '10',
        type: "number",
        validation: {
            touched: false,
            valid: true,
            msg: "",
        },
        label: "Prostate Size",
        min: '10',
        max: '200',
        placeholder: "10",
        description: "Input the size of the prostate in cc (cubic centimeters)",
    }
} as FormData;