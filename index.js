require("dotenv").config();
const app = require("./app");

const port = process.env.PORT ;

const { dbConnection } = require("./src/dataBase/database");

app.listen(port, () =>
  console.log(`Server connected on port ${port}`)
);

dbConnection();
