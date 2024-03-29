import React from "react";
import { FormData } from '../../data/formData';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle } from '@fortawesome/free-solid-svg-icons';
import Tippy from '@tippyjs/react';

type Props = {
    form: FormData;
    handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

const AppForm = ({ handleChange, form }: Props) => {
    return (
        <div className='px-2'>
            <div className='w-full flex flex-wrap flex-col justify-start items-center h-40 '>
                {Object.keys(form).map((k, index) => {
                    const obj = form[k as keyof FormData];
                    if (obj.options || obj.isDate) {
                        return null
                    }
                    return (
                        <div className='relative flex flex-col w-1/2 items-start justify-center mb-4 mr-2'
                            key={index}
                        >
                            <div className='w-full flex flex-col justify-between items-start'>
                                <div className='flex items-center'>
                                    <label className='text-lg w-full'>
                                        {obj.label}
                                    </label>
                                    <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={obj.description}>
                                        <div className='ml-1'>
                                            <FontAwesomeIcon className='text-gray-400 ml-1' icon={faInfoCircle} />
                                        </div>
                                    </Tippy>
                                </div>
                                <input
                                    className='border border-gray-200 h-8 text-lg px-2 rounded-sm w-full'
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
                            {!obj.validation.valid && <div style={{ bottom: '-1.25rem' }} className='absolute text-sm font-medium text-red-500'>{obj.validation.msg}</div>}
                        </div>
                    );
                })}
            </div>
            <div className='relative flex w-full items-center justify-between'>
                <div className='flex flex-1 flex-col justify-between items-start'>
                    <div className='flex items-start justify-start'>
                        <label className='text-lg'>
                            {form.clinicalStage.label}
                        </label>
                        <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={form.clinicalStage.description}>
                            <div className='ml-1'>
                                <FontAwesomeIcon className='text-gray-400 ml-1' icon={faInfoCircle} />
                            </div>
                        </Tippy>
                    </div>
                    <select
                        className='w-40 border border-gray-200 h-8 text-lg rounded-sm'
                        name={'clinicalStage'}
                        value={form.clinicalStage.value}
                        onChange={handleChange}
                    >
                        {(form.clinicalStage.options || []).map(op => (
                            <option key={op}>
                                {op}
                            </option>
                        ))}
                    </select>
                </div>
                {!form.clinicalStage.validation.valid && <div style={{ top: '-6.25rem' }} className='absolute text-sm bg-white rounded p-4 shadow-lg font-medium text-red-500'>{form.clinicalStage.validation.msg}</div>}
                <div className='flex flex-1 flex-col justify-center items-start ml-2'>
                    <div className='flex flex-1 items-start'>
                        <label className='text-lg'>
                            Diagnosis Date
                        </label>
                        <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={'The date of diagnosis (MM-DD-YYYY)'}>
                            <div className='ml-1'>
                                <FontAwesomeIcon className='text-gray-400 ml-1' icon={faInfoCircle} />
                            </div>
                        </Tippy>
                    </div>
                    <div className='flex flex-1 justify-start items-center'>
                        {Object.keys(form).map((k, index) => {
                            const obj = form[k as keyof FormData];
                            if (obj.isDate) {
                                return (
                                    <div key={k}>
                                        <input
                                            className='border border-gray-200 h-8 text-lg px-2 rounded-sm w-20 mr-2'
                                            name={k}
                                            minLength={parseInt(obj.min)}
                                            maxLength={parseInt(obj.max)}
                                            step={obj.step || "1"}
                                            type={obj.type}
                                            placeholder={obj.placeholder}
                                            value={obj.value}
                                            onChange={handleChange}
                                        />
                                        {!obj.validation.valid && <div style={{ bottom: '-1.25rem' }} className='absolute text-sm font-medium text-red-500'>{obj.validation.msg}</div>}
                                    </div>
                                )
                            }
                            return null;
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
export default AppForm;