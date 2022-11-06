const express = require("express");
const webhookController = require("#controllers/webhook.controller");
const router = express.Router();

router.get('/', webhookController.getWebhook)
router.post('/', webhookController.postWebhook)

module.exports = router;