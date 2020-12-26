import React from 'react';
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
    cores: CoreData[];
}

export default function CoreDataTable({ addCore, removeCore, setCores, cores }: Props) {
    // const [scrollPosition, setSrollPosition] = useState(0);

    // const handleScroll = () => {
    //     const position = window.pageYOffset;
    //     setSrollPosition(position);
    // };

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

    return (
        <div className="CoreDataContainer">
            <div className="LabelIconWrapper CoreDataHeader">
                <FontAwesomeIcon icon={faInfoCircle} />
                <label className="FormLabel">
                    <h2>Core Data</h2>
                </label>
                <span>Enter all cores tested, even the negative ones</span>
            </div>
            <table className="CoreDataTable">
                <thead>
                    <tr className="TableHeader">
                        {coreHeaders.map((cr, index) => (
                            <th key={index} className="TableColLabel">
                                <div className="LabelIconWrapper">
                                    <FontAwesomeIcon icon={faInfoCircle} />
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
                        <td className="CoreCell">
                            <p>{rowIndex + 1}</p>
                        </td>
                        {Object.keys(core).map((k, index) => {
                            const obj = core[k as keyof CoreData];
                            return (
                                <td
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
            <div>
                <Icon onClick={() => addCore()} icon={faPlusCircle} />
            </div>
        </div>
    );
}
