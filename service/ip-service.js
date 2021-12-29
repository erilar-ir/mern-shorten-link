const geoip = require('geoip-lite');

class IpService {
     getIpInfo(ip) {
        const {country, city} = geoip.lookup(ip);
        return { country, city }
    }
}

module.exports = new IpService()
