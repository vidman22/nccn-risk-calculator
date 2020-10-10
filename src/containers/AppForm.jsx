import React, { useState } from "react";
import Analysis from '../components/Analysis';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import { defaultValue } from './FormDefault';
import './AppForm.css';

export default function AppForm() {
    const [form, setForm] = useState(defaultValue);
    const [result, setResult ] = useState({
        gleasonSum: '',
        psaDensity: '',
        corePercentagePositive: '',
    });

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
        for (let key in newForm){
            const newElement = newForm[key];
            newElement.value = newElement.initialValue;
            newForm[key] = newElement;
        }
        setForm(newForm);
        setResult({
            gleasonSum: '',
            psaDensity: '',
            corePercentagePositive: '',
        });
    }

    const handleSubmit = (e) =>{
        e.preventDefault();
        let corePercentagePositive = 'NA';
        let gleasonSum = 'NA';
        let psaDensity = 'NA';
        if (form.coresPositive.value && form.totalCores.value){
            corePercentagePositive = Math.round(form.coresPositive.value/form.totalCores.value * 100);
        }
        if (form.gleasonPrimary.value && form.gleasonSecondary.value){
            gleasonSum = form.gleasonPrimary.value + form.gleasonSecondary.value;
        }
        if (form.psa.value && form.prostateSize.value){
            psaDensity = Math.round(form.psa.value/form.prostateSize.value * 100);
        }
        setResult({
            corePercentagePositive,
            gleasonSum,
            psaDensity,
        });
    }

    return (
        <div className="Container">
            <h1>NCCN Score Calculator</h1>
            <div className="AppFormContainer">
                <form 
                    onSubmit={handleSubmit}
                    className="ListWrapper">

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
                                    name={k}
                                    min={obj.min || ''}
                                    max={obj.max || ''}
                                    type={obj.type}
                                    placeholder={obj.placeholder}
                                    value={obj.value}
                                    onChange={handleChange}
                                />
                            </div>
                        );
                    })}
                    <div className="InputWrapper">
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


                </form>
                {result.psaDensity && (
                    <Analysis result={result} />
                )}
            </div>
        </div>
    );
}
