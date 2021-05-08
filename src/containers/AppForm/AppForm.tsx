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
        <div>
            <div className='w-full flex flex-wrap flex-col justify-start items-center h-40'>
                {Object.keys(form).map((k, index) => {
                    const obj = form[k as keyof FormData];
                    if (obj.options) {
                        return null
                    }
                    return (
                        <div className='relative flex flex-col w-1/2 items-start justify-center mb-4 mr-2'
                            key={index}
                        >
                            <div className='w-full flex flex-col justify-between items-start'>
                                <div className='flex items-center'>
                                    <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={obj.description}>
                                        <div className='mr-1'>
                                            <FontAwesomeIcon className='text-gray-400 mr-1 m' icon={faInfoCircle} />
                                        </div>
                                    </Tippy>
                                    <label className='text-lg w-full'>
                                        {obj.label}
                                    </label>
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
            <div className='relative flex flex-col w-full items-center justify-center'>
                <div className='w-full flex flex-col justify-between items-start'>
                    <div className='flex items-center'>
                        <Tippy className='bg-gray-400 text-white rounded-md px-2 cursor-pointer' content={form.clinicalStage.description}>
                            <div className='mr-1'>
                                <FontAwesomeIcon className='text-gray-400 mr-1 m' icon={faInfoCircle} />
                            </div>
                        </Tippy>
                        <label className='text-lg w-full'>
                            {form.clinicalStage.label}
                        </label>
                    </div>
                    <select
                        className='w-full border border-gray-200 h-8 text-lg rounded-sm ml-1'
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
                {!form.clinicalStage.validation.valid && <div style={{ bottom: '-1.25rem' }} className='absolute text-sm font-medium text-red-500'>{form.clinicalStage.validation.msg}</div>}
            </div>
        </div>
    );
}
export default AppForm;