import React from 'react';
import './Analysis.css';

export default function Analysis({ result }) {
    return (
        <div className="AnalysisContainer">
            <h3>Analysis</h3>
            <div className="ResultContainer">
                <p>
                    <span>Percentage of Cores Positive: </span>{result.corePercentagePositive}
                </p>
                <p>
                    <span>Gleason Sum: </span>{result.gleasonSum}
                </p>
                <p>
                    <span>PSA Density: </span>{result.psaDensity}
                </p>
            </div>
        </div>
    );
}
