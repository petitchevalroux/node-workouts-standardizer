"use strict";
var path = require("path");

function Module() {}

Module.prototype.SportsTrackerStream = require(path.join(__dirname,
    "sports-tracker"));

module.exports = new Module();
