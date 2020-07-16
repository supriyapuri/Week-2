const mongoose = require('mongoose');

// const eventSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   data: {type: Date, required: true}
// });

const calendarSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // events: {type: [eventSchema]}

});


module.exports = mongoose.model("calendars", calendarSchema);
