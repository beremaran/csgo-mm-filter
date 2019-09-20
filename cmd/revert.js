const lib = require("../lib");

module.exports = isVerbose => {
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
      log(`Unblocking ${relay.desc}`);
      lib.unblockRelay(relay);
    });

    lib.flushIpTables();
  });
};
