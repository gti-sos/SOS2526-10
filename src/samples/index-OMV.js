const xlsx = require('xlsx');

// Read the file and select the corresponding sheet
const workbook = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');
const sheetName = workbook.SheetNames[1];
const sheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet);

// Calculates the average of a field for a given country
function getAverage(country, field) {
    const values = data
        .filter(row => row.country.toLowerCase() === country.toLowerCase())
        .map(row => row[field])
        .filter(value => typeof value === 'number');

    if (values.length === 0) return 0;

    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Returns an HTML string with the average of a field for a given country
function calculateAverage(country, field) {
    const average = getAverage(country, field);

    return `<html><body><h1>
        Average ${field} for ${country}: ${average}
        </h1></body></html>`;
}

module.exports = {
    calculateAverage
};