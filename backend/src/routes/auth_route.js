const express = require("express");
const router = express.Router();
const auth_controller = require("../controllers/auth_controller");

router.post("/registerGerente", auth_controller.registerGerente);

module.exports = router;
