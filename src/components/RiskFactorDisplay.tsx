import React from 'react';
import {HighRiskFactor, IntRiskFactor, VHighRiskFactor} from "../containers/AppForm/AppForm";

type Props = {
    intRiskFactors: IntRiskFactor;
    vHighRiskFactors: VHighRiskFactor;
    highRiskFactors: HighRiskFactor;
}


const RiskFactorDisplay = ( {intRiskFactors, vHighRiskFactors, highRiskFactors} : Props) => {

    return (
        <div className="RiskWrapper">
            <div className="VeryHigh">
                {Object(vHighRiskFactors).keys().map((k, index )=> {
                    return (
                        <div className={vHighRiskFactors[k as keyof VHighRiskFactor].value ? "Factor" : "NonFactor"} key={index + "veryHigh"}>{vHighRiskFactors[k as keyof VHighRiskFactor].label}</div>
                    )
                })}
            </div>
            <div className="High">
                {Object(highRiskFactors).keys().map((k, index )=> {
                    return (
                        <div className={highRiskFactors[k as keyof HighRiskFactor].value ? "Factor" : "NonFactor"} key={index + "high"}>{highRiskFactors[k as keyof HighRiskFactor].label}</div>
                    )
                })}
            </div>
            <div className="Int">
                <div>{intRiskFactors.psa.label}</div>
            </div>
            <div className="IntUnfavorable">
                <div>{}</div>
            </div>
            <div className="IntFavorable">
                <div>{}</div>
            </div>

        </div>
    )
}

export default RiskFactorDisplay;
