const axios = require('axios')

const googleCampLocation = '52.256202,21.0434033'
const defaultSearchType = 'store'
const rankBy = 'distance'

exports.test = (req, res) => {
    this.getPoints(googleCampLocation, (result) => { res.json(result) })
}

exports.getPoints = (location, callback) => {
    this.getPointsByType(location, defaultSearchType, callback)
}

exports.getPointsByType = (location, type, callback) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + location +
        '&type=' + type +
        '&rankby=' + rankBy +
        '&key=' + process.env.GOOGLE_API_KEY
    axios.get(url).then(res => callback(res.data.results))
}

exports.getPlaceDetails = (placeId, callback) => {
    const url = 'https://maps.googleapis.com/maps/api/place/details/json?' +
        'placeid=' + placeId +
        '&key=' + process.env.GOOGLE_API_KEY
    axios.get(url).then(res => callback(res.data))
}
