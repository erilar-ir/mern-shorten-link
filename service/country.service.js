const allCountries = require('./all-counrties')

class CountryService {
    getCountryData = (code) => {
        try {
            const existingCountry = allCountries.find(country => country.alpha2Code === code)
            if (!existingCountry) {
                return 'Unknown Country'
            }
           return existingCountry.name
        } catch (e) {
            console.log(e)
        }
    }
}
module.exports = new CountryService()
