const Calendars = require('../models/calendars');

module.exports = {};
  
module.exports.create = async (name) => {
  return await Calendars.create({ name });
};

module.exports.updateById= async(calendarId, calendar) => {
  return await Calendars.update({_id: calendarId}, calendar)
};

module.exports.getById = async (id) => {
  try {
    const calendar = await Calendars.findOne({ _id: id }).lean();
    return calendar;
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async(id) => {
  await Calendars.remove({_id: id});
}

module.exports.getAllCalendars = async()=> {
  try {
    const calendars = await Calendars.find({});
    console.log(calendars);
    return calendars
  } catch (e) {
    return null;
  }
}


// const calendars = await Calendars.find(id);
//     calendars.array.forEach(element => {
//       return element




// db.c.find({}, {_id:1}).map(function(item){ return item._id; })

