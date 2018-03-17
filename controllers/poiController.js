const poiService = require('../services/poiService')

exports.getPois = (req, res) => {
    res.json(poiService.getPois())
}

exports.getPoisByRadius = (req, res) => {
    poiService.getPois(req.query.latLong, req.query.radius, pois => res.json(pois))
}

exports.addPoi = (req, res) => {
    poiService.savePoi(req.body.poi)
    res.sendStatus(200)
}

exports.editPoi = (req, res) => {
    poiService.editPoi(req.params.id, req.body)
    res.sendStatus(200)
}
