import React, { useState, useEffect } from 'react';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from '../../components/PlusIcon/PlusIcon';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import './CoreDataTable.css';
import { gradeGroupTable } from '../../data/gradeGroup';
import { coreHeaders } from '../../data/coreData';

export default function CoreDataTable({ addCore, removeCore, setCores, cores }) {
    const [scrollPosition, setSrollPosition] = useState(0);

    // const clearCores = () => {
    //     setCores([coreData])
    // }

    const handleScroll = () => {
        const position = window.pageYOffset;
        setSrollPosition(position);
    };

    const calculateGradeGroup = (gleasonPrimary, gleasonSecondary) => {
        const gradeGroup = gradeGroupTable.find(row => (row.gleasonPrimary === gleasonPrimary && row.gleasonSecondary === gleasonSecondary));

        if (!gradeGroup) {
            return;
        }
        return gradeGroup.gradeGroup;
    }

    const handleChange = (e, index) => {
        const value = e.target.value;
        const name = e.target.name;
        const newCores = [...cores];
        const newCore = { ...newCores[index] };
        const newElement = { ...newCore[name] };
        newElement.value = newElement.type === "number" ? parseInt(value) : value;
        newCore[name] = newElement;
        const newGleasonSum = { ...newCore.gleasonSum }
        const newGradeGroup = { ...newCore.gradeGroup }

        newGleasonSum.value = newCore.gleasonPrimary.value + newCore.gleasonSecondary.value;
        const calculatedGradeGroup = calculateGradeGroup(newCore.gleasonPrimary.value, newCore.gleasonSecondary.value);
        newGradeGroup.value = calculatedGradeGroup ? calculatedGradeGroup : newGradeGroup.value;

        newCore.gleasonSum = newGleasonSum;
        newCore.gradeGroup = newGradeGroup;
        newCores[index] = newCore;

        setCores(newCores);
    }

    useEffect(() => {
        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);

    return (
        <div className="CoreDataContainer">
            <div className="LabelIconWrapper CoreDataHeader">
                <FontAwesomeIcon icon={faInfoCircle} />
                <label className="FormLabel">
                    <h2>Core Data</h2>
                </label>
                <span>Enter all cores tested, even the negative ones</span>
            </div>
            <div className="CoreDataTable">
                <div
                    // style={scrollPosition > 200 ? { position: 'fixed', top: 0, width: '1200px' } : {}}
                    className="TableHeader">
                    {coreHeaders.map((cr, index) => (
                        <div key={index} className="TableColLabel">
                            <div className="LabelIconWrapper">
                                <FontAwesomeIcon icon={faInfoCircle} />
                                <label className="FormLabel">
                                    {cr.name}
                                </label>
                                <span>{cr.description}</span>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="CoreDataBody">
                    {cores && cores.map((core, rowIndex) =>
                        (<div key={rowIndex} className="CoreRow">
                            <div style={{ width: '12%' }} className="CoreCell">
                                <p>{rowIndex + 1}</p>
                            </div>
                            {Object.keys(core).map((k, index) => {
                                const obj = core[k];
                                return (
                                    <div
                                        style={{ width: '12%' }}
                                        className="CoreCell"
                                        key={index + k}
                                    >
                                        <input
                                            className="FormInput"
                                            name={k}
                                            disabled={obj.disabled}
                                            min={obj.min || ''}
                                            max={obj.max || ''}
                                            type={obj.type}
                                            placeholder={obj.placeholder}
                                            value={obj.value}
                                            onChange={(e) => handleChange(e, rowIndex)}
                                        />
                                    </div>
                                )
                            })}
                            <DeleteIcon onClick={() => removeCore(rowIndex)} icon={faMinusCircle} />
                        </div>
                        ))}
                </div>
                <div>
                    <Icon onClick={() => addCore()} icon={faPlusCircle} />
                </div>
                {/* <button
                        type="button"
                        onClick={clearCores}
                        className="ClearButton"
                    >Clear All</button> */}
            </div>
        </div>
    );
}
