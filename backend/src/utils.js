const { SnowflakeId } = require("@akashrajpurohit/snowflake-id");

const workerId = process.pid % 1024;
const snowflake = SnowflakeId({ workerId });

const decStrToHex = (str) => BigInt(str).toString(16).toUpperCase();

module.exports = {
  snowflake,
  decStrToHex,
};
