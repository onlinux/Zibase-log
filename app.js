/*
 +-+-+-+-+-+-+-+-+-+-+
 |o|n|l|i|n|u|x|.|f|r|
 +-+-+-+-+-+-+-+-+-+-+
 https://github.com/onlinux/Zibase-log

 */

var _ = require('underscore');
var request = require("request");
var S = require('string');
var config = require('./config')

var clientIp = process.env.MYIP || getIPAddress();
var zibaseIp = config.zibaseIp || "192.168.0.100";

var moment = require('moment');
var dateFormat = "MMM DD YYYY HH:mm:ss";
var home;
var probes = [];
var actuators = [];
var sensors = [];
var scenarios = [];

url = "http://zibase.net/api/get/ZAPI.php?zibase="+config.zibase+"&token="+config.token+"&service=get&target=home";
request(url, function (err, resp, body) {

    home = JSON.parse(body);
    probes = _.indexBy(home.body.probes, 'id');
    actuators = _.indexBy(home.body.actuators, 'id');
    sensors = _.indexBy(home.body.sensors, 'id');
    scenarios = _.indexBy(home.body.scenarios, 'id');

    console.dir(probes);

});

var dgram = require('dgram');
var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var b = new Buffer(70);
b.fill(0);
b.write('ZSIG\0', 0/*offset*/);
b.writeUInt16BE(13, 4); //command HOST REGISTERING (13)
b.writeUInt32BE(dot2num(clientIp), 50); //Ip address
b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC

//console.log(b);
//console.log(b.toString('hex', 0, b.length));

server.on("error", function (err) {
    console.log("Server error:\n" + err.stack);
    server.close();
});

server.on("message", function (msg, rinfo) {
    var date = moment();
    msg = msg.slice(70);
    msg = msg.toString();
    var id = S(msg).between('<id>', '</id>').s;
    if (probes[id]) {
        msg = msg.replace(/<id>(.*)<\/id>/g, probes[id].name + ' ($1)');
    } else if (sensors[id]) {
        msg = msg.replace(/<id>(.*)<\/id>/g, sensors[id].name + ' ($1)');
    } else if (actuators[id]) {
        msg = msg.replace(/<id>(.*)<\/id>/g, actuators[id].name + ' ($1)');
    }
    //msg = msg.replace(/<(?:.|\n)*?>/gm, ''); // delete all html tags
    console.log(date.format(dateFormat) + " " + msg);
});

server.on("listening", function () {
    var address = server.address();
    console.log("Server listening " +
        address.address + ":" + address.port);
});

client.send(b, 0, b.length, 49999, zibaseIp, function (err, bytes) {
    client.close();
});

server.bind(0x42CC, clientIp);


process.on('SIGINT', function () {
    console.log("Caught interrupt signal");

    var client = dgram.createSocket("udp4");
    b.writeUInt16BE(22, 4); //command HOST UNREGISTERING (22)
    console.log(b);
    client.send(b, 0, b.length, 49999, zibaseIp, function (err, bytes) {
        console.log("Unregistering...", bytes);
        setTimeout(function () {
            console.log("exit");
            client.close();
            process.exit()
        }, 3000);
    });
});

function dot2num(dot) {
    var d = dot.split('.');
    return ((((((+d[0]) * 256) + (+d[1])) * 256) + (+d[2])) * 256) + (+d[3]);
}

function num2dot(num) {
    var d = num % 256;
    for (var i = 3; i > 0; i--) {
        num = Math.floor(num / 256);
        d = num % 256 + '.' + d;
    }
    return d;
}

function getIPAddress() {
    var interfaces = require('os').networkInterfaces();
    for (var devName in interfaces) {
        var iface = interfaces[devName];

        for (var i = 0; i < iface.length; i++) {
            var alias = iface[i];
            if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
                return alias.address;
        }
    }

    return '0.0.0.0';
}