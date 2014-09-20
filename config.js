var config = {};


config.zibaseIp = process.env.IP_ZIBASE || '192.168.0.100'; // <- Enter LAN IP address

config.platform = 'zibase.net';
config.zibase = 'ZiBASEXXXXXX'; // <- Enter Main Identifier
config.token = 'XXXXXXXXXX'; // <- Enter Token
config.debug = true;

module.exports = config;
