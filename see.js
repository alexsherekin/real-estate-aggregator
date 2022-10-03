const fs = require("fs");

const filePath = "./src/accounts.json";
const json = fs.readFileSync(filePath, { encoding: "utf-8" });

console.log(json);
