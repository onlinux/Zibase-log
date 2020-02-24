
var request = require("request");
var S = require('string');
var config = require('./config')
var fs = require("fs");
var parseString = require('xml2js').parseString;


var debug = true;

url = 'http://'+config.platform+'/m/get_xml.php?device='+config.zibase+'&token='+config.token;
app_script = '';

request(url, function (err, resp, body) {
    if (debug) {
        console.info(url);
        console.info(resp);
    }
    if (err) {
        console.log ("Could not retrieve data from zibase! ", err);
        return;
    }

    parseString(body, function(err, result) {
        result.r.e.forEach (function(i) {
            console.log(i.n);
            app_script = app_script + S(i.n).replaceAll(' ', '_').s + '\n'
        });

    });


    fs.writeFile("zidomn10.js", app_script, "UTF-8");

});

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
