import React from 'react';
import { CoreData } from '../../data/coreData';
import { FormData } from '../../data/formData';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';
import { Result } from '../../components/Analysis';
import { risk } from '../../components/Analysis';
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#f9f9f9'

    },
    section: {
        margin: 20,
        padding: 20,
        border: '1pt solid #ccc',
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
    resultData: Result
}

const MyDocument = ({ formData, resultData, coreData }: Props) => (
    <Document>
        <Page size="LETTER" style={styles.page}>
            <Text style={{ alignSelf: 'center', marginTop: '20' }}>NCCN Risk Calculation</Text>
            <View style={styles.section}>
                <Text>Patient</Text>
                <View style={styles.section}>
                    <View style={{ ...styles.header, padding: 4, borderBottom: '0' }}>
                        <Text>Age: {formData.age.value || "0"}</Text>
                        <Text>PSA: {formData.psa.value || "0"}</Text>
                        <Text>Clinical Stage: {formData.clinicalStage.value || "0"}</Text>
                        <Text>Prostate Size: {formData.prostateSize.value || "0"}</Text>
                    </View>
                </View>
                <Text>Results</Text>

                <View style={styles.result}>
                    <Text>Percentage of Cores Positive: {resultData.corePercentagePositive}%</Text>
                    <Text>Max Involved Percentage: {resultData.maxInvolvedPercentage}%</Text>
                    <Text>PSA Density: {resultData.psaDensity}</Text>
                    <Text>Max Grade Group: {resultData.maxGradeGroup}</Text>
                    <Text>Max Gleason Sum: {resultData.maxGleasonSum}</Text>
                    <Text>Max Primary: {resultData.maxPrimary}</Text>
                    <Text>Max Secondary: {resultData.maxSecondary}</Text>
                    <Text>Grade Group of 4 and 5 count: {resultData.ggFourAndFiveCount}</Text>
                    <Text>Risk Assessment: {risk(resultData.risk)}</Text>
                </View>
            </View>
            <View style={styles.section} wrap={false}>
                <Text>Core Data</Text>
                <View style={{ padding: 20 }}>
                    <View style={styles.header}>
                        <Text style={styles.coreCell}>Core ID</Text>
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
                                    <Text style={index === 6 ? styles.lastCell : styles.coreCell} key={core.coreID + index.toString()}>{core[key as keyof CoreData].value || "0"}</Text>
                                ))}
                            </View>
                        ))}
                    </View>
                </View>
            </View>
        </Page>
    </Document>
);

export default MyDocument;