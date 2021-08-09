import { CoreValue } from "./data/coreData";
import { FormData } from "./data/formData";


export const parseCores: (query : URLSearchParams) => any = (query : URLSearchParams) => {
    const queryArray = [] as CoreValue[];

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
                        valid: true,
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
                        valid: true,
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
                        valid: true,
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
                        valid: true,
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
                        valid: true,
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
                        valid: true,
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
                        valid: true,
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
            case 'age':
                const newAge = {...newForm.age}
                const newAgeValidation = {...newAge.validation};
                newAge.value = value;
                newAgeValidation.valid = true;
                newAge.validation = newAgeValidation;
                newForm.age = newAge;
                break;
            case 'cores':
                const newTotalCores = {...newForm.totalCores}
                const newCoreValidation = {...newTotalCores.validation};
                newTotalCores.value = value;
                newCoreValidation.valid = true;
                newTotalCores.validation = newCoreValidation;
                newForm.totalCores = newTotalCores;
                break;
            case 'stage':
                const newStage = {...newForm.clinicalStage};
                const newStageValidation = {...newStage.validation};
                newStage.value = value;
                newStageValidation.valid = true;
                newStage.validation = newStageValidation;
                newForm.clinicalStage = newStage;
                break;
            case 'psa':
                const newPSA = {...newForm.psa};
                const newPSAValidation = {...newPSA.validation};
                newPSA.value = value;
                newPSAValidation.valid = true;
                newPSA.validation = newPSAValidation;
                newForm.psa = newPSA
                break;
            case 'month':
                const newMonth = {...newForm.month};
                const newMonthValidation = {...newMonth.validation};
                newMonth.value = value;
                newMonthValidation.valid = true;
                newMonth.validation = newMonthValidation;
                newForm.month = newMonth
                break;
            case 'day':
                const newDay = {...newForm.day};
                const newDayValidation = {...newDay.validation};
                newDay.value = value;
                newDayValidation.valid = true;
                newDay.validation = newDayValidation;
                newForm.day = newDay
                break;
            case 'year':
                const newYear = {...newForm.year};
                const newYearValidation = {...newYear.validation};
                newYear.value = value;
                newYearValidation.valid = true;
                newYear.validation = newYearValidation;
                newForm.year = newYear
                break;
            case 'size':
                const newSize = {...newForm.prostateSize};
                const newSizeValidation = {...newSize.validation};
                newSize.value = value;
                newSizeValidation.valid = true;
                newSize.validation = newSizeValidation;
                newForm.prostateSize = newSize;
                break;
            default:
                break;
        }
    });
    return newForm;
}
