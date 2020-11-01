import React, { useState } from "react";
import Analysis from '../../components/Analysis';
import CoreDataTable from '../CoreDataTable/CoreDataTable';
import { coreData } from '../../data/coreData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { formData } from '../../data/formData';
import {
    HIGH_RISK,
    VERY_HIGH_RISK,
    LOW_RISK,
    INTERMEDIATE_RISK,
    INTERMEDIATE_HIGH_RISK,
    INTERMEDIATE_LOW_RISK,
    VERY_LOW_RISK
} from '../../data/riskConstants';
import './AppForm.css';

export default function AppForm() {
    const [form, setForm] = useState(formData);
    const [result, setResult] = useState({
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

    const removeCore = (index) => {
        if (cores.length < 2) {
            return;
        }
        const newCores = [...cores];
        newCores.splice(index, 1);
        setCores(newCores);
    }

    const handleChange = (e) => {
        const value = e.target.value;
        const name = e.target.name;
        const newForm = { ...form };
        const newElement = newForm[name];
        newElement.value = value;
        newForm[name] = newElement;

        setForm(newForm);
    };

    const handleClick = () => {

        const newForm = { ...form };
        for (let key in newForm) {
            const newElement = newForm[key];
            newElement.value = newElement.initialValue;
            newForm[key] = newElement;
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
    }

    const handleSubmit = (e) => {

        e.preventDefault();
        let corePercentagePositive = 'NA';
        let psaDensity = 'NA';
        const totalCoresPositive = getTotalCoresPositive();
        const totalCores = cores.length;

        if (totalCores && totalCoresPositive) {
            corePercentagePositive = Math.round(totalCoresPositive / totalCores * 100);
        }
        if (form.psa.value && form.prostateSize.value) {
            psaDensity = Math.round(form.psa.value / form.prostateSize.value * 100) / 100;
        }

        const maxPrimary = getMaxPrimary();

        const maxSecondary = getMaxSecondary();

        const maxGradeGroup = getMaxGradeGroup();

        const ggFourAndFiveCount = getCountGGFourOrFive();

        const maxInvolvedPercentage = getMaxInvolvedPercentage();

        const maxGleasonSum = getMaxGleasonSum();


        let risk = calculateRisk(maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage);

        if (risk === INTERMEDIATE_RISK) {
            risk = calculateIntermediateRisk(maxGradeGroup);
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
    };


    const getTotalCoresPositive = () => {
        let count = 0;

        cores.forEach(cr => {
            if (cr.percentageInvolved.value > 0) {
                count++;
            }
        })
        return count;
    }


    const getCountGGFourOrFive = () => {
        let count = 0;

        cores.forEach(cr => {
            if (cr.gradeGroup.value > 3) {
                count++;
            }
        })

        return count;

    }

    const getMaxGradeGroup = () => {
        let maxGG = 0;

        cores.forEach(cr => {
            if (cr.gradeGroup.value > maxGG) {
                maxGG = cr.gradeGroup.value
            }
        })

        return maxGG;

    };

    const getMaxGleasonSum = () => {
        let maxGS = 0;

        cores.forEach(cr => {
            if (cr.gleasonSum.value > maxGS) {
                maxGS = cr.gleasonSum.value
            }
        })

        return maxGS;
    }

    const getMaxPrimary = () => {
        let maxPrimary = 0;

        cores.forEach(cr => {
            if (cr.gleasonPrimary.value > maxPrimary) {
                maxPrimary = cr.gleasonPrimary.value
            }
        })

        return maxPrimary;
    }

    const getMaxSecondary = () => {
        let maxSecondary = 0;

        cores.forEach(cr => {
            if (cr.gleasonSecondary.value > maxSecondary) {
                maxSecondary = cr.gleasonSecondary.value
            }
        })

        return maxSecondary;
    }

    const getMaxInvolvedPercentage = () => {
        let maxInvolvedPercentage = 0;
        cores.forEach(cr => {
            if (cr.percentageInvolved.value > maxInvolvedPercentage) {
                maxInvolvedPercentage = cr.percentageInvolved.value
            }
        })

        return maxInvolvedPercentage || 'NA';
    }

    const calculateIntermediateRisk = (maxGradeGroup) => {
        const clinicalStage = form.clinicalStage.value;
        const psa = form.psa.value;

        if (clinicalStage === 'T2b' || clinicalStage === 'T2c' || maxGradeGroup == 3 || psa >= 10) {
            return INTERMEDIATE_HIGH_RISK;
        }

        if (maxGradeGroup > 1) {
            return INTERMEDIATE_LOW_RISK;
        }
    }

    const calculateRisk = (maxPrimary, maxGradeGroup, ggFourAndFiveCount, psaDensity, maxInvolvedPercentage) => {

        //'T1c', 'T1', 'T2a', 'T2b', 'T2c', 'T3a', 'T3b', 'T4';

        const clinicalStage = form.clinicalStage.value;
        const psa = form.psa.value;

        if (maxPrimary == 5 || ggFourAndFiveCount >= 4 || clinicalStage === 'T3b' || clinicalStage === 'T4') {
            return VERY_HIGH_RISK;
        };

        //This means at least two of the three high risk factors that should bump it to very high risk
        if ((psa >= 20 && (clinicalStage === 'T3a' || maxGradeGroup > 3)) || ((psa >= 20 || clinicalStage === 'T3a') && maxGradeGroup > 3) || (clinicalStage === 'T3a' && (psa >= 20 || maxGradeGroup > 3)) ) {
            return VERY_HIGH_RISK;
        }

        if (psa >= 20 || clinicalStage === 'T3a' || maxGradeGroup > 3) {

            return HIGH_RISK;
        }
        //this means if they have a clinical stage above T1 and T2a
        if (psa >= 10 || maxGradeGroup > 1 || clinicalStage === 'T2b' || clinicalStage === 'T2c' || clinicalStage === 'T3a' || clinicalStage === 'T3b' || clinicalStage === 'T4') {
            return INTERMEDIATE_RISK;
        }
        //the clinical stages are the only ones possible for low risk
        if (psaDensity < 0.15 || cores.length >= 3 || maxInvolvedPercentage > 50 || clinicalStage === 'T1' || clinicalStage === 'T2a') {

            return LOW_RISK;
        }

        //basically if the clinical stage is T1c
        return VERY_LOW_RISK;

    }

    return (
        <div className="Container">
            <h1>NCCN Score Calculator</h1>
            <div className="AppFormContainer">
                <form
                    onSubmit={handleSubmit}
                >
                    <div className="ListWrapper">
                        {Object.keys(form).map((k, index) => {
                            const obj = form[k];
                            if (obj.type === 'select') {
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
                    <div className="AnotherWrapper">

                        <div className="ButtonWrapper">
                            <button
                                type="button"
                                onClick={handleClick}
                                className="ClearButton"
                            >Clear</button>
                            <button
                                type="submit"
                                className="SubmitButton"
                            >Submit</button>
                        </div>
                    </div>
                </form>
                {result.psaDensity && (
                    <Analysis result={result} />
                )}
            </div>
            <CoreDataTable
                addCore={addCore}
                setCores={setCores}
                removeCore={removeCore}
                cores={cores}
            />
        </div>
    );
}
