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

exports.setPoiOpenness = (req, res) => {
    poiService.setPoiOpen(req.body.id, req.body.open)
    res.sendStatus(200)
}
