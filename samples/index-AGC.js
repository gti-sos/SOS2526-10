const xlsx = require('xlsx');
const workbook = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');

const sheetName = workbook.SheetNames[2];
const sheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet);

/*
const selectedCountry = 'belgium';
const field = 'rabies';

const filteredData = data.filter(row => row.country.toLowerCase() === selectedCountry.toLowerCase());

const values = filteredData.map(row => row[field]);

const average = values.reduce((sum, value) => sum + value, 0) / values.length;

console.log(`Average ${field} for ${selectedCountry}: ${average}`);
*/

function getAverage(country, field) {
  let values = data
    .filter(row => row.country.toLowerCase() === country.toLowerCase())
    .map(row => row[field]);

  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

function calculateAverageAGC(country, field) {
    const average = getAverage(country, field);
    return `<html><body><h1>
        Average ${field} for ${country}: ${average}
        </h1></body></html>`;
}

module.exports = {
    calculateAverageAGC
};