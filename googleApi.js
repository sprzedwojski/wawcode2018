const fetch = require('node-fetch')

const radius = 500
const googleCampLocation = '52.256202,21.0434033'

exports.test = (req, res) => {
    var url = 'https://maps.googleapis.com/maps/api/place/nearbysearch/json?' +
        'location=' + googleCampLocation +
        '&radius=' + radius +
        '&key=' + process.env.GOOGLE_API_KEY
    fetch(url)
        .then(response => {
            response.json().then(json => {
                res.json(json)
            })
        })
}

