const lib = require("../lib");

module.exports = (isVerbose, regionCode) => {
  const log = msg => {
    if (!isVerbose) {
      return;
    }

    console.log(msg);
  };

  log("Fetching network datagram config ...");
  lib.fetchNetworkDatagramConfig().then(serverList => {
    log("Extracting relay data ...");
    const relays = lib.extractRelays(serverList);

    relays.forEach(relay => {
      if (relay.regionCode === regionCode) {
        return;
      }

      log(`Blocking ${relay.desc}`);
      lib.blockRelay(relay);
    });

    const relay = relays.filter(r => r.regionCode === regionCode)[0];

    log(`Pinging relay addresses ...`);
    lib.pingRelay(relay).then(pingResults => {
      pingResults.forEach(pingResult => {
        console.log(`[${pingResult.host}] ${pingResult.avg} ms.`);
      });
    });

    lib.flushIpTables();
  });
};
