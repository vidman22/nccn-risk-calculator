import React, { useState, useEffect } from 'react';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from '../../components/PlusIcon/PlusIcon';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import './CoreDataTable.css';
import { gradeGroupTable } from '../../data/gradeGroup';

export default function CoreDataTable({addCore, removeCore, setCores, cores}) {
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
            <h2>Positive Core Data</h2>
            <div className="CoreDataTable">
                <div
                    style={scrollPosition > 200 ? { position: 'fixed', top: 0, width: '1200px' } : {}}
                    className="TableHeader">
                    <div className="TableColLabel">
                        <p>Index</p>
                    </div>
                    <div className="TableColLabel">
                        <p>Core ID</p>
                    </div>
                    <div className="TableColLabel">
                        <p>Length</p>
                    </div>
                    <div className="TableColLabel">
                        <p>% Involved</p>
                    </div>
                    <div className="TableColLabel">
                        <p>Primary</p>
                    </div>
                    <div className="TableColLabel">
                        <p>Secondary</p>
                    </div>
                    <div className="TableColLabel">
                        <p>Sum</p>
                    </div>
                    <div className="TableColLabel">
                        <p>Grade Group</p>
                    </div>
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
