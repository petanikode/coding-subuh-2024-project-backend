var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");

const swaggerUi = require("swagger-ui-express");
//const swaggerDocument = require("./swagger.json");

const fs = require("node:fs");
const YAML = require("yaml");

const file = fs.readFileSync("./swagger.yaml", "utf8");
const swaggerDocument = YAML.parse(file);

var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var authRouter = require("./routes/auth");
const authToken = require("./middleware/authToken");
const onlyAdmin = require("./middleware/onlyAdmin");

var app = express();

app.use(cors());
app.use(logger("dev"));
// middleware supaya bisa terima req.body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

//app.use('/', indexRouter);
app.use("/register", require("./routes/register"));
app.use("/auth", authRouter);
app.use("/me", require("./routes/me"));
app.use("/users", usersRouter);
app.use("/cart", authToken, require("./routes/cart"));
app.use("/products", require("./routes/product"));

app.use(
  "/admin/products",
  authToken,
  onlyAdmin,
  require("./routes/admin/product"),
);

module.exports = app;
