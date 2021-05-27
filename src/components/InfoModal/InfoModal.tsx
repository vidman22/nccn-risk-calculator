import React, { useState, useEffect } from 'react';
import {
    vHighRiskFactorsData,
    highRiskFactorsData,
    favorableRiskFactorsData,
    unfavorableRiskFactorsData,
    intRiskFactorsData,
    lowRiskFactorsData,
    veryLowRiskFactorsData,
    HighRiskFactor,
    VHighRiskFactor,
    IntRiskFactor,
    VeryLowRiskFactor,
    FavorableRiskFactors,
} from '../../containers/LandingPage';
import './InfoModal.css';

export default function InfoPage() {
    const [showCopied, setShowCopied] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            setShowCopied(false);
        }, 3000)
    }, [showCopied]);

    return (
        <div className='h-full'>
            <div className="w-full sm:w-3/5  m-auto py-4 bg-white px-16 text-left rounded-lg overflow-scroll box-border">
                <h2 className='text-gray-800 text-xl text-center my-4 font-semibold'>ROUNDY PROSTATE CANCER RISK NOMOGRAM USER GUIDE</h2>
                <div className="InfoTextWrapper">
                    <p>
                        &emsp; This Nomogram is a software tool to stratify a patient’s risk of prostate cancer progression
                        from Very Low Risk to Very High Risk. The user is not required to understand the significance
                        of the various medical terms such as Gleason Grade Group or Clinical Stage. Using the
                        medical diagnosis details, the Nomogram calculates the patient’s risk of prostate cancer
                        progression by computing the patient’s risk stratification using the well known CAPRA 1 and
                        NCCN 2 Risk analysis software tools.
                    </p>
                    <p>
                        &emsp; That information helps the patient and his doctors to make informed treatment decisions with
                        the goal to cure or at least control the cancer, with the minimum of unwanted side effects such
                        as incontinence, impotence, urinary stricture, and bowel bother.
                        </p>
                    <p>
                        &emsp;
                        The Nomogram is only designed for men with localized prostate cancer, Stage T1 through T4.
                        The Nomogram is not for men with advanced disease Stage N1 positive lymph nodes, and/or
                        Stage M1 distant metastasis. Those men are at very high risk and should find a team of
                        prostate cancer specialists to aggressively deal with their cancer. The team should include a
                        Urologic Surgical Oncologist, a Radiation Oncologist, and a Medical Oncologist.
                        </p>
                    <p>
                        &emsp;
                        For men believed to have localized disease, prostate cancer treatment should be proportional
                        to the cancer diagnosis risk stratification. Those diagnosed with Very low risk stratification
                        probably do not need treated, at least not until Active Surveillance indicates the cancer shows
                        signs of becoming more aggressive. That avoids or delays treatment side effects that reduce
                        quality of life.
                        </p>

                    <div>
                        Side effects can include:
                    <ol className='list-disc ml-8'>
                            <li><span className='font-medium'>urinary incontinence</span> – inability to control urine leakage</li>
                            <li><span className='font-medium'>sexual impotence</span> – inability to achieve or maintain an erection for sex</li>
                            <li><span className='font-medium'>urinary stricture</span> – difficulty to drain the bladder</li>
                            <li><span className='font-medium'>bowel bother</span> – frequent bowel movements, blood in stool, pain</li>
                            <li><span className='font-medium'>infection</span> - rare, but can be life threatening</li>
                            <li><span className='font-medium'>anesthesia risk</span> – some treatments require anesthesia</li>
                        </ol>
                    </div>
                    <div>
                        &emsp;
                        Some men will be diagnosed with a very aggressive variant of prostate cancer that grows
                        quickly, has the potential to spread around the body, and is life threatening. Those aggressive
                        cancers may have better prognosis with multiple, aggressive therapies, applied early. Those
                        Very High Risk men accept the treatment side effects in hopes of cure or at least long term
                        prostate cancer control.
                        <br />
                        &emsp;
                        Patients with Intermediate Risk have a more difficult treatment decision because
                        IntermediatIntermediate Risk has more options and personal preferences to consider and
                        discuss with their doctors. Additional genomic testing may assist with the decision making
                        about cancer risk and treatment aggressiveness.
                        <br />
                        &emsp;
                        With accurate risk stratification, the patient and his doctors can make informed treatment
                        decisions to control the cancer with the fewest side effects.
                        <br />
                        <br />
                        <div className='text-gray-800 text-xl mb-4 text-center font-semibold  m-auto'>Diagnosis Data Requirements Entered into The Nomogram</div>

                        <ol className='list-decimal ml-6 w-4/5'>
                            <li><strong>AGE</strong> at the time of diagnosis</li>
                            <li><strong>PSA</strong> at the time of diagnosis</li>
                            <li><strong>CLINICAL STAGE</strong> Clinical Stage refers to where cancer is in and around the prostate,
                            as determined by the Digital Rectal Exam (DRE) that is typically performed by the
                            urologist who determines the diagnosis. Ask the doctor or phone the doctor’s office to
                            obtain the Clinical Stage. Note: biopsy and imaging staging is not included in Clinical
                            Stage. It is DRE data only.
                            <table className='rounded-md'>
                                    <thead>
                                        <tr>
                                            <th>T1c</th>
                                            <th>T2a</th>
                                            <th>T2b</th>
                                            <th>T2c</th>
                                            <th>T3a</th>
                                            <th>T3b</th>
                                            <th>T4</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td>Cannont be felt with the finger</td>
                                            <td>1/2 of one side only</td>
                                            <td>Tumor invades more than 1/2 of one side only</td>
                                            <td> Tumor felt on both sides</td>
                                            <td>Felt outside the prostate capsule</td>
                                            <td>Invades the seminal vesicles</td>
                                            <td>Invades local tissues - bladder, rectum, etc.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </li>
                            <li><strong>PROSTATE SIZE</strong> Measured in cubic centimeters (cc) or milliliters (ml), or grams (gm). This is important for
                            choosing some therapy options such as radiation, and useful for determining the PSA
                            Density calculation that predicts risk of cancer already outside the prostate. PSA
                            density = PSA/Size. If density is &gt;0.15 it raises the question from where the extra
                            PSA is coming.
                            Prostate size can be found in the Trans Rectal UltraSound (TRUS) report written by the
                            urologist, or from imaging tests such as the Multi Parametric MRI.
                        </li>
                            <li><strong>BIOPSY CORE DATA</strong> The biopsy core data may be the most important risk
                            stratification information from the original diagnosis. It can also be the most difficult to
                            understand. This Nomogram does not require the user to understand the medical
                            terms in the biopsy report, such as what is the significance of a Gleason score. It only
                            requires the user to get a copy of the written report from
                            the doctor or pathologist and to enter the data for each biopsy core. Then the Nomogram displays
                            the data in simple spreadsheet format, and the raw data from all the cores is evaluated
                            into CAPRA and NCCN risk stratification.
                            Because there is no agreed universal format for writing the biopsy report, it can be
                            difficult for the lay person to identify the data for each core.

                            <ul className='list-disc ml-8'>
                                    <li>At the doctor’s office appointment, ask the doctor to help enter the core data.</li>
                                    <li>Prostate Cancer Support groups often have members who are very well informed
                                    about prostate cancer and they can assist in entering the biopsy core data. One
                                can usually find a local support group ** at the Us Too web site **</li>
                                    <li>Contact the UCSF Prostate Cancer Support Group facilitator, Nathan Roundy, at
                                    email prostateguy@gmail.com for assistance.</li>
                                </ul>
                            </li>
                        </ol>
                        <div>
                            <h2 className='text-gray-800 text-xl my-4 font-semibold'>NCCN Risk Stratification</h2>
                            <div className='flex flex-col justify-between border border-gray-800 rounded-md m-auto'>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>Very High Risk Factors</h4>
                                    {Object.keys(vHighRiskFactorsData).map((k, index: number) => {
                                        return (
                                            <div className="NonFactor"
                                                key={index + "veryHigh"}>{vHighRiskFactorsData[k as keyof VHighRiskFactor].label}</div>
                                        )
                                    })}
                                </div>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>High Risk Factors</h4>
                                    {Object.keys(highRiskFactorsData).map((k, index: number) => {
                                        return (
                                            <div className="NonFactor"
                                                key={index + "high"}>{highRiskFactorsData[k as keyof HighRiskFactor].label}</div>
                                        )
                                    })}
                                </div>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>Unfavorable Intermediate Risk Factors</h4>
                                    {Object.keys(unfavorableRiskFactorsData).map((k, index: number) => {
                                        return (
                                            <div
                                                className="NonFactor"
                                                key={index + "unfavorable"}>{unfavorableRiskFactorsData[k as keyof FavorableRiskFactors].label}</div>
                                        )
                                    })}
                                </div>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>Favorable Intermediate Risk Factors</h4>
                                    {Object.keys(favorableRiskFactorsData).map((k, index: number) => {
                                        return (
                                            <div
                                                className="NonFactor"
                                                key={index + "favorable"}>{favorableRiskFactorsData[k as keyof FavorableRiskFactors].label}</div>
                                        )
                                    })}
                                </div>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>Intermediate Risk Factors</h4>
                                    {Object.keys(intRiskFactorsData).map((k: string, index: number) => {
                                        return (
                                            <div className="NonFactor"
                                                key={index + "intermediate"}>{intRiskFactorsData[k as keyof IntRiskFactor].label}</div>
                                        )
                                    })}
                                </div>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>Low Risk FactorsData</h4>
                                    {Object.keys(lowRiskFactorsData).map((k: string, index: number) => {
                                        return (
                                            <div className="NonFactor"
                                                key={index + "low"}>{lowRiskFactorsData[k as keyof IntRiskFactor].label}</div>
                                        )
                                    })}
                                </div>
                                <div className="NoRisk" style={{ display: 'flex' }}>
                                    <h4 className='font-medium text-lg'>Very Low Risk Factors</h4>
                                    {Object.keys(veryLowRiskFactorsData).map((k: string, index: number) => {
                                        return (
                                            <div className={veryLowRiskFactorsData[k as keyof VeryLowRiskFactor].value ? "Factor" : "NonFactor"}
                                                key={index + "verylow"}>{veryLowRiskFactorsData[k as keyof VeryLowRiskFactor].label}</div>
                                        )
                                    })}
                                </div>

                            </div>
                        </div>
                        <div>
                            <div className='text-gray-800 text-xl my-4 text-center font-semibold'>Using the Nomogram</div>
                            <ol className='list-decimal ml-4'>
                                <li className='ml-1 '>Enter the Age, PSA, Clinical Stage (from the DRE) and prostate size in ml, cc, or gm.</li>
                                <li className='ml-1 '>Enter the biopsy core details.</li>
                                <li className='ml-1 '>Index is the counter of the number of biopsy cores</li>
                                <li className='ml-1 '>Core ID is the location in the prostate from which the core was extracted. This data is not used in the CAPRA and NCCN calculations, but is interesting for better understanding where the cancer is in the prostate. The prostate is labeled Base at the top, Mid Gland in the middle, and Apex at the bottom. The position is further broken down to Left, Center, and Right.</li>
                                <li className='ml-1 '>Length is the measurement of the core in millimeters.</li>
                                <li className='ml-1 '>Percent Involved is calculated by the pathologist and is an important indicator of risk that the cancer may already be outside the prostate.</li>
                                <li className='ml-1 '>Primary is the primary Gleason Score from 3 to 5.</li>
                                <li className='ml-1 '>Secondary is the secondary Gleason Score from 3 to 5.</li>
                                <li className='ml-1 '>Sum is the Gleason sum calculated from the Primary and Secondary.</li>
                                <li className='ml-1 '>Gleason Grade Group is calculated by the Nomogram</li>
                            </ol>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
