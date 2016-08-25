"use strict";

var Transform = require("stream")
    .Transform;
var util = require("util");
var ucfirst = require("ucfirst");
var Promise = require("bluebird");

function Stream(options) {
    if (!(this instanceof Stream)) {
        return new Stream(options);
    }
    this.options = options || {};
    this.options.objectMode = true;

    Transform.call(this, this.options);
}

Stream.prototype._transform = function(workoutIn, encoding, callback) {
    var promesses = [];
    var self = this;
    Object.getOwnPropertyNames(workoutIn)
        .forEach(function(property) {
            var functionName = "_transform" + ucfirst(property);
            if (typeof self[functionName] === "function") {
                promesses.push(self[functionName](workoutIn));
            }
        });
    Promise
        .all(promesses)
        .then(function(values) {
            var workoutOut = {};
            values.forEach(function(v) {
                workoutOut[v.property] = v.value;
            });
            return workoutOut;
        })
        .done(
            function(workoutOut) {
                callback(null, workoutOut);
            },
            function(err) {
                callback(err);
            }
        );
};

var activityHash = {
    0: "walking",
    1: "running",
    2: "cycling",
    3: "nordic skiing",
    10: "mountain biking",
    11: "hiking",
    12: "roller skating",
    13: "downhill skiing",
    14: "paddling",
    15: "rowing",
    16: "golf",
    17: "indoor",
    18: "parkour",
    19: "ball games",
    20: "outdoor gum",
    21: "swimming",
    23: "gym",
    24: "nordic walking",
    25: "horseback riding",
    26: "motorsports",
    27: "skateboarding",
    28: "water sports",
    29: "climbing",
    30: "snowboarding",
    31: "ski touring",
    32: "fitness",
    33: "soccer"
};

Stream.prototype._transformActivityId = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.activityId !== "number") {
            reject(new Error("activityId is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            resolve({
                "property": "activity",
                "value": activityHash[workoutIn.activityId] ||
                    "other"
            });
        }
    });
};

Stream.prototype._transformStartTime = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.startTime !== "number") {
            reject(new Error("startTime is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            // startTime is in milliseconds since EPOCH
            resolve({
                "property": "start",
                "value": Math.round(workoutIn.startTime /
                    1000)
            });
        }
    });
};

Stream.prototype._transformTotalTime = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.totalTime !== "number") {
            reject(new Error("totalTime is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            // totalTime is in seconds
            resolve({
                "property": "duration",
                "value": workoutIn.totalTime
            });
        }
    });
};

Stream.prototype._transformTotalDistance = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.totalDistance !== "number") {
            reject(new Error(
                "totalDistance is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            // totalDistance is in meter
            resolve({
                "property": "distance",
                "value": workoutIn.totalDistance
            });
        }
    });
};

Stream.prototype._transformEnergyConsumption = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.energyConsumption !== "number") {
            reject(new Error(
                "energyConsumption is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            // totalDistance is in kcal
            resolve({
                "property": "energy",
                "value": workoutIn.energyConsumption
            });
        }
    });
};

Stream.prototype._transformHrdata = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.hrdata !== "object") {
            reject(new Error("hrdata is not an object (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else if (typeof workoutIn.hrdata.avg !== "number") {
            reject(new Error("hrdata.avg is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            // totalDistance is in bpm
            resolve({
                "property": "avgHr",
                "value": workoutIn.hrdata.avg
            });
        }
    });
};

Stream.prototype._transformHrdata = function(workoutIn) {
    return new Promise(function(resolve, reject) {
        if (typeof workoutIn.hrdata !== "object") {
            reject(new Error("hrdata is not an object (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else if (typeof workoutIn.hrdata.avg !== "number") {
            reject(new Error("hrdata.avg is not a number (workout:" +
                JSON.stringify(workoutIn) + ")"));
        } else {
            // heart rate is in bpm
            resolve({
                "property": "avgHeartRate",
                "value": workoutIn.hrdata.avg
            });
        }
    });
};

util.inherits(Stream, Transform);

module.exports = Stream;
