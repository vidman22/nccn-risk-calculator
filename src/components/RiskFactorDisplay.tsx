import React from 'react';
import {FavorableRiskFactors, HighRiskFactor, IntRiskFactor, VeryLowRiskFactor, VHighRiskFactor} from "../containers/LandingPage";
import {getRisk} from './Analysis';
import './Analysis.css';
import {HIGH_RISK, INTERMEDIATE_HIGH_RISK, INTERMEDIATE_LOW_RISK, LOW_RISK, VERY_HIGH_RISK, VERY_LOW_RISK, INTERMEDIATE_RISK} from '../data/riskConstants';

type Props = {
    intRiskFactors: IntRiskFactor;
    favorableRiskFactors: FavorableRiskFactors;
    unfavorableRiskFactors: FavorableRiskFactors;
    vHighRiskFactors: VHighRiskFactor;
    highRiskFactors: HighRiskFactor;
    lowRiskFactors: IntRiskFactor;
    veryLowRiskFactors: VeryLowRiskFactor;
    riskAssessment: string;
    capra: string;
}

const RiskFactorDisplay = ({
                               riskAssessment,
                               intRiskFactors,
                               favorableRiskFactors,
                               unfavorableRiskFactors,
                               vHighRiskFactors,
                               highRiskFactors,
                               lowRiskFactors,
                               veryLowRiskFactors,
                               capra
                           }: Props) => {
    const veryHighClasses = ['NoRisk', riskAssessment === VERY_HIGH_RISK ? 'ThisRisk' : ''];
    const highClasses = ['NoRisk', riskAssessment === HIGH_RISK ? 'ThisRisk' : ''];
    const intFavorableClasses = ['NoRisk', riskAssessment === INTERMEDIATE_LOW_RISK ? 'ThisRisk' : ''];
    const intUnfavorableClasses = ['NoRisk', riskAssessment === INTERMEDIATE_HIGH_RISK ? 'ThisRisk' : ''];
    const intClasses = ['NoRisk', riskAssessment === INTERMEDIATE_RISK ? 'ThisRisk' : ''];
    const lowRiskClasses = ['NoRisk', riskAssessment === LOW_RISK ? 'ThisRisk' : ''];
    const veryLowRiskClasses = ['NoRisk', riskAssessment === VERY_LOW_RISK ? 'ThisRisk' : ''];

    return (
        <>
            <div className='w-full flex justify-start text-xl font-medium mb-2'>Your NCCN Risk Stratification: <span className='font-normal text-gray-600 ml-2'>{getRisk(riskAssessment)}</span></div>
            <div className='flex flex-col justify-between border border-gray-800 rounded-md m-auto'>
                <div className={veryHighClasses.join(' ')}>
                    <h4 className='font-medium text-lg'>Very High Risk Factors</h4>
                    {Object.keys(vHighRiskFactors).map((k, index: number) => {
                        return (
                            <div className={vHighRiskFactors[k as keyof VHighRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "veryHigh"}>{vHighRiskFactors[k as keyof VHighRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={highClasses.join(" ")}>
                    <h4 className='font-medium text-lg'>High Risk Factors</h4>
                    {Object.keys(highRiskFactors).map((k, index: number) => {
                        return (
                            <div className={highRiskFactors[k as keyof HighRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "high"}>{highRiskFactors[k as keyof HighRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={intUnfavorableClasses.join(" ")}>
                    <h4 className='font-medium text-lg'>Unfavorable Intermediate Risk Factors</h4>
                    {Object.keys(unfavorableRiskFactors).map((k, index: number) => {
                        return (
                            <div
                                className={unfavorableRiskFactors[k as keyof FavorableRiskFactors].value ? "Factor" : "NonFactor"}
                                key={index + "unfavorable"}>{unfavorableRiskFactors[k as keyof FavorableRiskFactors].label}</div>
                        )
                    })}
                </div>
                <div className={intFavorableClasses.join(" ")}>
                    <h4 className='font-medium text-lg'>Favorable Int Risk Factors</h4>
                    {Object.keys(favorableRiskFactors).map((k, index: number) => {
                        return (
                            <div
                                className={favorableRiskFactors[k as keyof FavorableRiskFactors].value ? "Factor" : "NonFactor"}
                                key={index + "favorable"}>{favorableRiskFactors[k as keyof FavorableRiskFactors].label}</div>
                        )
                    })}
                </div>
                <div className={intClasses.join(" ")}>
                    <h4 className='font-medium text-lg'>Intermediate Risk Factors</h4>
                    {Object.keys(intRiskFactors).map((k: string, index: number) => {
                        return (
                            <div className={intRiskFactors[k as keyof IntRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "intermediate"}>{intRiskFactors[k as keyof IntRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={lowRiskClasses.join(" ")}>
                    <h4 className='font-medium text-lg'>Low Risk Factors</h4>
                    {Object.keys(lowRiskFactors).map((k: string, index: number) => {
                        return (
                            <div className={lowRiskFactors[k as keyof IntRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "low"}>{lowRiskFactors[k as keyof IntRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={veryLowRiskClasses.join(" ")}>
                    <h4 className='font-medium text-lg'>Very Low Risk Factors</h4>
                    {Object.keys(veryLowRiskFactors).map((k: string, index: number) => {
                        return (
                            <div className={veryLowRiskFactors[k as keyof VeryLowRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "verylow"}>{veryLowRiskFactors[k as keyof VeryLowRiskFactor].label}</div>
                        )
                    })}
                </div>

            </div>
        </>
    )
}

export default RiskFactorDisplay;
