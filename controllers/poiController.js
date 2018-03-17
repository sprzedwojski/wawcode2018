const poiService = require('../services/poiService')

exports.getPois = (req, res) => {
    res.json(poiService.getPois())
}

exports.getPoisByRadius = (req, res) => {
    res.json(poiService.getPois())
}

exports.addPoi = (req, res) => {
    poiService.savePoi(req.body.poi)
    res.sendStatus(200)
}
