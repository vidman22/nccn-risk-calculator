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
import { coreData } from '../../data/coreData';
import { formData, FormData } from '../../data/formData';
import {
    getTotalCoresPositive,
    getCountGGFourOrFive,
    getMaxGradeGroup,
    getMaxGleasonSum,
    getMaxPrimary,
    getMaxSecondary,
    getMaxInvolvedPercentage,
} from '../../coreHelpers';
import {
    HIGH_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    INTERMEDIATE_RISK,
    LOW_RISK,
    VERY_HIGH_RISK,
    VERY_LOW_RISK
} from '../../data/riskConstants';
import { Result } from '../../components/Analysis';
import { parseForm, parseParams } from "../../helpers";
import './AppForm.css';
import { NumberLiteralType } from "typescript";

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

export interface FavorableRiskFactors {
    fiftyPercentCoresPositive: { label: string, value: boolean };
    riskFactorNumber: { label: string, value: boolean };
    gradeGroup: { label: string, value: boolean };
}

type HighRiskParams = {
    clinicalStage: string;
    psa: number;
    maxGradeGroup: number;
}

type VeryHighParams = {
    clinicalStage: string;
    ggFourAndFiveCount: number;
    maxPrimary: number;
    maxGradeGroup: number;
    psa: number;
}

type IntParams = {
    psa: Number;
    clinicalStage: string;
    maxGradeGroup: number;
}

type UnfavorableIntParams = {
    numIntRiskFactors: number;
    maxGradeGroup: number;
    percentageCoresPositive: number;
}

type CalculateCapraParams = {
    maxPrimary: number;
    maxSecondary: number;
    percentageCoresPositive: number;
}

type CalculateRiskParams = {
    maxPrimary: number;
    maxGradeGroup: number;
    ggFourAndFiveCount: number;
    psaDensity: number;
    maxInvolvedPercentage: number;
    psa: number;
    clinicalStage: string;
}

type FavorableIntParams = {
    percentageCoresPositive: number;
    maxGradeGroup: number;
    numIntRiskFactors: number;
}

export default function AppForm() {
    const query = new URLSearchParams(useLocation().search);
    const [saved, setSaved] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [form, setForm] = useState(formData);

    const [intRiskFactors, setIntRiskFactors] = useState<IntRiskFactor>({
        stage: { label: "Stage T2b-T2c", value: false },
        gradeGroup: { label: "Grade Group 2 or 3", value: false },
        psa: { label: "PSA 10-20 ng/ml", value: false },
    });

    const [unfavorableRiskFactors, setUnfavorableRiskFactors] = useState<FavorableRiskFactors>({
        fiftyPercentCoresPositive: { label: "50% or more of biopsy cores positive", value: false },
        riskFactorNumber: { label: "Has 2 or 3 Int Risk Factors", value: false },
        gradeGroup: { label: "Grade Group 3", value: false },
    });

    const [favorableRiskFactors, setFavorableRiskFactors] = useState<FavorableRiskFactors>({
        fiftyPercentCoresPositive: { label: "Less than 50% of biopsy cores positive", value: false },
        riskFactorNumber: { label: "Has 1 Int Risk Factor", value: false },
        gradeGroup: { label: "Grade Group 1 or 2", value: false },
    });

    const [highRiskFactors, setHighRiskFactors] = useState<HighRiskFactor>({
        stage: { label: "Stage T3a", value: false },
        gradeGroup: { label: "Grade Group 4 or 5", value: false },
        psa: { label: "PSA is greater than 20 ng/ml", value: false },
    });

    const [vHighRiskFactors, setVHighRiskFactors] = useState<VHighRiskFactor>({
        stage: { label: "Stage T3b - T4", value: false },
        gradeGroup: { label: "More than 4 cores with Grade Group 4 or 5", value: false },
        gleason: { label: "Primary Gleason has pattern 5", value: false },
        highRiskFactors: { label: "Has 2-3 high risk factors", value: false },
    });

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
            console.log("no params or storage")
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
        newElement.value = value;
        newForm[name] = newElement;
        setForm(newForm);
    };

    const calculateIntermediateRisk = useCallback(
        ( { maxGradeGroup, percentageCoresPositive, psa, numIntRiskFactors } : { maxGradeGroup: number, percentageCoresPositive: number, psa: number, numIntRiskFactors: number }) => {
            const clinicalStage = form.clinicalStage.value;
            const newIRF = { ...intRiskFactors };

            // At this stage we've already determined that the patient has at least one of the intermediate risk factors
            // We can check for the high risk factors exceeding 2-3 IRFs but don't need to check the number int risk factors
            // for favorable intermediate risk
            if (clinicalStage === 'T2b' || clinicalStage === 'T2c' || maxGradeGroup === 3 || psa >= 10 || percentageCoresPositive > 50 || numIntRiskFactors >= 2) {

                setIntRiskFactors(newIRF);

                return INTERMEDIATE_HIGH_RISK;
            }

            if (maxGradeGroup >= 2 && percentageCoresPositive < 50) {

                setIntRiskFactors(newIRF);

                return INTERMEDIATE_LOW_RISK;
            }
            return 'x';
        },
        [form, cores, favorableRiskFactors, intRiskFactors, unfavorableRiskFactors])

    const calculateNumHighRisk = useCallback(
      ({psa, clinicalStage, maxGradeGroup}: HighRiskParams) => {
          let int = 0;
          if (psa > 20 ){
              int++;
          }
          if (clinicalStage === 'T3a'){
              int++;
          }
          if (maxGradeGroup > 3) {
              int++;
          }
          return int;
      },
      [],
    );

    const calculateNumIntRiskFactors = ({ maxGradeGroup, clinicalStage, psa} : IntParams ) => {
        let numRF = 0;

        if (maxGradeGroup === 3 || maxGradeGroup === 2) {
            numRF++
        }
        if (clinicalStage === 'T2b' || clinicalStage === 'T2c') {
            numRF++
        }
        if ( psa >= 10 && psa < 20 ) {
            numRF++
        }
        return numRF;
    }

    const setVeryHighRiskFactorsHelper = useCallback(
      ({clinicalStage, ggFourAndFiveCount, maxPrimary, psa, maxGradeGroup}: VeryHighParams) => {
        const newVHRF = { ...vHighRiskFactors };
        const newGG = { ...newVHRF.gradeGroup };
        const newStage = { ...newVHRF.stage };
        const newGleason = { ...newVHRF.gleason };
        const newRF = { ...newVHRF.highRiskFactors };

        newStage.value = clinicalStage === 'T3b' || clinicalStage === 'T4';
        newGG.value = ggFourAndFiveCount >= 4;
        newGleason.value = maxPrimary === 5;
        newRF.value = calculateNumHighRisk({clinicalStage, psa, maxGradeGroup }) >= 2;

        newVHRF.gradeGroup = newGG;
        newVHRF.stage = newStage;
        newVHRF.gleason = newGleason;
        newVHRF.highRiskFactors = newRF;

        setVHighRiskFactors(newVHRF);
      },
      [],
    );

    const setHighRiskFactorsHelper = useCallback(
      ({psa, clinicalStage, maxGradeGroup}: HighRiskParams) => {
        const newHRF = { ...highRiskFactors };
        const newPSA = { ...newHRF.psa };
        const newStage = { ...newHRF.stage };
        const newGG = { ...newHRF.gradeGroup };

        newPSA.value = psa > 20;
        newStage.value = clinicalStage === 'T3a';
        newGG.value = maxGradeGroup > 3;

        newHRF.psa = newPSA;
        newHRF.gradeGroup = newGG;
        newHRF.stage = newStage;

        setHighRiskFactors(newHRF);
      },
      [],
    );

    const setIntRiskFactorsHelper = useCallback(
      ({psa, clinicalStage, maxGradeGroup} : IntParams) => {
        const newIRF = { ...intRiskFactors };
        const newPSA = { ...newIRF.psa };
        const newStage = { ...newIRF.stage };
        const newGradeGroup = { ...newIRF.gradeGroup };

        newPSA.value = psa >= 10 && psa < 20;
        newStage.value = clinicalStage === 'T2b' || clinicalStage === 'T2c';
        newGradeGroup.value = maxGradeGroup > 1;

        newIRF.psa = newPSA;
        newIRF.stage = newStage;
        newIRF.gradeGroup = newGradeGroup;
        setIntRiskFactors(newIRF);
      },
      [],
    );

    const setUnfavorableIntRiskFactorsHelper = ({ numIntRiskFactors, maxGradeGroup, percentageCoresPositive } : UnfavorableIntParams) =>{
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
    };

    const setFavorableIntRiskFactorsHelper = ({ percentageCoresPositive, numIntRiskFactors, maxGradeGroup }: FavorableIntParams) => {
        const newF = { ...favorableRiskFactors };
        const newPer = { ...newF.fiftyPercentCoresPositive };
        const newGG = { ...newF.gradeGroup };
        const newRF = { ...newF.riskFactorNumber };

        newPer.value = percentageCoresPositive > 50;
        newGG.value = maxGradeGroup === 1 || maxGradeGroup === 2;
        newRF.value = numIntRiskFactors === 1;

        newF.riskFactorNumber = newRF;
        newF.gradeGroup = newGG;
        newF.fiftyPercentCoresPositive = newPer;

        setFavorableRiskFactors(newF)
    }

    const calculateRisk = useCallback(
        ({ maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage, psa, clinicalStage} : CalculateRiskParams) => {
            //'T1c', 'T1', 'T2a', 'T2b', 'T2c', 'T3a', 'T3b', 'T4';
            let risk = '';
            // This means at least two of the three high risk factors that should bump it to very high risk
            // If T3b goto Very High Risk ; ClinicalStage
            // If T4, goto Very High Risk ; ClinicalStage
            // If MaxPrimary = 5, goto Very High Risk ; MaxPrimary
            // If NumGG4or5 &gt;=4 cores with Group 4 or Group 5 goto Very High Risk ;
            // NumGG4or5
            if (maxPrimary === 5 || ggFourAndFiveCount >= 4 || clinicalStage === 'T3b' || clinicalStage === 'T4') {
                risk = VERY_HIGH_RISK;
            }
            // intMaxGradeGroup is 4 or 5 i.e. greater than 3
            if (psa > 20 || clinicalStage === 'T3a' || maxGradeGroup > 3) {
                if (!risk) {
                    risk = HIGH_RISK;
                }
            }
            //this means if they have a clinical stage above T1 and T2a
            if ((psa >= 10 && psa < 20) || maxGradeGroup > 1 || clinicalStage === 'T2b' || clinicalStage === 'T2c') {
                if (!risk) {
                    risk = INTERMEDIATE_RISK;
                }
            }
            //the clinical stages are the only ones possible for low risk
            if (psaDensity < 0.15 || cores.length >= 3 || maxInvolvedPercentage > 50 || clinicalStage === 'T1' || clinicalStage === 'T2a') {
                if (!risk) {
                    risk = LOW_RISK;
                }
            }
            //basically if the clinical stage is T1c
            if (!risk) {
                return VERY_LOW_RISK;
            }
            return risk;
        }
        , [cores, form, highRiskFactors, intRiskFactors, vHighRiskFactors])

    const calculateCapra = useCallback(
        ({maxPrimary, maxSecondary, percentageCoresPositive} : CalculateCapraParams) => {

            const clinicalStage = form.clinicalStage.value;
            let capra = 0;

            if (parseInt(form.age.value) > 49) {
                capra++;
            }
            // If the psa is less than six do nothing, if it is greater than six but less than 10 add one
            if (parseFloat(form.psa.value) > 6 && parseFloat(form.psa.value) < 10) {
                capra++;
            }
            // If the psa is between 10 and 20 add two
            if (parseFloat(form.psa.value) > 10 && parseFloat(form.psa.value) < 20) {
                capra += 2
            }
            if (parseFloat(form.psa.value) > 20 && parseFloat(form.psa.value) < 30) {
                capra += 3
            }
            if (parseFloat(form.psa.value) > 30 && parseFloat(form.psa.value) < 40) {
                capra += 4
            }
            if (maxPrimary > 3) {
                capra += 3
            } else if (maxSecondary > 3) {
                capra++
            }
            if (clinicalStage === 'T3a') {
                capra++
            }
            if (percentageCoresPositive >= 34) {
                capra++
            }
            return capra.toString()
        }
        , [form])


    const calculateAnalysis = useCallback(
        async () => {
            let percentageCoresPositive = 0;
            let psaDensity = 0;
            const totalCoresPositive = getTotalCoresPositive(cores);
            const totalCores = cores.length;
            const psa = parseFloat(form.psa.value);
            const clinicalStage = form.clinicalStage.value;

            if (totalCores && totalCoresPositive) {
                percentageCoresPositive = Math.round(totalCoresPositive / totalCores * 100);
            }
            if (form.psa.value && form.prostateSize.value) {
                psaDensity = (Math.round(psa/ parseInt(form.prostateSize.value) * 100) / 100);
            }
            const maxPrimary = getMaxPrimary(cores);
            const maxSecondary = getMaxSecondary(cores);
            const maxGradeGroup = getMaxGradeGroup(cores);
            const ggFourAndFiveCount = getCountGGFourOrFive(cores);
            const maxInvolvedPercentage = getMaxInvolvedPercentage(cores);
            const maxGleasonSum = getMaxGleasonSum(cores);
            const numIntRiskFactors = calculateNumIntRiskFactors({ maxGradeGroup, clinicalStage, psa });

            setVeryHighRiskFactorsHelper({clinicalStage, ggFourAndFiveCount, maxGradeGroup, maxPrimary, psa});
            setHighRiskFactorsHelper({psa, clinicalStage, maxGradeGroup});
            setIntRiskFactorsHelper({psa, clinicalStage, maxGradeGroup});

            setFavorableIntRiskFactorsHelper({percentageCoresPositive, numIntRiskFactors, maxGradeGroup});
            setUnfavorableIntRiskFactorsHelper({percentageCoresPositive, numIntRiskFactors, maxGradeGroup});

            let risk = calculateRisk( {maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage, psa, clinicalStage });
            let capra = calculateCapra({maxPrimary, maxSecondary, percentageCoresPositive})
            if (risk === INTERMEDIATE_RISK) {
                risk = calculateIntermediateRisk({maxGradeGroup, percentageCoresPositive, psa, numIntRiskFactors});
            }
            setResult({
                corePercentagePositive : percentageCoresPositive.toString(),
                maxInvolvedPercentage : maxInvolvedPercentage.toString(),
                psaDensity : psaDensity.toString(),
                maxGleasonSum : maxGleasonSum.toString(),
                maxGradeGroup : maxGradeGroup.toString(),
                maxPrimary : maxPrimary.toString(),
                maxSecondary : maxSecondary.toString(),
                ggFourAndFiveCount : ggFourAndFiveCount.toString(),
                risk,
                capra,
            });
        }, [form, cores, calculateIntermediateRisk, calculateRisk, calculateCapra]);

    return (
        <div className="Container">
            <div className="TitleWrapper">
                <h1>Prostate Cancer Risk Nomogram</h1>

                <button
                    className="LabelIconAppFunction"
                    onClick={() => {
                        setShowInfoModal(true)
                    }}>
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <span>How is this calculated?</span>
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
                            // setShowPdf(true)
                            await calculateAnalysis()
                            setShowAnalysis(true)
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
