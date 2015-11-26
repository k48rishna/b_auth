/**
 * Created by kanhaiya on 10/8/2015.
 */
module.exports.db={
    'secret':'kanhaiya',
    'url' : 'mongodb://127.0.0.1:27017/authenticate'
}
var redis = require('redis');
module.exports.redis = redis.createClient('6379','127.0.0.1');
