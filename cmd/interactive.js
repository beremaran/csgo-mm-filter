const qoa = require("qoa");
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

    qoa
      .prompt([
        {
          type: "interactive",
          query: "Do not block:",
          handle: "relay",
          symbol: ">",
          menu: relays.map(r => r.desc)
        }
      ])
      .then(relaySelectorResult => {
        const relayIndex = relays
          .map(r => r.desc)
          .indexOf(relaySelectorResult.relay);
        const relay = relays[relayIndex];

        log("Blocking other relays ...");
        lib.blockAllRelays(relays);
        lib.unblockRelay(relay);

        lib.flushIpTables();

        log("Pinging relays ...");
        lib.pingRelay(relay).then(pingResults => {
          for (let i = 0; i < pingResults.length; i++) {
            log(`${pingResults[i].avg} ms.`);
          }

          qoa
            .prompt([
              {
                type: "confirm",
                query: "Unblock all?",
                handle: "unblock_confirmed",
                accept: "y",
                deny: "n"
              }
            ])
            .then(unblockResult => {
              log("Unblocking all relays ...");

              relays.forEach(relay => lib.unblockRelay(relay));
            });
        });
      });
  });
};
