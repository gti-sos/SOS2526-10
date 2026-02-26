const xlsx = require('xlsx');

// Read the file and select the corresponding sheet
const workbook = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');
const sheetName = workbook.SheetNames[3];
const sheet = workbook.Sheets[sheetName];

const data = xlsx.utils.sheet_to_json(sheet);

// Calculates the average of a field for a given country
function getAverage(entity, field) {
  let values = data.filter(row => row.entity.toLowerCase() === entity.toLowerCase())
    .map(row => row[field]);
  return values.reduce((sum, value) => sum + value, 0) / values.length;
}

// Returns an HTML string with the average of a field for a given country
function calculateAverage(entity, field) {
    const average = getAverage(entity, field);
    return `<html><body><h1>
        Average ${field} for ${entity}: ${average}
        </h1></body></html>`;
}

module.exports = {
    calculateAverage
};