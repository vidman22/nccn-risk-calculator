import React from 'react';
import { CoreData } from '../../data/coreData';
import { FormData } from '../../data/formData';
import { Document, Page, StyleSheet, Text, View } from '@react-pdf/renderer';
import { getRisk, Result } from '../../components/Analysis';
import { FavorableRiskFactors, HighRiskFactor, IntRiskFactor, VeryLowRiskFactor, VHighRiskFactor } from "../LandingPage";
import { HIGH_RISK, INTERMEDIATE_HIGH_RISK, INTERMEDIATE_LOW_RISK, LOW_RISK, VERY_HIGH_RISK, VERY_LOW_RISK, Risks } from "../../data/riskConstants";

const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#f9f9f9'
    },
    active: {
        margin: 4,
        padding: 10,
        borderRadius: 4,
        backgroundColor: '#4e48e9',
    },
    section: {
        margin: 20,
        padding: 20,
        border: '1pt solid #ccc',
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    riskBlock: {
        margin: 4,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        fontSize: '10',
        fontWeight: 'bold',
        textAlign: 'left',
        borderBottom: '1pt solid #ccc'
    },
    riskItem: {
        fontSize: '12',
        fontWeight: 'semibold',
    },
    riskItemActive: {
        fontSize: '12',
        fontWeight: 'bold',
        color: 'darkorange'
    },
    body: {
        flexDirection: 'column',
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        textAlign: 'left',
    },
    result: {
        flexDirection: 'column',
        fontSize: '12',
        fontWeight: 'semibold',
        padding: 20,
    },
    coreCell: {
        borderRight: '1 solid black',
        width: '12.9%',
        paddingVertical: 5,
    },
    lastCell: {
        width: '12.9%',
        paddingVertical: 5,
    }
});

type Props = {
    formData: FormData
    coreData: CoreData[]
    intRiskFactors: IntRiskFactor;
    favorableRiskFactors: FavorableRiskFactors;
    unfavorableRiskFactors: FavorableRiskFactors;
    vHighRiskFactors: VHighRiskFactor;
    highRiskFactors: HighRiskFactor;
    lowRiskFactors: IntRiskFactor;
    veryLowRiskFactors: VeryLowRiskFactor;
    riskAssessment: Risks;
    resultData: Result
}


const MyDocument = ({
    formData,
    resultData,
    coreData,
    intRiskFactors,
    favorableRiskFactors,
    unfavorableRiskFactors,
    vHighRiskFactors,
    highRiskFactors,
    riskAssessment,
    lowRiskFactors,
    veryLowRiskFactors,
}: Props) => {

    const veryHighActive = riskAssessment === VERY_HIGH_RISK
    const vHighItemStyleActive = veryHighActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItemActive];
    const vHighItemStyleInactive = veryHighActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const highActive = riskAssessment === HIGH_RISK;
    const highItemStyleActive = highActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItemActive];
    const highItemStyleInactive = highActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const intFavorableActive = riskAssessment === INTERMEDIATE_LOW_RISK;
    const intFavItemStyleActive = intFavorableActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const intFavItemStyleInactive = intFavorableActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const intUnfavorableActive = riskAssessment === INTERMEDIATE_HIGH_RISK;
    const intUnFavItemStyleActive = intUnfavorableActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const intUnFavItemStyleInactive = intUnfavorableActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const lowActive = riskAssessment === LOW_RISK;
    const lowItemStyleActive = lowActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItemActive];
    const lowItemStyleInactive = lowActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];
    const veryLowActive = riskAssessment === VERY_LOW_RISK;
    const veryLowItemStyleActive = veryLowActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItemActive];
    const veryLowItemStyleInactive = veryLowActive ? [styles.riskItemActive, styles.riskItem, { color: "#fff" }] : [styles.riskItem];

    return (
        <Document>
            <Page size="LETTER" style={styles.page}>
                <Text style={{ alignSelf: 'center', marginTop: '20' }}>NCCN Risk Calculation</Text>
                <View style={styles.section} wrap={false}>
                    <Text>{getRisk(riskAssessment)}</Text>
                    {riskAssessment === VERY_HIGH_RISK &&
                        <View style={veryHighActive ? styles.active : styles.riskBlock}>
                            <Text style={veryHighActive ? { color: "#fff" } : undefined}>Very High Risk Factors</Text>
                            {Object.keys(vHighRiskFactors).map((k, index: number) => {
                                return (
                                    <Text
                                        style={vHighRiskFactors[k as keyof VHighRiskFactor].value ? vHighItemStyleActive : vHighItemStyleInactive}
                                        key={index + "veryHigh"}>{vHighRiskFactors[k as keyof VHighRiskFactor].label}</Text>
                                )
                            })}
                        </View>
                    }
                    {riskAssessment === HIGH_RISK &&
                        <View style={highActive ? styles.active : styles.riskBlock}>
                            <Text style={highActive ? { color: "#fff" } : undefined}>High Risk Factors</Text>
                            {Object.keys(highRiskFactors).map((k, index: number) => {
                                return (
                                    <Text
                                        style={highRiskFactors[k as keyof HighRiskFactor].value ? highItemStyleActive : highItemStyleInactive}
                                        key={index + "high"}>{highRiskFactors[k as keyof HighRiskFactor].label}</Text>
                                )
                            })}
                        </View>
                    }
                    {riskAssessment === INTERMEDIATE_HIGH_RISK &&
                        <View style={intUnfavorableActive ? styles.active : styles.riskBlock}>
                            <Text style={intUnfavorableActive ? { color: "#fff" } : undefined}>Unfavorable Int Risk Factors</Text>
                            {Object.keys(unfavorableRiskFactors).map((k, index: number) => {
                                return (
                                    <Text
                                        style={unfavorableRiskFactors[k as keyof FavorableRiskFactors].value ? intUnFavItemStyleActive : intUnFavItemStyleInactive}
                                        key={index + "unfavorable"}>{unfavorableRiskFactors[k as keyof FavorableRiskFactors].label}</Text>
                                )
                            })}
                        </View>
                    }
                    {riskAssessment === INTERMEDIATE_LOW_RISK &&
                        <View style={intFavorableActive ? styles.active : styles.riskBlock}>
                            <Text style={intFavorableActive ? { color: "#fff" } : undefined}>Favorable Int Risk Factors</Text>
                            {Object.keys(favorableRiskFactors).map((k, index: number) => {
                                return (
                                    <Text
                                        style={favorableRiskFactors[k as keyof FavorableRiskFactors].value ? intFavItemStyleActive : intFavItemStyleInactive}
                                        key={index + "favorable"}>{favorableRiskFactors[k as keyof FavorableRiskFactors].label}</Text>
                                )
                            })}
                        </View>
                    }
                    {(riskAssessment === INTERMEDIATE_LOW_RISK || riskAssessment === INTERMEDIATE_HIGH_RISK) &&
                        <View style={styles.riskBlock}>
                            <Text>Intermediate Risk Factors</Text>
                            {Object.keys(intRiskFactors).map((k: string, index: number) => {
                                return (
                                    <Text
                                        style={intRiskFactors[k as keyof IntRiskFactor].value ? styles.riskItemActive : styles.riskItem}
                                        key={index + "int"}>{intRiskFactors[k as keyof IntRiskFactor].label}</Text>
                                )
                            })}
                        </View>
                    }
                    {riskAssessment === LOW_RISK &&
                        <View style={lowActive ? styles.active : styles.riskBlock}>
                            <Text>Low Risk Factors</Text>
                            {Object.keys(lowRiskFactors).map((k: string, index: number) => {
                                return (
                                    <Text
                                        style={lowRiskFactors[k as keyof IntRiskFactor].value ? lowItemStyleActive : lowItemStyleInactive}
                                        key={index + "low"}>{lowRiskFactors[k as keyof IntRiskFactor].label}</Text>
                                )
                            })}
                        </View>
                    }
                    {riskAssessment === VERY_LOW_RISK &&
                        <View style={veryLowActive ? styles.active : styles.riskBlock}>
                            <Text>Very Low Risk Factors</Text>
                            {Object.keys(veryLowRiskFactors).map((k: string, index: number) => {
                                return (
                                    <Text
                                        style={veryLowRiskFactors[k as keyof VeryLowRiskFactor].value ? veryLowItemStyleActive : veryLowItemStyleInactive}
                                        key={index + "verylow"}>{veryLowRiskFactors[k as keyof VeryLowRiskFactor].label}</Text>
                                )
                            })}
                        </View>
                    }
                </View>

                <View style={styles.section} wrap={false}>
                    <Text>Patient</Text>
                    <View style={styles.section}>
                        <View style={{ ...styles.header, padding: 4, borderBottom: '0' }}>
                            <Text>Age: {formData.age.value || "0"}</Text>
                            <Text>PSA: {formData.psa.value || "0"}</Text>
                            <Text>Clinical Stage: {formData.clinicalStage.value || "0"}</Text>
                            <Text>Prostate Size: {formData.prostateSize.value || "0"}</Text>
                            <Text>Total Cores: {formData.totalCores.value || "0"}</Text>
                            <Text>Diagnosis: {`${formData.month.value}/${formData.day.value}/${formData.year.value}` || 'unknown'}</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.section} wrap={false}>
                    <Text>Results</Text>
                    <View style={styles.result}>
                        <Text>CAPRA Score: {resultData.capra}</Text>
                        <Text>Percentage of Cores Positive: {resultData.corePercentagePositive}%</Text>
                        <Text>Max Involved Percentage: {resultData.maxInvolvedPercentage}%</Text>
                        <Text>PSA Density: {resultData.psaDensity}</Text>
                        <Text>Max Grade Group: {resultData.maxGradeGroup}</Text>
                        <Text>Max Gleason Sum: {resultData.maxGleasonSum}</Text>
                        <Text>Max Primary: {resultData.maxPrimary}</Text>
                        <Text>Max Secondary: {resultData.maxSecondary}</Text>
                        <Text>Grade Group of 4 and 5 count: {resultData.ggFourAndFiveCount}</Text>
                        <Text>Risk Assessment: {getRisk(resultData.risk)}</Text>
                    </View>
                </View>

                <View style={styles.section} wrap={true}>
                    <Text>Core Data</Text>
                    <View style={{ padding: 20 }}>
                        <View style={styles.header}>
                            <Text style={styles.coreCell}>Core Location</Text>
                            <Text style={styles.coreCell}>Length</Text>
                            <Text style={styles.coreCell}>% Involved</Text>
                            <Text style={styles.coreCell}>G Primary</Text>
                            <Text style={styles.coreCell}>G Secondary</Text>
                            <Text style={styles.coreCell}>Gleason Sum</Text>
                            <Text style={styles.lastCell}>Grade Group</Text>
                        </View>
                        <View style={styles.body}>
                            {coreData.map((core, index) => (
                                <View style={styles.row} key={Math.random()}>
                                    {Object.keys(core).map((key, index) => (
                                        <Text style={index === 6 ? styles.lastCell : styles.coreCell}
                                            key={core.coreID + index.toString()}>{core[key as keyof CoreData].value || "0"}</Text>
                                    ))}
                                </View>
                            ))}
                        </View>
                    </View>
                </View>
            </Page>
        </Document>
    );
};

export default MyDocument;
