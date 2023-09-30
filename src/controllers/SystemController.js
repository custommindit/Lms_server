const System = require("../models/System");

module.exports.getSystem = async (req, res) => {
    try {
        System.findById("6517c1bc619909e9635de3b5").then(system => {
            return res.json({
                system: system,
                Success: true,
                message: "system fetched sucessfully"
            })
        })
    } catch (error) {
        return res.json({ message: "INTERNAL SERVER ERROR", Success: false })
    }
}