const program = require("commander");
const isRoot = require("is-root");

if (!isRoot()) {
  console.error(`root/sudo authorization is required to run this script.`);
  process.exit(1);
}

program.version("0.0.1");

program.option("-v, --verbose", "verbose mode");

program
  .command("only <region>")
  .description("Only be able to connect <region> relays.")
  .action(region => {
    require("./cmd/only")(program.verbose, region);
  });

program
  .command("revert")
  .description("Revert firewall configuration")
  .action(() => {
    require("./cmd/revert")(program.verbose);
  });

program
  .command("list")
  .description("List available regions")
  .action(() => {
    require("./cmd/list")();
  });

program
  .command("interactive")
  .description("Interactive mode")
  .action(() => {
    require("./cmd/interactive")(program.verbose);
  });

program.parse(process.argv);
