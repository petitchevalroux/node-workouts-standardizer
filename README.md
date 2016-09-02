# node-workouts-standardizer
Transform stream collection to standardize workouts data.

## Summary
The goal of this package is to standardize workouts data from multiple sources.

### Sample workout
Each workout may contains the following data :
```json
{

    "activity":"cycling",
    "start":1418553464,
    "duration":6931,
    "distance":51146,
    "avgHeartRate":0,
    "energy":2060
    "maxSpeed":11.76,
    "avgSpeed":7.38
}
```

### Workout fields
 * **activity** string type of activity.
 * **start** number unixtimestamp representing workout's start time.
 * **duration** number workout's duration.
 * **distance** number workout's distance in meters.
 * **avgHeartRate** number workout's average heart rate in bpm.
 * **energy** number workout's consumed energy in kcal.
 * **maxSpeed** max speed in m/s.
 * **avgSpeed** average speed in m/s.

## [Sports-tracker](http://sports-tracker.com/) transform stream

### Usage
Using with [sports-tracker client's stream](https://github.com/petitchevalroux/node-sports-tracker)
```javascript
var WorkoutsStream = require("@petitchevalroux/sports-tracker-client").WorkoutsStream;

var wStream = new WorkoutsStream({
    "user": "user@example.com",
    "password": "str0ngP4ssw0rd"
});

var Transform = require("@petitchevalroux/workouts-standardizer").SportsTrackerStream;

var tStream = new Transform();
tStream.on("data", function(workout) {
        console.log(JSON.stringify(workout));
});

tStream.on("error", function(err) {
        console.log(err);
});

wStream.pipe(tStream);
```

### Sample output
```
{"activity":"cycling","start":1422177320,"duration":5568.02,"distance":41649.1,"avgHeartRate":0,"energy":1651}
{"activity":"cycling","start":1418553464,"duration":6931,"distance":51146,"avgHeartRate":0,"energy":2060}
```
