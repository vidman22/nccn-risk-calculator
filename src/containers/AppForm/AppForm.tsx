import React, { useCallback, useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import CoreDataTable from '../CoreDataTable/CoreDataTable';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import AnalysisModal from '../../components/AnalysisModal/AnalysisModal';
import InfoModal from '../../components/InfoModal/InfoModal';
// import {PDFViewer} from '@react-pdf/renderer';
// import PDFDocument from "../PDFDocument/PDFDocument";
import { coreData, CoreData } from '../../data/coreData';
import { formData, FormData, ClinicalStage } from '../../data/formData';
import {
    getCountGGFourOrFive,
    getMaxGradeGroup,
    getMaxGleasonSum,
    getMaxPrimary,
    getMaxSecondary,
    getMaxInvolvedPercentage,
} from '../../coreHelpers';
import { INTERMEDIATE_RISK } from '../../data/riskConstants';
import { Result } from '../../components/Analysis';
import { parseForm, parseParams } from '../../helpers';
import { calculateNumHighRisk, calculateNumIntRiskFactors, calculateRisk, HighRiskParams, calculateIntermediateRisk, calculateCapra } from '../../riskHelpers';
import './AppForm.css';
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
} from '../../data/riskConstants';

export interface HighRiskFactor {
    psa: { label: string, value: boolean };
    stage: { label: string, value: boolean };
    gradeGroup: { label: string, value: boolean };
}

export interface VHighRiskFactor {
    stage: { label: string, value: boolean };
    gradeGroup: { label: string, value: boolean };
    gleason: { label: string, value: boolean };
    highRiskFactors: { label: string, value: boolean };
}

export interface IntRiskFactor {
    psa: { label: string, value: boolean };
    stage: { label: string, value: boolean };
    gradeGroup: { label: string, value: boolean };
}

export interface VeryLowRiskFactor {
    psa: { label: string, value: boolean };
    psaDensity: { label: string, value: boolean };
    stage: { label: string, value: boolean };
    gradeGroup: { label: string, value: boolean };
    coresPositive: { label: string, value: boolean };
}

export interface FavorableRiskFactors {
    fiftyPercentCoresPositive: { label: string, value: boolean };
    riskFactorNumber: { label: string, value: boolean };
    gradeGroup: { label: string, value: boolean };
}

type VeryLowRiskParams = {
    clinicalStage: ClinicalStage;
    psa: number;
    maxGradeGroup: number;
    psaDensity: number;
    totalCoresPositive: number;
    maxInvolvedPercentage: number;
}

type VeryHighParams = {
    clinicalStage: ClinicalStage;
    ggFourAndFiveCount: number;
    maxPrimary: number;
    maxGradeGroup: number;
    psa: number;
}

type UnfavorableIntParams = {
    numIntRiskFactors: number;
    maxGradeGroup: number;
    percentageCoresPositive: number;
}

type FavorableIntParams = {
    percentageCoresPositive: number;
    maxGradeGroup: number;
    numIntRiskFactors: number;
}

export const vHighRiskFactorsData = {
    stage: { label: "Stage T3b - T4", value: false },
    gradeGroup: { label: "More than 4 cores with Grade Group 4 or 5", value: false },
    gleason: { label: "Primary Gleason has pattern 5", value: false },
    highRiskFactors: { label: "Has 2-3 high risk factors", value: false },
};

export const highRiskFactorsData = {
    stage: { label: "Stage T3a", value: false },
    gradeGroup: { label: "Grade Group 4 or 5", value: false },
    psa: { label: "PSA is greater than 20 ng/ml", value: false },
};

export const favorableRiskFactorsData = {
    fiftyPercentCoresPositive: { label: "Less than 50% of biopsy cores positive", value: false },
    riskFactorNumber: { label: "Has 1 Intermediate Risk Factor", value: false },
    gradeGroup: { label: "Grade Group 1 or 2", value: false },
}

export const unfavorableRiskFactorsData = {
    fiftyPercentCoresPositive: { label: "50% or more of biopsy cores positive", value: false },
    riskFactorNumber: { label: "Has 2 or 3 Intermediate Risk Factors", value: false },
    gradeGroup: { label: "Grade Group 3", value: false },
};

export const intRiskFactorsData = {
    stage: { label: "Stage T2b-T2c", value: false },
    gradeGroup: { label: "Grade Group 2 or 3", value: false },
    psa: { label: "PSA 10-20 ng/ml", value: false },
};

export const lowRiskFactorsData = {
    stage: { label: "Stage T1-T2a", value: false },
    gradeGroup: { label: "Grade Group 1", value: false },
    psa: { label: "PSA is less than 10 ng/ml", value: false },
};

export const veryLowRiskFactorsData = {
    stage: { label: "Stage T1c", value: false },
    gradeGroup: { label: "Grade Group 1", value: false },
    psa: { label: "PSA less than 10-20 ng/ml", value: false },
    psaDensity: { label: "PSA density less than 0.15 ng/ml/g", value: false },
    coresPositive: { label: "Fewer than 3 cores positive, each with less than 50% involved", value: false },
};

export default function AppForm() {
    const query = new URLSearchParams(useLocation().search);
    const [saved, setSaved] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [coresValid, setCoresValid] = useState(true);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [form, setForm] = useState(formData);

    const [veryLowRiskFactors, setVeryLowRiskFactors] = useState<VeryLowRiskFactor>(veryLowRiskFactorsData);
    const [lowRiskFactors, setLowRiskFactors] = useState<IntRiskFactor>(lowRiskFactorsData);
    const [intRiskFactors, setIntRiskFactors] = useState<IntRiskFactor>(intRiskFactorsData);
    const [unfavorableRiskFactors, setUnfavorableRiskFactors] = useState<FavorableRiskFactors>(unfavorableRiskFactorsData);
    const [favorableRiskFactors, setFavorableRiskFactors] = useState<FavorableRiskFactors>(favorableRiskFactorsData);
    const [highRiskFactors, setHighRiskFactors] = useState<HighRiskFactor>(highRiskFactorsData);
    const [vHighRiskFactors, setVHighRiskFactors] = useState<VHighRiskFactor>(vHighRiskFactorsData);

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
        capra: '',
    });
    const [cores, setCores] = useState([coreData])
    const addCore = () => {
        const newCores = [...cores];
        newCores.push(coreData);
        setCores(newCores);
        setCoresValid(true);
    }

    useEffect(() => {
        setTimeout(() => {
            setSaved(false);
        }, 3000)
    }, [saved])

    useEffect(() => {

        const splitArray = [] as any;
        const hasParams = query.has('0a');
        let savedForm = localStorage.getItem("form");
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
        const queryArray = parseParams(query)
        const newForm = parseForm(query, form);

        let tmpObj = {} as any;
        queryArray.forEach((el: any, index: number) => {
            tmpObj[el.key] = el;
            if ((Object.keys(tmpObj).length) % 7 === 0) {
                splitArray.push(tmpObj);
                tmpObj = {};
            }
        });
        setForm(newForm);
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
            capra: '',
        });

        setCores([coreData]);
        localStorage.clear();
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        const name = e.target.name as keyof FormData;
        const newForm = { ...form };
        const newElement = newForm[name];
        const newValidation = { ...newElement.validation };

        newValidation.valid = true;
        newValidation.touched = true;
        newValidation.msg = '';

        newElement.validation = newValidation;
        newElement.value = value;

        newForm[name] = newElement;
        setForm(newForm);
    };

    const setVeryHighRiskFactorsHelper = useCallback(
        ({ clinicalStage, ggFourAndFiveCount, maxPrimary, psa, maxGradeGroup }: VeryHighParams) => {
            const newVHRF = { ...vHighRiskFactors };
            const newGG = { ...newVHRF.gradeGroup };
            const newStage = { ...newVHRF.stage };
            const newGleason = { ...newVHRF.gleason };
            const newRF = { ...newVHRF.highRiskFactors };

            newStage.value = clinicalStage === T3b || clinicalStage === T4;
            newGG.value = ggFourAndFiveCount >= 4;
            newGleason.value = maxPrimary === 5;
            newRF.value = calculateNumHighRisk({ clinicalStage, psa, maxGradeGroup }) >= 2;

            newVHRF.gradeGroup = newGG;
            newVHRF.stage = newStage;
            newVHRF.gleason = newGleason;
            newVHRF.highRiskFactors = newRF;

            setVHighRiskFactors(newVHRF);
        },
        [vHighRiskFactors],
    );

    const setHighRiskFactorsHelper = useCallback(
        ({ psa, clinicalStage, maxGradeGroup }: HighRiskParams) => {
            const newHRF = { ...highRiskFactors };
            const newPSA = { ...newHRF.psa };
            const newStage = { ...newHRF.stage };
            const newGG = { ...newHRF.gradeGroup };

            newPSA.value = psa > 20;
            newStage.value = clinicalStage === T3a;
            newGG.value = maxGradeGroup > 3;

            newHRF.psa = newPSA;
            newHRF.gradeGroup = newGG;
            newHRF.stage = newStage;

            setHighRiskFactors(newHRF);
        },
        [highRiskFactors],
    );

    const setIntRiskFactorsHelper = useCallback(
        ({ psa, clinicalStage, maxGradeGroup }: HighRiskParams) => {
            const newIRF = { ...intRiskFactors };
            const newPSA = { ...newIRF.psa };
            const newStage = { ...newIRF.stage };
            const newGradeGroup = { ...newIRF.gradeGroup };

            newPSA.value = psa >= 10 && psa < 20;
            newStage.value = clinicalStage === T2b || clinicalStage === T2c;
            newGradeGroup.value = maxGradeGroup > 1;

            newIRF.psa = newPSA;
            newIRF.stage = newStage;
            newIRF.gradeGroup = newGradeGroup;
            setIntRiskFactors(newIRF);
        },
        [intRiskFactors],
    );

    const setUnfavorableIntRiskFactorsHelper = useCallback(
        ({ numIntRiskFactors, maxGradeGroup, percentageCoresPositive }: UnfavorableIntParams) => {
            const newUF = { ...unfavorableRiskFactors };
            const newPer = { ...newUF.fiftyPercentCoresPositive };
            const newGG = { ...newUF.gradeGroup };
            const newRF = { ...newUF.riskFactorNumber }

            newPer.value = percentageCoresPositive > 50;
            newGG.value = maxGradeGroup === 3;
            newRF.value = numIntRiskFactors >= 2;

            newUF.riskFactorNumber = newRF;
            newUF.gradeGroup = newGG;
            newUF.fiftyPercentCoresPositive = newPer;

            setUnfavorableRiskFactors(newUF)
        },
        [unfavorableRiskFactors],
    );

    const setFavorableIntRiskFactorsHelper = useCallback(
        ({ percentageCoresPositive, numIntRiskFactors, maxGradeGroup }: FavorableIntParams) => {
            const newF = { ...favorableRiskFactors };
            const newPer = { ...newF.fiftyPercentCoresPositive };
            const newGG = { ...newF.gradeGroup };
            const newRF = { ...newF.riskFactorNumber };

            newPer.value = percentageCoresPositive < 50;
            newGG.value = maxGradeGroup === 1 || maxGradeGroup === 2;
            newRF.value = numIntRiskFactors === 1;

            newF.riskFactorNumber = newRF;
            newF.gradeGroup = newGG;
            newF.fiftyPercentCoresPositive = newPer;

            setFavorableRiskFactors(newF)
        },
        [favorableRiskFactors],
    );

    const setLowRiskFactorsHelper = useCallback(
        ({ clinicalStage, psa, maxGradeGroup }: HighRiskParams) => {
            // Must have all of the following for very low risk, if doesn't pass then you can calculate low risk
            const newL = { ...lowRiskFactors };
            const newStage = { ...newL.stage };
            const newPSA = { ...newL.psa };
            const newGG = { ...newL.gradeGroup };
            newStage.value = (clinicalStage === T1c || clinicalStage === T2a)
            newPSA.value = psa < 10
            newGG.value = maxGradeGroup === 1;

            newL.stage = newStage;
            newL.gradeGroup = newGG;
            newL.psa = newPSA;

            setLowRiskFactors(newL);
        },
        [lowRiskFactors],
    )

    const setVeryLowRiskFactorsHelper = useCallback(
        ({ clinicalStage, psa, maxGradeGroup, psaDensity, totalCoresPositive, maxInvolvedPercentage }: VeryLowRiskParams) => {
            const newVL = { ...veryLowRiskFactors };
            const newStage = { ...newVL.stage };
            const newPSA = { ...newVL.psa };
            const newPSADensity = { ...newVL.psaDensity };
            const newGG = { ...newVL.gradeGroup };
            const newCoresPositive = { ...newVL.coresPositive }

            newStage.value = clinicalStage === T1c;
            newPSA.value = psa < 10
            newPSADensity.value = psaDensity < 0.15;
            newGG.value = maxGradeGroup === 1;
            newCoresPositive.value = (totalCoresPositive <= 3 && maxInvolvedPercentage <= 50);

            newVL.stage = newStage;
            newVL.gradeGroup = newGG;
            newVL.psa = newPSA;
            newVL.psaDensity = newPSADensity;
            newVL.coresPositive = newCoresPositive;

            setVeryLowRiskFactors(newVL);
        },
        [veryLowRiskFactors],
    );

    const validateCores = useCallback(
        () => {
            let isValid = true;
            const newCores = [...cores];
            newCores.forEach((_, index) => {
                const newCore = {...cores[index]};
                Object.keys(newCore).forEach((k) => {
                    const newObj = {...newCore[k as keyof CoreData]};
                    const newValidation = {...newObj.validation};
                    if (k !== 'gradeGroup'){
                        if (!newObj.value || newObj.value === "0") {
                            newValidation.valid = false;
                            newValidation.touched = true;
                            newValidation.msg = "add a value";
                            isValid = false;
                        }
                    }
                    newObj.validation = newValidation;
                    newCore[k as keyof CoreData] = newObj;
                })
                newCores[index] = newCore;
            });
            setCores(newCores);
            if (!isValid) {
                setCoresValid(false);
            }
            return isValid;
        },
        [cores],
    );

    const validateForm = useCallback(
        () => {
            let isValid = true;
            Object.keys(formData).forEach((k, index) => {
                const obj = formData[k as keyof FormData];
                const newForm = { ...form };
                const newElement = newForm[k as keyof FormData];
                const newValidation = { ...newElement.validation };
                if (!newElement.value || newElement.value === "0") {
                    newValidation.valid = false;
                    newValidation.touched = true;
                    newValidation.msg = "Please add a value";
                    isValid = false;
                }
                if (k === 'clinicalStage') {
                    switch (obj.value) {
                        case T1a:
                        case T1b:
                            newValidation.valid = false;
                            newValidation.touched = true;
                            newValidation.msg = "This value indicates an incidental cancer finding and cannot be used for risk analysis.";
                            break;
                        case M1:
                        case N1:
                            newValidation.valid = false;
                            newValidation.touched = true;
                            newValidation.msg = "High risk stage of M1 and N1 cannot be used in calculation. Those patients are encouraged to seek prostate cancer care at a center of excellence that specializes in treating high risk prostate cancer.";
                            break;
                        default:
                            break;
                    }
                }
                newElement.validation = newValidation;
                newForm[k as keyof FormData] = newElement;
                isValid = isValid && newValidation.valid;
                setForm(newForm);
            })
            return isValid;
        },
        [form],
    )

    const calculateAnalysis = useCallback(
        async () => {
            const formValid = validateForm();
            const isCoresValid = validateCores();
            if (!isCoresValid || !formValid) {
                return;
            }
            let percentageCoresPositive = 0;
            let psaDensity = 0;
            const totalCoresPositive = cores.length;
            const totalCores = parseInt(form.totalCores.value);
            const psa = parseFloat(form.psa.value);
            const clinicalStage = form.clinicalStage.value as ClinicalStage;

            if (totalCores && totalCoresPositive) {
                percentageCoresPositive = Math.round(totalCoresPositive / totalCores * 100);
            }
            if (form.psa.value && form.prostateSize.value) {
                psaDensity = (Math.round(psa / parseInt(form.prostateSize.value) * 100) / 100);
            }
            const maxPrimary = getMaxPrimary(cores);
            const maxSecondary = getMaxSecondary(cores);
            const maxGradeGroup = getMaxGradeGroup(cores);
            const ggFourAndFiveCount = getCountGGFourOrFive(cores);
            const maxInvolvedPercentage = getMaxInvolvedPercentage(cores);
            const maxGleasonSum = getMaxGleasonSum(cores);
            const numIntRiskFactors = calculateNumIntRiskFactors({ maxGradeGroup, clinicalStage, psa });
            const numHighRiskFactors = calculateNumHighRisk({ clinicalStage, psa, maxGradeGroup });

            setVeryHighRiskFactorsHelper({ clinicalStage, ggFourAndFiveCount, maxGradeGroup, maxPrimary, psa });
            setHighRiskFactorsHelper({ psa, clinicalStage, maxGradeGroup });
            setIntRiskFactorsHelper({ psa, clinicalStage, maxGradeGroup });
            setLowRiskFactorsHelper({ clinicalStage, psa, maxGradeGroup });
            setVeryLowRiskFactorsHelper({ clinicalStage, psa, maxGradeGroup, psaDensity, totalCoresPositive, maxInvolvedPercentage })
            setFavorableIntRiskFactorsHelper({ percentageCoresPositive, numIntRiskFactors, maxGradeGroup });
            setUnfavorableIntRiskFactorsHelper({ percentageCoresPositive, numIntRiskFactors, maxGradeGroup });

            let risk = calculateRisk({ maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage, psa, clinicalStage, totalCoresPositive, numHighRiskFactors });
            let capra = calculateCapra({ maxPrimary, maxSecondary, percentageCoresPositive, age: parseInt(form.age.value), psa, clinicalStage })
            if (risk === INTERMEDIATE_RISK) {
                risk = calculateIntermediateRisk({ maxGradeGroup, percentageCoresPositive, psa, numIntRiskFactors, clinicalStage });
            }
            setResult({
                corePercentagePositive: percentageCoresPositive.toString(),
                maxInvolvedPercentage: maxInvolvedPercentage.toString(),
                psaDensity: psaDensity.toString(),
                maxGleasonSum: maxGleasonSum.toString(),
                maxGradeGroup: maxGradeGroup.toString(),
                maxPrimary: maxPrimary.toString(),
                maxSecondary: maxSecondary.toString(),
                ggFourAndFiveCount: ggFourAndFiveCount.toString(),
                risk,
                capra,
            });
            setShowAnalysis(true)
        }, [
        form,
        cores,
        setVeryLowRiskFactorsHelper,
        setLowRiskFactorsHelper,
        setIntRiskFactorsHelper,
        setFavorableIntRiskFactorsHelper,
        setHighRiskFactorsHelper,
        setUnfavorableIntRiskFactorsHelper,
        setVeryHighRiskFactorsHelper,
        setShowAnalysis,
        validateCores,
        validateForm]);

    return (
        <div className="Container">
            <div className="TitleWrapper">
                <h1>Prostate Cancer Risk Nomogram</h1>
                <button
                    className="LabelIconAppFunction"
                    onClick={() => {
                        setShowInfoModal(true)
                    }}>
                    <FontAwesomeIcon icon={faInfoCircle} size={'2x'} />
                    <span>Click to see how this is is this calculated</span>
                </button>
            </div>
            <div className="AppFormContainer">
                {saved &&
                    <div className="FadeCopied">
                        Info saved to browser
                </div>
                }

                {/*{showPdf &&*/}
                {/*    <PDFViewer>*/}
                {/*        <PDFDocument*/}
                {/*            highRiskFactors={highRiskFactors}*/}
                {/*            intRiskFactors={intRiskFactors}*/}
                {/*            vHighRiskFactors={vHighRiskFactors}*/}
                {/*            favorableRiskFactors={favorableRiskFactors}*/}
                {/*            unfavorableRiskFactors={unfavorableRiskFactors}*/}
                {/*            riskAssessment={result.risk}*/}
                {/*            coreData={cores}*/}
                {/*            resultData={result}*/}
                {/*            formData={form}*/}
                {/*        />*/}
                {/*    </PDFViewer>}*/}

                <div className="ListWrapper">
                    {Object.keys(form).map((k, index) => {
                        const obj = form[k as keyof FormData];
                        if (obj.options) {
                            return (
                                <div className="ValidationWrapper"
                                    key={index}
                                >
                                    <div className="InputWrapper">
                                        <div className="LabelIconWrapper">
                                            <FontAwesomeIcon icon={faInfoCircle} size={'1x'} />
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
                                    {!obj.validation.valid && <div className="ValidationError">{obj.validation.msg}</div>}
                                </div>
                            )
                        }
                        return (
                            <div className="ValidationWrapper"
                                key={index}
                            >
                                <div className="InputWrapper">
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
                                {!obj.validation.valid && <div className="ValidationError">{obj.validation.msg}</div>}
                            </div>
                        );
                    })}
                </div>
                <div className="AlignRight">
                    <button
                        className="ButtonAppFunction"
                        onClick={() => setShowConfirmation(true)}>
                        Clear
                        <span>Clear all data, including cores</span>
                    </button>
                    <button
                        className="ButtonAppFunction"
                        onClick={() => {
                            localStorage.setItem("savedCores", "true");
                            localStorage.setItem("cores", JSON.stringify(cores));
                            localStorage.setItem("form", JSON.stringify(form));
                            setSaved(true);
                        }}>
                        Save
                        <span>Save your data to browser</span>
                    </button>
                    <button
                        onClick={async () => {
                            // setShowPdf(true);
                            calculateAnalysis();
                        }}
                        type="button"
                        className="ButtonAppFunction"
                        style={{ backgroundColor: "#0858B8", color: "#fff" }}
                    >
                        Analysis
                        <span>Get Analysis</span>
                    </button>
                </div>
            </div>

            <CoreDataTable
                addCore={addCore}
                setCores={setCores}
                removeCore={removeCore}
                setCoresValid={setCoresValid}
                coresValid={coresValid}
                cores={cores}
            />

            {showAnalysis && (
                <AnalysisModal
                    visible={showAnalysis}
                    onDismiss={() => setShowAnalysis(false)}
                    result={result}
                    cores={cores}
                    form={form}
                    highRiskFactors={highRiskFactors}
                    intRiskFactors={intRiskFactors}
                    vHighRiskFactors={vHighRiskFactors}
                    favorableRiskFactors={favorableRiskFactors}
                    unfavorableRiskFactors={unfavorableRiskFactors}
                    lowRiskFactors={lowRiskFactors}
                    veryLowRiskFactors={veryLowRiskFactors}
                />
            )}
            {showInfoModal &&
                <InfoModal
                    visible={showInfoModal}
                    onDismiss={() => setShowInfoModal(false)}
                />
            }
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
