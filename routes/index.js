const { Router } = require("express");
const router = Router();
const calendarRouter = require('./calendars');

router.use("/calendars", calendarRouter);

module.exports = router;