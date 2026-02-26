const xlsx = require('xlsx');
const workbook = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');

const sheetName = workbook.SheetNames[3]; //Uso la tercera hoja porque es la que tiene mis datos
const sheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet);

/*
const selectedEntity = 'afghanistan';
const field = 'unsafe_water_source';

const filteredData = data.filter(row => row.entity.toLowerCase() === selectedEntity.toLowerCase());

const values = filteredData.map(row => row[field]);

const average = values.reduce((sum, value) => sum + value, 0) / values.length;

console.log(`Average ${field} for ${selectedEntity}: ${average}`);
*/

function getAverage(entity, field) {
  let values = data.filter(row => row.entity.toLowerCase() === entity.toLowerCase())
    .map(row => row[field]);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateAverage(entity, field) {
    const average = getAverage(entity, field);
    return `<html><body><h1>
        Average ${field} for ${entity}: ${average}
        </h1></body></html>`;
}

module.exports = {
    calculateAverage
};