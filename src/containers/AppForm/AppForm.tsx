import React, { useState, useEffect, useCallback } from "react";
import {
    useLocation
} from 'react-router-dom';
import CoreDataTable from '../CoreDataTable/CoreDataTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle, faSave, faTrash, faCalculator } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import AnalysisModal from '../../components/AnalysisModal/AnalysisModal';
import { coreData } from '../../data/coreData';
import { formData, FormData } from '../../data/formData';
import {
    HIGH_RISK,
    VERY_HIGH_RISK,
    LOW_RISK,
    INTERMEDIATE_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    VERY_LOW_RISK
} from '../../data/riskConstants';
import { Result } from '../../components/Analysis';
import './AppForm.css';


export default function AppForm() {
    const query = new URLSearchParams(useLocation().search);
    const [saved, setSaved] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [form, setForm] = useState(formData);
    // const [showPdf, setShowPdf] = useState(false);

    const [result, setResult] = useState<Result>({
        corePercentagePositive: '',
        maxInvolvedPercentage: '',
        psaDensity: '',
        maxGradeGroup: '',
        maxGleasonSum: '',
        maxPrimary: '',
        maxSecondary: '',
        ggFourAndFiveCount: '',
        risk: '',
    });
    const [cores, setCores] = useState([coreData])
    const addCore = () => {
        const newCores = [...cores];
        newCores.push(coreData);
        setCores(newCores);
    }

    useEffect(() => {
        setTimeout(() => {
            setSaved(false);
        }, 3000)
    }, [saved])

    useEffect(() => {

        const queryArray = [] as any;
        const splitArray = [] as any;
        const hasParams = query.has('0a');
        const savedForm = localStorage.getItem("form");
        if (savedForm) {
            setForm(JSON.parse(savedForm));
        }
        if (!hasParams && localStorage.getItem("savedCores")) {
            if (localStorage.getItem("cores")) {
                setCores(JSON.parse(localStorage.getItem('cores') || ''));
            }
            return;
        } else if (!hasParams) {
            return;
        }

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
                        placeholder: "ID",
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
        let tmpObj = {} as any;
        queryArray.forEach((el: any, index: number) => {
            tmpObj[el.key] = el;
            if ((Object.keys(tmpObj).length) % 7 === 0) {
                splitArray.push(tmpObj);
                tmpObj = {};
            }
        });
        setCores(splitArray);
        // eslint-disable-next-line
    }, [])

    const removeCore = (index: number) => {
        if (cores.length < 2) {
            return;
        }
        const newCores = [...cores];
        newCores.splice(index, 1);
        setCores(newCores);
    }

    const clearCores = () => {
        const newForm = { ...form };
        for (let key in newForm) {
            const newElement = newForm[key as keyof FormData];
            newElement.value = newElement.initialValue;
            newForm[key as keyof FormData] = newElement;
        }

        setForm(newForm);
        setResult({
            corePercentagePositive: '',
            maxInvolvedPercentage: '',
            psaDensity: '',
            maxGradeGroup: '',
            maxGleasonSum: '',
            maxPrimary: '',
            maxSecondary: '',
            ggFourAndFiveCount: '',
            risk: '',
        });

        setCores([coreData]);
        localStorage.clear();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const name = e.target.name as keyof FormData;
        const newForm = { ...form };
        const newElement = newForm[name];
        newElement.value = value;
        newForm[name] = newElement;

        setForm(newForm);
    };

    const getTotalCoresPositive = useCallback(
        () => {
            let count = 0;
    
            cores.forEach(cr => {
                if (parseInt(cr.gleasonPrimary.value) > 2 || parseInt(cr.gleasonPrimary.value) > 2) {
                    count++;
                }
            })
            return count;
        },
      [cores],
    )

    const getCountGGFourOrFive = useCallback(
        () => {
            let count = 0;
    
            cores.forEach(cr => {
                if (parseInt(cr.gradeGroup.value) > 3) {
                    count++;
                }
            })
    
            return count.toString();
    
        },
      [cores],
    );

    const getMaxGradeGroup = useCallback(
        () => {
            let maxGG = "0";
    
            cores.forEach(cr => {
                if (parseInt(cr.gradeGroup.value) > parseInt(maxGG)) {
                    maxGG = cr.gradeGroup.value
                }
            })
            return maxGG;
        },
      [cores],
    );

    const getMaxGleasonSum = useCallback(
        () => {
            let maxGS = "0";
    
            cores.forEach(cr => {
                if (parseInt(cr.gleasonSum.value) > parseInt(maxGS)) {
                    maxGS = cr.gleasonSum.value
                }
            })
    
            return maxGS;
        },
      [cores],
    )


    const getMaxPrimary = useCallback(
      () => {
        let maxPrimary = "0";

        cores.forEach(cr => {
            if (parseInt(cr.gleasonPrimary.value) > parseInt(maxPrimary)) {
                maxPrimary = cr.gleasonPrimary.value
            }
        })

        return maxPrimary;
    },
      [cores],
    )

    const getMaxSecondary = useCallback(
        () => {
            let maxSecondary = "0";
    
            cores.forEach(cr => {
                if (parseInt(cr.gleasonSecondary.value) > parseInt(maxSecondary)) {
                    maxSecondary = cr.gleasonSecondary.value
                }
            })
    
            return maxSecondary;
        },
      [cores],
    )

    const getMaxInvolvedPercentage = useCallback(
        () => {
            let maxInvolvedPercentage = "0";
            cores.forEach(cr => {
                if (parseInt(cr.percentageInvolved.value) > parseInt(maxInvolvedPercentage)) {
                    maxInvolvedPercentage = cr.percentageInvolved.value
                }
            })
    
            return maxInvolvedPercentage || 'NA';
        },
      [cores],
    );

    const calculateIntermediateRisk = useCallback(
        (maxGradeGroup: number) => {
            const clinicalStage = form.clinicalStage.value;
            const psa = parseInt(form.psa.value);
    
            const percentageCoresPositive = Math.floor((getTotalCoresPositive()) / cores.length)
    
            if (clinicalStage === 'T2b' || clinicalStage === 'T2c' || maxGradeGroup === 3 || psa >= 10 || percentageCoresPositive > 50) {
                return INTERMEDIATE_HIGH_RISK;
            }
    
            if (maxGradeGroup >= 2 && percentageCoresPositive < 50) {
                return INTERMEDIATE_LOW_RISK;
            }
            return 'x';
        },
      [form, cores, getTotalCoresPositive])

    const calculateRisk = useCallback(
        (maxPrimary: string, maxGradeGroup: string, ggFourAndFiveCount: string, psaDensity: string, maxInvolvedPercentage: string) => {

            let intMaxPrimary = parseInt(maxPrimary);
            let intMaxGradeGroup = parseInt(maxGradeGroup);
            let intGGFourAndFiveCount = parseInt(ggFourAndFiveCount);
            let intPSADensity = parseInt(psaDensity);
            let intMaxInvolvedPercentage = parseInt(maxInvolvedPercentage);
            //'T1c', 'T1', 'T2a', 'T2b', 'T2c', 'T3a', 'T3b', 'T4';

            const clinicalStage = form.clinicalStage.value;
            const psa = parseInt(form.psa.value);

            if (intMaxPrimary === 5 || intGGFourAndFiveCount >= 4 || clinicalStage === 'T3b' || clinicalStage === 'T4') {
                return VERY_HIGH_RISK;
            };

            //This means at least two of the three high risk factors that should bump it to very high risk
            if ((psa > 20 && (clinicalStage === 'T3a' || intMaxGradeGroup > 3)) || ((psa > 20 || clinicalStage === 'T3a') && intMaxGradeGroup > 3) || (clinicalStage === 'T3a' && (psa > 20 || intMaxGradeGroup > 3))) {
                return VERY_HIGH_RISK;
            }

            if (psa > 20 || clinicalStage === 'T3a' || intMaxGradeGroup > 3) {

                return HIGH_RISK;
            }
            //this means if they have a clinical stage above T1 and T2a
            if (psa >= 10 || intMaxGradeGroup > 1 || clinicalStage === 'T2b' || clinicalStage === 'T2c' || clinicalStage === 'T3a' || clinicalStage === 'T3b' || clinicalStage === 'T4') {
                return INTERMEDIATE_RISK;
            }
            //the clinical stages are the only ones possible for low risk
            if (intPSADensity < 0.15 || cores.length >= 3 || intMaxInvolvedPercentage > 50 || clinicalStage === 'T1' || clinicalStage === 'T2a') {

                return LOW_RISK;
            }

            //basically if the clinical stage is T1c
            return VERY_LOW_RISK;

        }
    , [cores, form ])


const calculateAnalysis = useCallback(
    () => {

        let corePercentagePositive = 'NA';
        let psaDensity = 'NA';
        const totalCoresPositive = getTotalCoresPositive();
        const totalCores = cores.length;

        if (totalCores && totalCoresPositive) {
            corePercentagePositive = Math.round(totalCoresPositive / totalCores * 100).toString();
        }
        if (form.psa.value && form.prostateSize.value) {
            psaDensity = (Math.round(parseInt(form.psa.value) / parseInt(form.prostateSize.value) * 100) / 100).toString();
        }

        const maxPrimary = getMaxPrimary();

        const maxSecondary = getMaxSecondary();

        const maxGradeGroup = getMaxGradeGroup();

        const ggFourAndFiveCount = getCountGGFourOrFive();

        const maxInvolvedPercentage = getMaxInvolvedPercentage();

        const maxGleasonSum = getMaxGleasonSum();

        let risk = calculateRisk(maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage);

        if (risk === INTERMEDIATE_RISK) {
            risk = calculateIntermediateRisk(parseInt(maxGradeGroup));
        }

        setResult({
            corePercentagePositive,
            maxInvolvedPercentage,
            psaDensity,
            maxGleasonSum,
            maxGradeGroup,
            maxPrimary,
            maxSecondary,
            ggFourAndFiveCount,
            risk,
        });
    }, [form, cores, calculateIntermediateRisk, getMaxPrimary, getMaxSecondary, getMaxGleasonSum, calculateRisk, getCountGGFourOrFive, getMaxGradeGroup, getMaxInvolvedPercentage, getTotalCoresPositive]);

useEffect(() => {
    calculateAnalysis()
}, [calculateAnalysis])

return (
    <div className="Container">
        <h1>NCCN Risk Nomogram</h1>
        <div className="AppFormContainer">
            {saved &&
                <div className="FadeCopied">
                    Info saved to browser
                    </div>
            }

            {/* {showPdf &&
                    <PDFViewer>
                        <PDFDocument coreData={cores} resultData={result} formData={form} />
                    </PDFViewer>} */}
            <div className="AnotherWrapper">


            </div>
            <div className="AlignRight">
                <button
                    className="LabelIconAppFunction"
                    onClick={() => setShowConfirmation(true)}>
                    <FontAwesomeIcon icon={faTrash} />
                    <span>Clear all data, including cores</span>
                </button>
                <button
                    className="LabelIconAppFunction"
                    onClick={() => {
                        localStorage.setItem("savedCores", "true");
                        localStorage.setItem("cores", JSON.stringify(cores));
                        localStorage.setItem("form", JSON.stringify(form));
                        setSaved(true);
                    }}>
                    <FontAwesomeIcon icon={faSave} />
                    <span>Save your data to browser</span>
                </button>

                <button
                    onClick={() => setShowAnalysis(true)}
                    type="button"
                    className="LabelIconAppFunction"
                >
                    <FontAwesomeIcon icon={faCalculator} />
                    <span>Get Analysis</span>
                </button>



            </div>

            <div className="ListWrapper">
                {Object.keys(form).map((k, index) => {
                    const obj = form[k as keyof FormData];
                    if (obj.options) {
                        return (
                            <div key={index} className="InputWrapper">
                                <div className="LabelIconWrapper">
                                    <FontAwesomeIcon icon={faInfoCircle} />
                                    <label className="FormLabel">
                                        {obj.label}
                                    </label>
                                    <span>{obj.description}</span>
                                </div>
                                <select
                                    className="SelectField"

                                    name={k}
                                    value={obj.value}
                                    onChange={handleChange}
                                >
                                    {obj.options.map(op => (
                                        <option key={op}>
                                            {op}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )
                    }
                    return (
                        <div
                            className="InputWrapper"
                            key={index}
                        >
                            <div className="LabelIconWrapper">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <label className="FormLabel">
                                    {obj.label}
                                </label>
                                <span>{obj.description}</span>
                            </div>
                            <input
                                className="FormInput"
                                style={{ width: "80px" }}
                                name={k}
                                min={obj.min || ''}
                                max={obj.max || ''}
                                step={obj.step || "1"}
                                type={obj.type}
                                placeholder={obj.placeholder}
                                value={obj.value}
                                onChange={handleChange}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
        <CoreDataTable
            addCore={addCore}
            setCores={setCores}
            removeCore={removeCore}
            cores={cores}
        />
        {showAnalysis && (
            <AnalysisModal
                visible={showAnalysis}
                onDismiss={() => setShowAnalysis(false)}
                result={result}
                cores={cores}
                form={form}
            />
        )}
        {showConfirmation &&
            <ConfirmationModal
                visible={showConfirmation}
                onDismiss={() => setShowConfirmation(false)}
                confirmAction={() => {
                    clearCores();
                    setShowConfirmation(false);
                }}
            />
        }

    </div>
);
}
