const dns = require("dns");
dns.setDefaultResultOrder("ipv4first");
dns.setServers(['8.8.8.8', '1.1.1.1']);

const dotenv = require("dotenv");

dotenv.config();

const connectDB = require("./config/db");

const app = require("./app");

connectDB();

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});