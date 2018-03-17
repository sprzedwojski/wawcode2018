const axios = require('axios')

const radius = 500
const googleCampLocation = '52.256202,21.0434033'

exports.test = (req, res) => {
    this.getPoints(googleCampLocation, radius, (result) => { res.json(result) })
}

exports.getPoints = (location, searchRadius, callback) => {
    const url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + location +
        '&radius=' + searchRadius +
        '&key=' + process.env.GOOGLE_API_KEY
    axios.get(url).then(res => callback(res.data.results))
}
