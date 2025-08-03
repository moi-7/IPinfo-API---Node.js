const { IPinfoWrapper } = require("node-ipinfo");
const fs = require("fs");

const ipinfoWrapper = new IPinfoWrapper("#");

const ips = [
  "0.0.0.0",
]

ipinfoWrapper
    .getBatch(ips)
    .then(batch => {
        fs.writeFileSync("output.json", JSON.stringify(batch, null, 2));
        console.log("Results written to output.json");
    });

