const pois = require('../data/pois').pois

exports.getPois = (req, res) => {
    res.json(pois)
}

exports.getPoisByRadius = (req, res) => {
    res.json({ })
}

exports.addPoi = (req, res) => {

}
