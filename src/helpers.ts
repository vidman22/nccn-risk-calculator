import { parseAsync } from 'json2csv';
import fs from 'fs';
import { CoreData } from './data/coreData';


export const coreDataToFile = (cores : CoreData[]) => {
    const coreFields = [
        {
            label: 'Core ID',
            value: 'coreID',
        },
        {
            label: 'Length ',
            value: 'length',

        },
        {
            label: 'Percentage Involved',
            value: 'percentageInvolved',

        },
        {
            label: 'Gleason Primary',
            value: 'gleasonPrimary',

        },
        {
            value: 'gleasonSecondary',
            label: 'Gleason Secondary'

        },
        {
            label: 'Gleason Sum',
            value: 'gleasonSum',

        },
        {
            label: 'Grade Group',
            value: 'gradeGroup',
        }
    ];

    const data = cores.map(core => {
        Object(core).keys.map((k : keyof CoreData) => {
            return { [k]: core[k].value }
        })
    });

    console.log("data", data);

    parseAsync(data, { fields: coreFields })
        .then(csv => {
            console.log('csv', csv);
            let filename = `CoreData.csv`
            fs.appendFile(`${__dirname}/${filename}`, csv, (err) => {
                if (err) {
                    console.log("err writing file", err);
                } else {
                    console.log("success")
                }
            });
        })
        .catch(err => console.error(err));
}