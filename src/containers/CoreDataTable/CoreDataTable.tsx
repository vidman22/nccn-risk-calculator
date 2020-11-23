import React, { useState } from 'react';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from '../../components/PlusIcon/PlusIcon';
import ConfirmationModal from '../../components/ConfirmationModal/ConfirmationModal';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { gradeGroupTable } from '../../data/gradeGroup';
import { CoreData, coreHeaders, coreData } from '../../data/coreData';
import './CoreDataTable.css';

type Props = {
    addCore: () => void;
    removeCore: (index: number) => void;
    setCores: (cores: CoreData[]) => void;
    cores: CoreData[];
}

export default function CoreDataTable({ addCore, removeCore, setCores, cores } : Props) {
    // const [scrollPosition, setSrollPosition] = useState(0);
    const [saved, setSaved] = useState(false);
    const [ showConfirmation, setShowConfirmation ] = useState(false); 

    // const handleScroll = () => {
    //     const position = window.pageYOffset;
    //     setSrollPosition(position);
    // };

    const calculateGradeGroup = (gleasonPrimary : number, gleasonSecondary: number) => {
        if (gleasonPrimary < 3 || gleasonSecondary < 3) {
            return '0';
        }
        const gradeGroup = gradeGroupTable.find(row => (row.gleasonPrimary === gleasonPrimary && row.gleasonSecondary === gleasonSecondary));

        if (!gradeGroup) {
            return '0';
        }
        return gradeGroup.gradeGroup;
    }

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>, index : number) => {
        const value = e.target.value;
        const name = e.target.name as keyof CoreData;
        const newCores = [...cores];
        const newCore = { ...newCores[index] };
        const newElement = { ...newCore[name] };
        newElement.value = value;

        newCore[name] = newElement;
        const newGleasonSum = { ...newCore.gleasonSum }
        const newGradeGroup = { ...newCore.gradeGroup }

        newGleasonSum.value = (parseInt(newCore.gleasonPrimary.value || newCore.gleasonPrimary.initialValue) + parseInt(newCore.gleasonSecondary.value || newCore.gleasonSecondary.initialValue)).toString();
        const calculatedGradeGroup = calculateGradeGroup(parseInt(newCore.gleasonPrimary.value), parseInt(newCore.gleasonSecondary.value));
        newGradeGroup.value = calculatedGradeGroup ? calculatedGradeGroup.toString() : newGradeGroup.value;

        newCore.gleasonSum = newGleasonSum;
        newCore.gradeGroup = newGradeGroup;
        newCores[index] = newCore;

        setCores(newCores);
    }

    const clearCores = ( ) => {
        setCores([coreData]);
        localStorage.clear();
    }

    return (
        <div className="CoreDataContainer">
            <div>
                <button onClick={() => setShowConfirmation(true)}>
                    Clear All
                </button>
                <button onClick={() => {
                    localStorage.setItem("savedCores", "true" );
                    localStorage.setItem("cores", JSON.stringify(cores));
                    setSaved(true);
                    }}>
                    Save
                </button>
            </div>
            {saved && 
                <div className="FadeCopied">
                    Info saved to browser
                </div>
            }
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
                                const obj = core[k as keyof CoreData];
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
                                            min={obj.min || '0'}
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
            </div>
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
