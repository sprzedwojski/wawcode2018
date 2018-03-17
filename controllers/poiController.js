const poiService = require('../services/poiService')

exports.getPois = (req, res) => {
    res.json(poiService.getPois())
}

exports.getPoisByRadius = (req, res) => {
    res.json(poiService.getPois(req.data.latLong, req.data.radius))
}

exports.addPoi = (req, res) => {
    poiService.savePoi(req.body.poi)
    res.sendStatus(200)
}

exports.editPoi = (req, res) => {
    poiService.editPoi(req.params.id, req.body)
    res.sendStatus(200)
}
