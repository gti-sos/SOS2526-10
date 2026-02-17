const xlsx = require('xlsx');

const file = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');

const sheetName = file.SheetNames[2];
const sheet = file.Sheets[sheetName];

const myData = xlsx.utils.sheet_to_json(sheet);

FILTER_COUNTRY = "belgium"

const filtered = myData.filter(data => data.country === FILTER_COUNTRY);

const filteredScores = filtered.map(data => data.rabies)

const accumulatedScores = filteredScores.reduce((acc, data) => {
                                return (acc += data)
                            }, 0);

const scoreMean = accumulatedScores / filteredScores.length


console.log(scoreMean)