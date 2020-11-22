import React, { useState, useEffect } from "react";
import {
    Link,
    useParams,
    useLocation
} from 'react-router-dom';
import { generatePath } from 'react-router';
import Analysis from '../../components/Analysis';
import CoreDataTable from '../CoreDataTable/CoreDataTable';
import { CoreData, coreData } from '../../data/coreData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
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

import { coreDataToFile } from '../../helpers';
import './AppForm.css';

function useQuery() {
    return new URLSearchParams(useLocation().search);
  }

export default function AppForm() {
    const query = useQuery();
    const [form, setForm] = useState(formData);
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
        query.forEach((value, key) => {
            console.log("value and key", key, value);
        });
      return () => {
        
      };
    }, [query])

    const removeCore = (index: number) => {
        if (cores.length < 2) {
            return;
        }
        const newCores = [...cores];
        newCores.splice(index, 1);
        setCores(newCores);
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

    const handleClick = () => {

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
    }

    const generateUrl = () => {
        
    }

    const handleSubmit = (e : React.FormEvent<HTMLFormElement> ) => {
        e.preventDefault();
        coreDataToFile(cores);

        // const pattern = cores.flatMap((core, index) => {
        //     const keys = Object.keys(core);
        //     return keys.join(`/:${index}`);
        // }).reduce((acc, value, ind, arr) => {
        //     return arr.join(`/:${ind}`)
        // });
        let pattern = '';
        cores.forEach((core, index) => {
            Object.keys(core).forEach((key, ind) => {
                //remove the final ampersand
                if (Object.keys(core).length === ind + 1 && cores.length === index + 1){
                    pattern = pattern + `${index}${key}=${core[key as keyof CoreData].value}`;
                } else {
                    pattern = pattern + `${index}${key}=${core[key as keyof CoreData].value}&`;
                }
            })
        })
        // console.log("pattern", pattern.join("/:"));
        console.log("pattern", pattern);
        const paramObj = {};
        cores.flatMap((core, index) => {
            return Object.keys(core).map(key => ({[index + key]: (core[key as keyof CoreData].value || "0" )}))
        }).forEach(value => {
            Object.assign(paramObj, value);
        });
        const path = generatePath(pattern, paramObj);
        console.log("path", path);
        let corePercentagePositive = 'NA';
        let psaDensity = 'NA';
        const totalCoresPositive = getTotalCoresPositive();
        const totalCores = cores.length;

        if (totalCores && totalCoresPositive) {
            corePercentagePositive = Math.round(totalCoresPositive / totalCores * 100).toString();
        }
        if (form.psa.value && form.prostateSize.value) {
            psaDensity = (Math.round( parseInt(form.psa.value) / parseInt(form.prostateSize.value) * 100) / 100).toString();
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
    };


    const getTotalCoresPositive = () => {
        let count = 0;

        cores.forEach(cr => {
            if ( parseInt(cr.percentageInvolved.value) > 0) {
                count++;
            }
        })
        return count;
    }


    const getCountGGFourOrFive = () => {
        let count = 0;

        cores.forEach(cr => {
            if (parseInt(cr.gradeGroup.value) > 3) {
                count++;
            }
        })

        return count.toString();

    }

    const getMaxGradeGroup = () => {
        let maxGG = "0";

        cores.forEach(cr => {
            if ( parseInt(cr.gradeGroup.value) > parseInt(maxGG)) {
                maxGG = cr.gradeGroup.value
            }
        })
        return maxGG;
    };

    const getMaxGleasonSum = () => {
        let maxGS = "0";

        cores.forEach(cr => {
            if (parseInt(cr.gleasonSum.value) > parseInt(maxGS)) {
                maxGS = cr.gleasonSum.value
            }
        })

        return maxGS;
    }

    const getMaxPrimary = () => {
        let maxPrimary = "0";

        cores.forEach(cr => {
            if (parseInt(cr.gleasonPrimary.value) > parseInt(maxPrimary)) {
                maxPrimary = cr.gleasonPrimary.value
            }
        })

        return maxPrimary;
    }

    const getMaxSecondary = () => {
        let maxSecondary = "0";

        cores.forEach(cr => {
            if (parseInt(cr.gleasonSecondary.value) > parseInt(maxSecondary)) {
                maxSecondary = cr.gleasonSecondary.value
            }
        })

        return maxSecondary;
    }

    const getMaxInvolvedPercentage = () => {
        let maxInvolvedPercentage = "0";
        cores.forEach(cr => {
            if (parseInt(cr.percentageInvolved.value) > parseInt(maxInvolvedPercentage)) {
                maxInvolvedPercentage = cr.percentageInvolved.value
            }
        })

        return maxInvolvedPercentage || 'NA';
    }

    const calculateIntermediateRisk = (maxGradeGroup: number) => {
        const clinicalStage = form.clinicalStage.value;
        const psa = parseInt(form.psa.value);

        if (clinicalStage === 'T2b' || clinicalStage === 'T2c' || maxGradeGroup === 3 || psa >= 10) {
            return INTERMEDIATE_HIGH_RISK;
        }

        if (maxGradeGroup > 1) {
            return INTERMEDIATE_LOW_RISK;
        }
        return '';
    }

    const calculateRisk = (maxPrimary: string, maxGradeGroup: string, ggFourAndFiveCount: string, psaDensity: string, maxInvolvedPercentage : string) => {

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
        if ((psa >= 20 && (clinicalStage === 'T3a' || intMaxGradeGroup > 3)) || ((psa >= 20 || clinicalStage === 'T3a') && intMaxGradeGroup > 3) || (clinicalStage === 'T3a' && (psa >= 20 || intMaxGradeGroup > 3)) ) {
            return VERY_HIGH_RISK;
        }

        if (psa >= 20 || clinicalStage === 'T3a' || intMaxGradeGroup > 3) {

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

    return (
        <div className="Container">
            <h1>NCCN Score Calculator</h1>
            <div className="AppFormContainer">
                <form
                    onSubmit={handleSubmit}
                >
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