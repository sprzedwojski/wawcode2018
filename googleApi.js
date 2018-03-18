const axios = require('axios')

const googleCampLocation = '52.256202,21.0434033'
const searchType = 'store'
const rankBy = 'distance'

exports.test = (req, res) => {
    this.getPoints(googleCampLocation, (result) => { res.json(result) })
}

exports.getPoints = (location, callback) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + location +
        '&type=' + searchType +
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
