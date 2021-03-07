import { FormData } from "./data/formData";


export const parseParams: (query : URLSearchParams) => any = (query : URLSearchParams) => {
    const queryArray = [] as any;

    query.forEach((value, key) => {
        const check = key.match(/[^0-9]/);
        if (!check) {
            return;
        }

        switch (check[0]) {
            case 'a':
                queryArray.push({
                    value: value,
                    key: 'coreID',
                    initialValue: '',
                    shortName: 'a',
                    type: "text",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '',
                    max: '',
                    placeholder: "location",
                    disabled: false,
                })
                break;
            case 'b':
                queryArray.push({
                    value,
                    key: 'length',
                    initialValue: '0',
                    shortName: check[0],
                    type: "number",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '0',
                    max: '40',
                    placeholder: "0",
                    disabled: false,
                })
                break;
            case 'c':
                queryArray.push({
                    value,
                    key: 'percentageInvolved',
                    initialValue: '0',
                    shortName: check[0],
                    type: "number",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '0',
                    max: '100',
                    placeholder: "0",
                    disabled: false,
                })
                break;
            case 'd':
                queryArray.push({
                    value,
                    key: 'gleasonPrimary',
                    initialValue: '0',
                    shortName: check[0],
                    type: "number",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '0',
                    max: '5',
                    placeholder: "0",
                    disabled: false,
                })
                break;
            case 'e':
                queryArray.push({
                    value,
                    key: 'gleasonSecondary',
                    initialValue: '0',
                    shortName: check[0],
                    type: "number",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '0',
                    max: '5',
                    placeholder: "0",
                    disabled: false,
                })
                break;
            case 'f':
                queryArray.push({
                    value,
                    key: 'gleasonSum',
                    initialValue: '0',
                    shortName: check[0],
                    type: "number",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '0',
                    max: '10',
                    placeholder: "0",
                    disabled: true,
                })
                break;
            case 'g':
                queryArray.push({
                    value,
                    key: 'gradeGroup',
                    initialValue: '0',
                    shortName: check[0],
                    type: "number",
                    validation: {
                        touched: false,
                        error: "",
                        msg: "",
                    },
                    min: '0',
                    max: '5',
                    placeholder: "0",
                    disabled: true,
                })
                break;
            default:
                break;
        }
    });
    return queryArray;
}

export const parseForm: (query: URLSearchParams, form: FormData ) => FormData = ( query: URLSearchParams, form : FormData ) => {
    const newForm = {...form};
    query.forEach((value, key) => {
        switch (key) {
            case 'ptage':
                const newAge = {...newForm.age}
                newAge.value = value;
                newForm.age = newAge;
                break;
            case 'stage':
                const newStage = {...newForm.clinicalStage};
                newStage.value = value;
                newForm.clinicalStage = newStage;
                break;
            case 'psa':
                const newPSA = {...newForm.psa};
                newPSA.value = value;
                newForm.psa = newPSA
                break;
            case 'size':
                const newSize = {...newForm.prostateSize};
                newSize.value = value;
                newForm.prostateSize = newSize;
                break;
            default:
                break;
        }
    });
    return newForm;
}
