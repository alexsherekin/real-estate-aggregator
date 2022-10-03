const fs = require("fs");

const filePath = "./src/accounts.json";
let json = fs.readFileSync(filePath, { encoding: "utf-8" });

json = json.replace(/%SECRET%/g, process.env.E2E_SECRET);

fs.writeFileSync(filePath, json, { encoding: "utf-8" });
