import React, { useState } from 'react';
import { faPlusCircle, faMinusCircle } from '@fortawesome/free-solid-svg-icons';
import Icon from '../../components/PlusIcon/PlusIcon';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import DeleteIcon from '../../components/DeleteIcon/DeleteIcon';
import { gradeGroupTable } from '../../data/gradeGroup';
import { CoreData, coreHeaders } from '../../data/coreData';
import Tippy from '@tippyjs/react';

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
        const newValidation = { ...newElement.validation };

        newValidation.valid = true;
        newValidation.msg = "";
        newValidation.touched = true;


        newElement.value = value;
        newElement.validation = newValidation;

        newCore[name] = newElement;
        const newGleasonSum = { ...newCore.gleasonSum }
        const newGradeGroup = { ...newCore.gradeGroup }
        const newGleasonSumValidation = { ...newGleasonSum.validation };
        const newGradeGroupValidation = { ...newGradeGroup.validation };
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
        <div className='relative'>
            {showWarning && <span style={{ right: 0 }} className='absolute text-red-500 border-2 rounded px-2 border-red-400'>Gleason scores less than 3 are not factored into risk</span>}
            <div className='flex items-center my-2'>
                <h2 className='text-2xl font-medium'>Core Data</h2>
                <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content='Enter only positive cores tested'>
                    <div className='ml-1'>
                        <FontAwesomeIcon className='text-gray-400 ml-1' icon={faInfoCircle} />
                    </div>
                </Tippy>
            </div>
            <div className="flex flex-col w-full">
                <div className='flex w-full'>
                    {coreHeaders.map((cr, index) => (
                        <div key={index} className='flex items-center font-medium text-left truncate w-32 mr-2'>
                            <p className='truncate'>{cr.name}</p>
                            <Tippy content={cr.description} className='bg-gray-400 text-white rounded-md px-2 cursor-pointer'>
                                <div className='ml-1'>
                                    <FontAwesomeIcon className='text-gray-400 ml-1 hidden md:block' icon={faInfoCircle} />
                                </div>
                            </Tippy>
                        </div>
                    ))}
                    <div className='w-12'>
                    </div>
                </div>
                <div className='flex flex-col w-full'>
                    {cores && cores.map((core, rowIndex) =>
                    (<div key={rowIndex} className='flex w-full mt-4 items-center'>
                        {Object.keys(core).map((k, index) => {
                            const obj = core[k as keyof CoreData];
                            return (
                                <div
                                    className='relative w-32 mr-2'
                                    key={index + k}
                                >
                                    {obj.validation.msg && <p style={{ bottom: '-1.25rem' }} className='absolute text-red-500'>{obj.validation.msg}</p>}
                                    <input
                                        className='h-8 px-2 text-lg border border-gray-200 rounded-sm w-full'
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
                        <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={'Remove'}>
                            <div className='w-12'>
                                <DeleteIcon onClick={() => removeCore(rowIndex)} icon={faMinusCircle} />
                            </div>
                        </Tippy>
                    </div>
                    ))}
                </div>
            </div>
            <div className='w-full flex justify-center mt-3'>
                <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={'Add a new core'}>
                    <div>
                        <Icon onClick={() => addCore()} icon={faPlusCircle} className='h-12 w-12' />
                    </div>
                </Tippy>
            </div>
        </div>
    );
}
