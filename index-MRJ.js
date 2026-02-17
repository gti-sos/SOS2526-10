const xlsx = require('xlsx');

// Leer datos del fichero
const file = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');

const sheetName = file.SheetNames[1];
const sheet = file.Sheets[sheetName];

const myData = xlsx.utils.sheet_to_json(sheet);

// Calcular la media del campo "electoral_score" del pais especificado
FILTER_COUNTRY = "Canada"

const filtered = myData.filter(data => data.country === FILTER_COUNTRY);

const filteredScores = filtered.map(data => data.electoral_score)

const accumulatedScores = filteredScores.reduce((acc, data) => {
                                return (acc += data)
                            }, 0);

const scoreMean = accumulatedScores / filteredScores.length


console.log(scoreMean)
