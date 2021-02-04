import React, {useCallback, useEffect, useState} from "react";
import {useLocation} from 'react-router-dom';
import CoreDataTable from '../CoreDataTable/CoreDataTable';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import AnalysisModal from '../../components/AnalysisModal/AnalysisModal';
import InfoModal from '../../components/InfoModal/InfoModal';
// import {PDFViewer} from '@react-pdf/renderer';
// import PDFDocument from "../PDFDocument/PDFDocument";
import {coreData} from '../../data/coreData';
import {formData, FormData} from '../../data/formData';
import {
    HIGH_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    INTERMEDIATE_RISK,
    LOW_RISK,
    VERY_HIGH_RISK,
    VERY_LOW_RISK
} from '../../data/riskConstants';
import {Result} from '../../components/Analysis';
import {parseForm, parseParams} from "../../helpers";
import './AppForm.css';

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

export default function AppForm() {
    const query = new URLSearchParams(useLocation().search);
    const [saved, setSaved] = useState(false);
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [showAnalysis, setShowAnalysis] = useState(false);
    const [showInfoModal, setShowInfoModal] = useState(false);
    const [form, setForm] = useState(formData);

    const [intRiskFactors, setIntRiskFactors] = useState<IntRiskFactor>({
        stage: {label: "Stage T2b-T2c", value: false},
        gradeGroup: {label: "Grade Group 2 or 3", value: false},
        psa: {label: "PSA 10-20 ng/ml", value: false},
    });

    const [unfavorableRiskFactors, setUnfavorableRiskFactors] = useState<FavorableRiskFactors>({
        fiftyPercentCoresPositive: {label: "50% or more of biopsy cores positive", value: false},
        riskFactorNumber: {label: "Has 2 or 3 Int Risk Factors", value: false},
        gradeGroup: {label: "Grade Group 3", value: false},
    });

    const [favorableRiskFactors, setFavorableRiskFactors] = useState<FavorableRiskFactors>({
        fiftyPercentCoresPositive: {label: "Less than 50% of biopsy cores positive", value: false},
        riskFactorNumber: {label: "Has 1 Int Risk Factor", value: false},
        gradeGroup: {label: "Grade Group 1 or 2", value: false},
    });

    const [highRiskFactors, setHighRiskFactors] = useState<HighRiskFactor>({
        stage: {label: "Stage T3a", value: false},
        gradeGroup: {label: "Grade Group 4 or 5", value: false},
        psa: {label: "PSA is greater than 20 ng/ml", value: false},
    });

    const [vHighRiskFactors, setVHighRiskFactors] = useState<VHighRiskFactor>({
        stage: {label: "Stage T3b - T4", value: false},
        gradeGroup: {label: "More than 4 cores with Grade Group 4 or 5", value: false},
        gleason: {label: "Primary Gleason has pattern 5", value: false},
        highRiskFactors: {label: "Has 2-3 high risk factors", value: false},
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
        const newForm = {...form};
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
        const newForm = {...form};
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
            const psa = parseFloat(form.psa.value);

            const newIRF = {...intRiskFactors};
            const newUF = {...unfavorableRiskFactors};
            const newF = {...favorableRiskFactors};

            // At this stage we've already determined that the patient has at least one of the intermediate risk factors
            // We can check for the high risk factors exceeding 2-3 IRFs but don't need to check the number int risk factors
            // for favorable intermediate risk

            let numRF = 0;

            if (maxGradeGroup === 3 || maxGradeGroup === 2) {
                numRF++
            }
            if (clinicalStage === 'T2b' || clinicalStage === 'T2c') {
                numRF++
            }
            if (psa >= 10) {
                numRF++
            }

            const percentageCoresPositive = Math.floor((getTotalCoresPositive()) / cores.length)
            if (clinicalStage === 'T2b' || clinicalStage === 'T2c' || maxGradeGroup === 3 || psa >= 10 || percentageCoresPositive > 50 || numRF >= 2) {
                const newPer = {...newUF.fiftyPercentCoresPositive};
                const newGG = {...newUF.gradeGroup};
                const newRF = {...newUF.riskFactorNumber}

                newPer.value = percentageCoresPositive > 50;
                newGG.value = maxGradeGroup === 3;
                newRF.value = numRF >= 2;

                newUF.riskFactorNumber = newRF;
                newUF.gradeGroup = newGG;
                newUF.fiftyPercentCoresPositive = newPer;

                setUnfavorableRiskFactors(newUF)
                setIntRiskFactors(newIRF);

                return INTERMEDIATE_HIGH_RISK;
            }

            if (maxGradeGroup >= 2 && percentageCoresPositive < 50) {
                const newPer = {...newF.fiftyPercentCoresPositive};
                const newGG = {...newF.gradeGroup};
                const newRF = {...newF.riskFactorNumber};

                newPer.value = percentageCoresPositive > 50;
                newGG.value = maxGradeGroup === 1 || maxGradeGroup === 2;
                newRF.value = numRF === 1;

                newF.riskFactorNumber = newRF;
                newF.gradeGroup = newGG;
                newF.fiftyPercentCoresPositive = newPer;

                setFavorableRiskFactors(newF)
                setIntRiskFactors(newIRF);

                return INTERMEDIATE_LOW_RISK;
            }
            return 'x';
        },
        [form, cores, getTotalCoresPositive, favorableRiskFactors, intRiskFactors, unfavorableRiskFactors])

    const calculateRisk = useCallback(
        (maxPrimary: string, maxGradeGroup: string, ggFourAndFiveCount: string, psaDensity: string, maxInvolvedPercentage: string) => {

            let intMaxPrimary = parseInt(maxPrimary);
            let intMaxGradeGroup = parseInt(maxGradeGroup);
            let intGGFourAndFiveCount = parseInt(ggFourAndFiveCount);
            let intPSADensity = parseInt(psaDensity);
            let intMaxInvolvedPercentage = parseInt(maxInvolvedPercentage);
            //'T1c', 'T1', 'T2a', 'T2b', 'T2c', 'T3a', 'T3b', 'T4';

            const clinicalStage = form.clinicalStage.value;
            const psa = parseFloat(form.psa.value);
            const newVHRF = {...vHighRiskFactors};
            const newHRF = {...highRiskFactors};
            const newIRF = {...intRiskFactors};

            let risk = '';
            if (intMaxPrimary === 5 || intGGFourAndFiveCount > 4 || clinicalStage === 'T3b' || clinicalStage === 'T4') {
                const newGG = {...newVHRF.gradeGroup}
                const newStage = {...newVHRF.stage}
                const newGleason = {...newVHRF.gleason}

                newStage.value = clinicalStage === 'T3b' || clinicalStage === 'T4';
                newGG.value = intGGFourAndFiveCount >= 4;
                newGleason.value = intMaxPrimary === 5;

                newVHRF.gradeGroup = newGG;
                newVHRF.stage = newStage;
                newVHRF.gleason = newGleason;

                setVHighRiskFactors(newVHRF);
                risk = VERY_HIGH_RISK;
            }
            // This means at least two of the three high risk factors that should bump it to very high risk
            if ((psa > 20 && (clinicalStage === 'T3a' || intMaxGradeGroup > 3)) || ((psa > 20 || clinicalStage === 'T3a') && intMaxGradeGroup > 3) || (clinicalStage === 'T3a' && (psa > 20 || intMaxGradeGroup > 3))) {
                const newRF = {...newVHRF.highRiskFactors};

                newRF.value = true;

                newVHRF.highRiskFactors = newRF;

                setVHighRiskFactors(newVHRF);
                if (!risk) {
                    risk = VERY_HIGH_RISK;
                }
            }
            if (psa > 20 || clinicalStage === 'T3a' || intMaxGradeGroup > 3) {
                const newPSA = {...newHRF.psa};
                const newStage = {...newHRF.stage};
                const newGG = {...newHRF.gradeGroup};

                newPSA.value = psa > 20;
                newStage.value = clinicalStage === 'T3a';
                newGG.value = intMaxGradeGroup > 3;

                newHRF.psa = newPSA;
                newHRF.gradeGroup = newGG;
                newHRF.stage = newStage;

                setHighRiskFactors(newHRF);
                if (!risk) {
                    risk = HIGH_RISK;
                }
            }
            //this means if they have a clinical stage above T1 and T2a
            if (psa >= 10 || intMaxGradeGroup > 1 || clinicalStage === 'T2b' || clinicalStage === 'T2c' || clinicalStage === 'T3a' || clinicalStage === 'T3b' || clinicalStage === 'T4') {
                const newPSA = {...newIRF.psa};
                const newStage = {...newIRF.stage};
                const newGradeGroup = {...newIRF.gradeGroup};

                newPSA.value = psa >= 10;
                newStage.value = clinicalStage === 'T2b' || clinicalStage === 'T2c';
                newGradeGroup.value = intMaxGradeGroup > 1;

                newIRF.psa = newPSA;
                newIRF.stage = newStage;
                newIRF.gradeGroup = newGradeGroup;

                setIntRiskFactors(newIRF);
                if (!risk) {
                    risk = INTERMEDIATE_RISK;
                }
            }
            //the clinical stages are the only ones possible for low risk
            if (intPSADensity < 0.15 || cores.length >= 3 || intMaxInvolvedPercentage > 50 || clinicalStage === 'T1' || clinicalStage === 'T2a') {
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
        (maxPrimary: string, maxSecondary: string, corePercentagePositive: string) => {

            let intMaxPrimary = parseInt(maxPrimary);
            let inMaxSecondary = parseInt(maxSecondary);
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
            if (intMaxPrimary > 3) {
                capra += 3
            } else if (inMaxSecondary > 3) {
                capra++
            }
            if (clinicalStage === 'T3a' || clinicalStage === 'T3b') {
                capra++
            }
            if (parseInt(corePercentagePositive) >= 34) {
                capra++
            }
            return capra.toString()
        }
        , [form])


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
                psaDensity = (Math.round(parseFloat(form.psa.value) / parseInt(form.prostateSize.value) * 100) / 100).toString();
            }
            const maxPrimary = getMaxPrimary();
            const maxSecondary = getMaxSecondary();
            const maxGradeGroup = getMaxGradeGroup();
            const ggFourAndFiveCount = getCountGGFourOrFive();
            const maxInvolvedPercentage = getMaxInvolvedPercentage();
            const maxGleasonSum = getMaxGleasonSum();
            let risk = calculateRisk(maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage);
            let capra = calculateCapra(maxPrimary, maxSecondary, corePercentagePositive)
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
                capra,
            });
        }, [form, cores,calculateIntermediateRisk, calculateRisk, getMaxPrimary, getMaxSecondary, getMaxGleasonSum, getCountGGFourOrFive, getMaxGradeGroup, getMaxInvolvedPercentage, getTotalCoresPositive, calculateCapra]);

    // useEffect(() => {
    //     calculateAnalysis()
    // }, [calculateAnalysis])

    return (
        <div className="Container">
            <div className="TitleWrapper">
                <h1>NCCN Risk Nomogram</h1>

                <button
                    className="LabelIconAppFunction"
                    onClick={() => {
                        setShowInfoModal(true)
                    }}>
                    <FontAwesomeIcon icon={faInfoCircle}/>
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
                                        <FontAwesomeIcon icon={faInfoCircle}/>
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
                                    <FontAwesomeIcon icon={faInfoCircle}/>
                                    <label className="FormLabel">
                                        {obj.label}
                                    </label>
                                    <span>{obj.description}</span>
                                </div>
                                <input
                                    className="FormInput"
                                    style={{width: "80px"}}
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
                        onClick={() => {
                            // setShowPdf(true)
                            calculateAnalysis()
                            setShowAnalysis(true)
                        }}
                        type="button"
                        className="ButtonAppFunction"
                        style={{backgroundColor: "#0858B8", color: "#fff"}}
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
