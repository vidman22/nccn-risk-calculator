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
        return Object.keys(core).map((k) => {
            return { [k]: core[k as keyof CoreData].value }
        })
    });

    // parseAsync(data, { fields: coreFields })
    //     .then(csv => {
    //         console.log('csv', csv);
    //         let filename = `CoreData.csv`
    //         localStorage.setItem(filename, csv);
    //         // writeFile(`${__dirname}/${filename}`, csv, (err) => {
    //         //     if (err) {
    //         //         console.log("err writing file", err);
    //         //     } else {
    //         //         console.log("success")
    //         //     }
    //         // });
    //     })
    //     .catch(err => console.error(err));
}