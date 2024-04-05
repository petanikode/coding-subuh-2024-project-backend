const { hashPassword } = require("../utils/password");
const { User } = require("./model");

// create admin
User.create({
    name: "Admin",
    email: "admin@admin",
    phoneNumber: "123",
    role: "admin",
    password: hashPassword("admin")
})