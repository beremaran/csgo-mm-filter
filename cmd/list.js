const lib = require("../lib");

module.exports = () => {
  lib.fetchNetworkDatagramConfig().then(serverList => {
    const relays = lib.extractRelays(serverList);

    relays.map(r => r.desc).forEach(description => console.log(description));
  });
};
