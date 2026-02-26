const xlsx = require('xlsx');

// Reads an Excel file and returns its content as JSON
function readFile(fileName) {
    let workbook = xlsx.readFile('data/datasets/' + fileName);
    let sheetName = workbook.SheetNames[0];
    let sheet = workbook.Sheets[sheetName];
    return xlsx.utils.sheet_to_json(sheet);
}

module.exports = {
    readFile
};
