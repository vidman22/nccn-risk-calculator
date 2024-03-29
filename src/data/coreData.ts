type Validation = {
    touched: boolean;
    valid: boolean;
    msg: string;
}

export interface CoreValue {
    value: string;
    initialValue: string;
    shortName: string;
    key: keyof CoreData;
    type: string;
    validation: Validation;
    min: string;
    max: string;
    placeholder: string;
    disabled: boolean;
}

export interface CoreData {
    coreID: CoreValue;
    length: CoreValue;
    percentageInvolved: CoreValue;
    gleasonPrimary: CoreValue;
    gleasonSecondary: CoreValue;
    gleasonSum: CoreValue;
    gradeGroup: CoreValue;
}

export const coreData = {
    coreID: {
        value: '',
        initialValue: '',
        key: 'coreID',
        shortName: 'a',
        type: "text",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        min: '',
        max: '',
        placeholder: '0',
        disabled: false,
    },
    length: {
        value: '',
        initialValue: '0',
        key: 'length',
        shortName: 'b',
        type: "number",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        min: '1',
        max: '35',
        placeholder: "0",
        disabled: false,
    },
    percentageInvolved: {
        value: '',
        initialValue: '0',
        key: 'percentageInvolved',
        shortName: 'c',
        type: "number",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        min: '0',
        max: '100',
        placeholder: "0",
        disabled: false,
    },
    gleasonPrimary: {
        value: '',
        initialValue: '0',
        key: 'gleasonPrimary',
        shortName: 'd',
        type: "number",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        min: '0',
        max: '5',
        placeholder: "0",
        disabled: false,
    },
    gleasonSecondary: {
        value: '',
        initialValue: '0',
        key: 'gleasonSecondary',
        shortName: 'e',
        type: "number",
        validation: {
            touched: false,
            valid: false,
            msg: "",
        },
        min: '0',
        max: '5',
        placeholder: "0",
        disabled: false,
    },
    gleasonSum: {
        value: '',
        initialValue: '0',
        key: 'gleasonSum',
        shortName: 'f',
        type: "number",
        validation: {
            touched: false,
            valid: true,
            msg: "",
        },
        min: '0',
        max: '10',
        placeholder: "0",
        disabled: true,
    },
    gradeGroup: {
        value: '',
        initialValue: '0',
        key: 'gradeGroup',
        shortName: 'g',
        type: "number",
        validation: {
            touched: false,
            valid: true,
            msg: "",
        },
        min: '0',
        max: '5',
        placeholder: "0",
        disabled: true,
    },
} as CoreData;

export const coreHeaders = [
    { name: 'Core ID/#', description: 'The core\'s id or number'},
    { name: 'Length', description: 'The length of the core in millimeters' },
    { name: '% Involved', description: 'The percentage of the core that shows abnormality' },
    { name: 'Primary', description: 'This is the Gleason Primary score of the core' },
    { name: 'Secondary', description: 'This is the Gleason Secondary score of the core' },
    { name: 'Sum', description: 'This is the auto-calculated sum of the Primary and Secondary' },
    { name: 'Grade Group', description: 'This is the auto-calculated Grade Group score from the Gleason scores' },
]