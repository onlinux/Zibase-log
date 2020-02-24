#!/usr/bin/node

/*
 +-+-+-+-+-+-+-+-+-+-+
 |o|n|l|i|n|u|x|.|f|r|
 +-+-+-+-+-+-+-+-+-+-+
 https://github.com/onlinux/Zibase-log

 */
var mqtt = require('mqtt');
var _ = require('underscore');
var request = require("request");
var S = require('string');
var config = require('./config')
var winston = require('winston');
var fs = require('fs');
var env = process.env.NODE_ENV || 'development';
var logDir = '/var/log';
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}
var tsFormat = function(){ return new Date().toLocaleString() } ;
var logger = new (winston.Logger)({
  transports: [
    // colorize the output to the console
    new (winston.transports.Console)({
      timestamp: tsFormat,
      colorize: true,
      level: 'info'
    }),
    new (winston.transports.File)({
      filename: "/var/log/zibase.log",
      json: false,
      timestamp: tsFormat,
      level: env === 'development' ? 'debug' : 'info'
    })
  ]
});
var clientIp = process.env.MYIP || getIPAddress();
var zibaseIp; 
//var zibaseIp = config.zibaseIp || "192.168.0.100";

var moment = require('moment');
var dateFormat = "MMM DD YYYY HH:mm:ss";
var home;
var probes = [];
var actuators = [];
var sensors = [];
var scenarios = [];
var cameras = [];
var variables = [];
var debug = config.debug || false;

var options = {
    keepalive: 10,
    username:"onlinux",
    password:"ericvde31830",
    clean:true,
    reconnectPeriod: 1000 * 1
}

var mqttc;



url = 'https://'+config.platform+'/cgi-bin/decodetab?token='+config.token;

request(url, function (err, resp, body) {
    if (debug) {
        console.info(url);
    }
    if (err) {
        logger.error ("Could not retrieve data from zibase.net! ", err);
        return;
    }
    home = JSON.parse(body);
    probes = _.indexBy(home.body.probes, 'sid');
    actuators = _.indexBy(home.body.actuators, 'id');
    sensors = _.indexBy(home.body.sensors, 'id');
    scenarios = _.indexBy(home.body.scenarios, 'id');
    variables = home.body.variables;
    cameras = _.indexBy(home.body.camerass, 'sid');

    if (debug) console.dir(actuators);

});

var dgram = require('dgram');
var server = dgram.createSocket("udp4");
var client = dgram.createSocket("udp4");

var b = new Buffer(70);

//unregister(); 
//logger.info(b);
//logger.info(b.toString('hex', 0, b.length));

server.on("error", function (err) {
    logger.info("Server error:\n" + err.stack);
    server.close();
});
server.on("listening", function () {
    var address = server.address();
    logger.info("Server listening " +
        address.address + ":" + address.port);
});
server.on("message", function (msg, rinfo) { 
    
   logger.info(msg, rinfo);
   processMessage(msg, rinfo);       

});
client.on('listening', function(){
    var address = client.address();
    client.setBroadcast(true);
    logger.info("Client listening on port: " + address.port);
});

client.on("message", function (msg, rinfo) {
    var date = moment();
    var ip = msg.readUInt32BE(38, 4); //msg.readUIntBE if node -v > 11
    zibaseIp = num2dot(ip);

    logger.info ( msg.toString(undefined, 6,12 )+ " " + msg.toString(undefined, 22,34 ) + ' IP is  ' + zibaseIp);
    
    
    if (zibaseIp) {

            //HOST REGISTERING
            b.fill(0);
            b.write('ZSIG\0', 0/*offset*/);
            b.writeUInt16BE(13, 4); //command HOST REGISTERING (13)
            b.writeUInt32BE(dot2num(clientIp), 50); //Ip address
            b.writeUInt32BE(0x42CC, 54); // port 17100 is 0x42CC
        
            var ts = Math.round((new Date()).getTime() / 1000);
            b.writeUInt32BE(ts, 58); // send timestamp as PARAM3 <---------------------------
            
            logger.info('HOST REGISTERING sent to ' + zibaseIp+ ' with  ' + ts.toString() + ' as timestamp');
            client.send(b, 0, b.length, 49999, zibaseIp, function (err, bytes) {
            // client.close();
            });    
    }
});

function publish(idx, action, id, name){
   var date = moment(); 
   mqttc = mqtt.connect("mqtt://192.168.0.112",options);
   mqttc.on("connect",function(){	
        if (debug) logger.info("connected");
        if (mqttc.connected==true){
            str = '{"idx":'+ idx + ',"nvalue":' + action +',"svalue":"","ZID": "' + id + '", "NAME":"' + name +'"}'
            logger.info(str);
            mqttc.publish("domoticz/in", str)
            mqttc.end();
        } else {
            logger.error("MQTT connection False\n");
        }
    });

    mqttc.on("error",function(error){ 
        logger.error("Can't connect"+error);
        mqttc.end();
    });
   
}

var ZIDs = config.ids;
    
function processMessage(msg, rinfo) {
    var date = moment();
    msg = msg.slice(70);
    msg = msg.toString();
     if (debug) logger.info(msg);
    
    if (S(msg).contains('SCENARIO')) {

        var id= msg.replace(/\w* SCENARIO: (\d*)(.*)/,'$1');
        //id = parseInt(id);
        if (id  && scenarios[id]) {

                msg = msg + ' ' + scenarios[id].name;
        }

    } else if ( S(msg).contains('Sent radio ID') ){
        var id = S(msg).splitRight(' ', 1);
        var action = (S(id[1]).contains('_ON') ) ? 1:0;
        idx = S(id[1]).strip().s
        idx = S(idx).strip('_ON','_OFF', '\u0000').s;
        if (debug) logger.info( action, idx);
        var name =  (actuators[idx]) ? actuators[idx].name : "none"
        if (ZIDs[idx]) publish(ZIDs[idx], action , idx, name );
    } else {
        var id = S(msg).between('<id>', '</id>').s;
        var bat = S(msg).between('<bat>', '</bat>').s;
        if (debug) logger.info(id + ' ' + bat);
        var action = (S(id).contains('_OFF') ) ? 0:1;
        var idx = S(id).strip('_ON','_OFF').s;
        
        if (probes[idx]) {
            msg = msg.replace(/<id>(.*)<\/id>/g, probes[idx].name + ' probe ($1)');
            //mqttc.publish('domoticz/in', '{"idx":25,"nvalue":1,"svalue":"","Battery":86,"RSSI":10}');
        } else if (sensors[idx]) {
            msg = msg.replace(/<id>(.*)<\/id>/g, sensors[idx].name + ' sensor ($1)');
            if (debug) logger.info(idx + ' ' + action);
            if (ZIDs[idx])
                publish(ZIDs[idx], action , idx , sensors[idx].name);
        } else if (actuators[idx]) {
            msg = msg.replace(/<id>(.*)<\/id>/g, actuators[idx].name + ' actuator ($1)');
            
        }
    }


    if (!debug) {
        msg = msg.replace(/<(?:.|\n)*?>/gm, ''); // delete all html tags
    }
    //logger.info(date.format(dateFormat) + " " + msg);
};


b.fill(0);
b.write('ZSIG\0', 0/*offset*/);
b.writeUInt16BE(8, 4); // command NOP (08) ZIBASE DISCOVERY
// Broadcast msg on lan to retrieve zibase IP
client.send(b, 0, b.length, 49999, '192.168.0.255', function (err, bytes) {
    logger.info(b);
});
server.bind(0x42CC, clientIp); //port 17100 is 0x42CC

process.on('SIGINT', function () {
    logger.info("Caught interrupt signal");
    b.fill(0);
    b.write('ZSIG\0', 0/*offset*/);
    b.writeUInt32BE(dot2num(clientIp), 50); //Ip address
    b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC
    b.writeUInt16BE(22, 4); //command HOST UNREGISTERING (22)
    logger.info(b);
    logger.info('HOST UNREGISTERING sent to ' + zibaseIp);
    client.send(b, 0, b.length, 49999, '192.168.0.255', function (err, bytes) {
        logger.info("Unregistering...", bytes);
        setTimeout(function () {
            logger.info("exit");
            client.close();
            process.exit()
        }, 1000);
    });
});

function unregister() {
    var client = dgram.createSocket("udp4");
    b.fill(0);
    b.write('ZSIG\0', 0/*offset*/);
    b.writeUInt32BE(dot2num(clientIp), 50); //Ip address
    b.writeUInt32BE(0x42CC, 54); // port 17100 0x42CC
    b.writeUInt16BE(22, 4); //command HOST UNREGISTERING (22)
    logger.info(b);
    logger.info('HOST UNREGISTERING sent to ' + zibaseIp);
    logger.info(b);
    client.send(b, 0, b.length, 49999, '192.168.0.255', function (err, bytes) {
        logger.info("Unregistering...", bytes); 
        client.close();
    });    
}

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
