import React from 'react';
import {FavorableRiskFactors, HighRiskFactor, IntRiskFactor, VeryLowRiskFactor, VHighRiskFactor} from "../containers/AppForm/AppForm";
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
    const veryHighClasses = ['VeryHigh', riskAssessment === VERY_HIGH_RISK ? 'ThisRisk' : ''];
    const highClasses = ['High', riskAssessment === HIGH_RISK ? 'ThisRisk' : ''];
    const intFavorableClasses = ['IntFavorable', riskAssessment === INTERMEDIATE_LOW_RISK ? 'ThisRisk' : ''];
    const intUnfavorableClasses = ['IntUnfavorable', riskAssessment === INTERMEDIATE_HIGH_RISK ? 'ThisRisk' : ''];
    const intClasses = ['Int', riskAssessment === INTERMEDIATE_RISK ? 'ThisRisk' : ''];
    const lowRiskClasses = ['Low', riskAssessment === LOW_RISK ? 'ThisRisk' : ''];
    const veryLowRiskClasses = ['VeryLow', riskAssessment === VERY_LOW_RISK ? 'ThisRisk' : ''];

    return (
        <>
            <h2>NCCN Risk Stratification: {getRisk(riskAssessment)}</h2>
            <h2>CAPRA Score: {capra}</h2>
            <div className="RiskWrapper">
                <div className={veryHighClasses.join(' ')}>
                    <h4>Very High Risk Factors</h4>
                    {Object.keys(vHighRiskFactors).map((k, index: number) => {
                        return (
                            <div className={vHighRiskFactors[k as keyof VHighRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "veryHigh"}>{vHighRiskFactors[k as keyof VHighRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={highClasses.join(" ")}>
                    <h4>High Risk Factors</h4>
                    {Object.keys(highRiskFactors).map((k, index: number) => {
                        return (
                            <div className={highRiskFactors[k as keyof HighRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "high"}>{highRiskFactors[k as keyof HighRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={intUnfavorableClasses.join(" ")}>
                    <h4>Unfavorable Int Risk Factors</h4>
                    {Object.keys(unfavorableRiskFactors).map((k, index: number) => {
                        return (
                            <div
                                className={unfavorableRiskFactors[k as keyof FavorableRiskFactors].value ? "Factor" : "NonFactor"}
                                key={index + "unfavorable"}>{unfavorableRiskFactors[k as keyof FavorableRiskFactors].label}</div>
                        )
                    })}
                </div>
                <div className={intFavorableClasses.join(" ")}>
                    <h4>Favorable Int Risk Factors</h4>
                    {Object.keys(favorableRiskFactors).map((k, index: number) => {
                        return (
                            <div
                                className={favorableRiskFactors[k as keyof FavorableRiskFactors].value ? "Factor" : "NonFactor"}
                                key={index + "favorable"}>{favorableRiskFactors[k as keyof FavorableRiskFactors].label}</div>
                        )
                    })}
                </div>
                <div className={intClasses.join(" ")}>
                    <h4>Intermediate Risk Factors</h4>
                    {Object.keys(intRiskFactors).map((k: string, index: number) => {
                        return (
                            <div className={intRiskFactors[k as keyof IntRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "intermediate"}>{intRiskFactors[k as keyof IntRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={lowRiskClasses.join(" ")}>
                    <h4>Low Risk Factors</h4>
                    {Object.keys(lowRiskFactors).map((k: string, index: number) => {
                        return (
                            <div className={lowRiskFactors[k as keyof IntRiskFactor].value ? "Factor" : "NonFactor"}
                                 key={index + "low"}>{lowRiskFactors[k as keyof IntRiskFactor].label}</div>
                        )
                    })}
                </div>
                <div className={veryLowRiskClasses.join(" ")}>
                    <h4>Very Low Risk Factors</h4>
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
