/*
 This object is used to store the data in memory
 from the different routes to make it accesible 
 and persistent across the different routes and modules.
 */
const store = {
    pandemics: [],
    protests: [],
    deathsByRiskFactors: []
}

module.exports = store;