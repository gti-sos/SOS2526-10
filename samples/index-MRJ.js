const xlsx = require('xlsx');

// Leer el fichero
const workbook = xlsx.readFile('data/SOS2526-10-Propuesta.xlsx');

// Seleccionar hoja (puedes cambiar el índice si lo necesitas)
const sheetName = workbook.SheetNames[1];
const sheet = workbook.Sheets[sheetName];

// Convertir a JSON
const data = xlsx.utils.sheet_to_json(sheet);

/**
 * Calcula la media de un campo numérico para un país concreto
 * @param {string} country - País a filtrar
 * @param {string} field - Campo numérico del que calcular la media
 * @returns {number} Media calculada
 */
function getAverage(country, field) {
    const values = data
        .filter(row => row.country.toLowerCase() === country.toLowerCase())
        .map(row => row[field])
        .filter(value => typeof value === 'number');

    if (values.length === 0) return 0;

    return values.reduce((sum, value) => sum + value, 0) / values.length;
}

/**
 * Devuelve el resultado en formato HTML
 * @param {string} country 
 * @param {string} field 
 * @returns {string} HTML con el resultado
 */
function calculateAverage(country, field) {
    const average = getAverage(country, field);

    return `<html><body><h1>
        Average ${field} for ${country}: ${average}
        </h1></body></html>`;
}

module.exports = {
    calculateAverage
};