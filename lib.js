const fetch = require("node-fetch");
const ping = require("ping");
const exec = require("child_process").execSync;

function blockIP(ip) {
  try {
    exec(`iptables -A OUTPUT -d ${ip} -j DROP`);
  } catch (err) {}
}

function unblockIP(ip) {
  try {
    exec(`iptables -D OUTPUT -d ${ip} -j DROP`);
  } catch (err) {}
}

function flushIpTables() {
  exec(`iptables-save`);
}

function fetchNetworkDatagramConfig() {
  return new Promise((resolve, reject) => {
    fetch(
      "https://raw.githubusercontent.com/SteamDatabase/SteamTracking/master/Random/NetworkDatagramConfig.json"
    )
      .then(res => res.json())
      .then(resolve)
      .catch(reject);
  });
}

function extractRelays(serverList) {
  const _list = [];

  Object.keys(serverList.pops).forEach(regionKey => {
    const region = serverList.pops[regionKey];

    if (!region.relays) {
      return;
    }

    _list.push({
      desc: `[${regionKey}] ${region.desc}`,
      regionCode: regionKey,
      addresses: region.relays.map(regionRelay => regionRelay.ipv4)
    });
  });

  return _list;
}

function blockRelay(relay) {
  relay.addresses.forEach(address => blockIP(address));
}

function blockAllRelays(relayList) {
  relayList.forEach(relay => {
    this.blockRelay(relay);
  });
}

function unblockRelay(relay) {
  relay.addresses.forEach(address => unblockIP(address));
}

function pingRelay(relay) {
  return Promise.all(
    relay.addresses.map(address => ping.promise.probe(address))
  );
}

module.exports = {
  pingRelay,
  unblockRelay,
  blockAllRelays,
  blockRelay,
  extractRelays,
  fetchNetworkDatagramConfig,
  unblockIP,
  blockIP,
  flushIpTables
};
