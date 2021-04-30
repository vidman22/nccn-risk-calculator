import React, { useState } from 'react';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from '../../components/PlusIcon/PlusIcon';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { gradeGroupTable } from '../../data/gradeGroup';
import { CoreData, coreHeaders } from '../../data/coreData';
import './CoreDataTable.css';

type Props = {
    addCore: () => void;
    removeCore: (index: number) => void;
    setCores: (cores: CoreData[]) => void;
    setCoresValid: (bool: boolean) => void;
    coresValid: boolean;
    cores: CoreData[];
}

export default function CoreDataTable({ addCore, removeCore, setCores, cores, setCoresValid, coresValid }: Props) {
    // const [scrollPosition, setSrollPosition] = useState(0);
    const [showWarning, setShowWarning] = useState(false);

    const calculateGradeGroup = (gleasonPrimary: number, gleasonSecondary: number) => {
        if (gleasonPrimary < 3 || gleasonSecondary < 3) {
            return '0';
        }
        const gradeGroup = gradeGroupTable.find(row => (row.gleasonPrimary === gleasonPrimary && row.gleasonSecondary === gleasonSecondary));

        if (!gradeGroup) {
            return '0';
        }
        return gradeGroup.gradeGroup;
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        setShowWarning(false);
        const value = e.target.value;
        const name = e.target.name as keyof CoreData;
        const newCores = [...cores];
        const newCore = { ...newCores[index] };
        const newElement = { ...newCore[name] };
        const newValidation = { ...newElement.validation};

        newValidation.valid = true;
        newValidation.msg = "";
        newValidation.touched = true;


        newElement.value = value;
        newElement.validation = newValidation;

        newCore[name] = newElement;
        const newGleasonSum = { ...newCore.gleasonSum }
        const newGradeGroup = { ...newCore.gradeGroup }
        const newGleasonSumValidation =  {...newGleasonSum.validation};
        const newGradeGroupValidation =  {...newGradeGroup.validation};
        newGleasonSumValidation.valid = true;
        newGradeGroupValidation.valid = true;

        newGleasonSum.validation = newGleasonSumValidation;
        newGradeGroup.validation = newGradeGroupValidation;
        newGleasonSum.value = (parseInt(newCore.gleasonPrimary.value || newCore.gleasonPrimary.initialValue) + parseInt(newCore.gleasonSecondary.value || newCore.gleasonSecondary.initialValue)).toString();
        const calculatedGradeGroup = calculateGradeGroup(parseInt(newCore.gleasonPrimary.value), parseInt(newCore.gleasonSecondary.value));
        newGradeGroup.value = calculatedGradeGroup ? calculatedGradeGroup.toString() : newGradeGroup.value;

        newCore.gleasonSum = newGleasonSum;
        newCore.gradeGroup = newGradeGroup;
        newCores[index] = newCore;
        if ((name === 'gleasonPrimary' || name === 'gleasonSecondary') && (parseInt(value) > 0 && parseInt(value) < 3)) {
            setShowWarning(true);
        }
        setCoresValid(true);
        setCores(newCores);
    }

    return (
        <div className="CoreDataContainer">
            {showWarning && <span className="CoreWarning">Gleason scores less than 3 are not factored into risk</span>}
            <div className="CoreDataTitle">
                <div className="LabelIconWrapper">
                    <FontAwesomeIcon icon={faInfoCircle} />
                    <label className="FormLabel">
                        <h2>Core Data</h2>
                    </label>
                    <span>Enter only positive cores tested</span>
                </div>
            </div>
            <table className="CoreDataTable">
                <thead>
                    <tr className="TableHeader">
                        {coreHeaders.map((cr, index) => (
                            <th key={index} className="TableColLabel">
                                <div className="LabelIconWrapper">
                                    <FontAwesomeIcon icon={faInfoCircle} size={'1x'} />
                                    <label className="FormLabel">
                                        {cr.name}
                                    </label>
                                    <span>{cr.description}</span>
                                </div>
                            </th>
                        ))}
                        <th className="TableColLabel">
                        </th>
                    </tr>
                </thead>
                <tbody className="CoreDataBody">
                    {cores && cores.map((core, rowIndex) =>
                    (<tr key={rowIndex} className="CoreRow">
                        {Object.keys(core).map((k, index) => {
                            const obj = core[k as keyof CoreData];
                            return (
                                <td
                                    className={"CoreCell"}
                                    key={index + k}
                                >
                                    {obj.validation.msg && <p>{obj.validation.msg}</p>}
                                    <input
                                        className={["FormInput", (!obj.validation.valid && obj.validation.touched) && "CoreValidationError"].join(" ")}
                                        name={k}
                                        disabled={obj.disabled}
                                        min={obj.min || '0'}
                                        max={obj.max || ''}
                                        type={obj.type}
                                        placeholder={obj.placeholder}
                                        value={obj.value}
                                        onChange={(e) => handleChange(e, rowIndex)}
                                    />
                                </td>
                            )
                        })}
                        <td className="CoreCell">
                            <DeleteIcon onClick={() => removeCore(rowIndex)} icon={faMinusCircle} />
                        </td>
                    </tr>
                    ))}
                </tbody>
            </table>
            <div style={{ marginTop: "1rem" }}>
                <Icon onClick={() => addCore()} icon={faPlusCircle} />
            </div>
        </div>
    );
}
