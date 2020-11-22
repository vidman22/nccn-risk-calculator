type Validation = {
    touched: boolean;
    error: string;
    msg: string;
}

export interface FormValue {
    value: string;
    initialValue: string;
    type: string;
    step?: string;
    validation: Validation;
    options?: string[];
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
            error: "",
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
            error: "",
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
        options: ['T1c', 'T1', 'T2a', 'T2b', 'T2c', 'T3a', 'T3b', 'T4'],
        validation: {
            touched: false,
            error: "",
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
            error: "",
            msg: "",
        },
        label: "Prostate Size",
        min: '10',
        max: '200',
        placeholder: "10",
        description: "Input the size of the prostate in millimeters",
    }
} as FormData;