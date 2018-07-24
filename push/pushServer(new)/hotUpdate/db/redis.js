var redis = require("redis"),
    client = redis.createClient();

var Promise = require("bluebird");

Promise.promisifyAll(redis.RedisClient.prototype);
Promise.promisifyAll(redis.Multi.prototype);

client.on("error", function (err) {
    console.log("Error " + err);
});

module.exports = client