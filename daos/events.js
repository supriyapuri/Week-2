const Events = require('../models/events');

module.exports = {};


  
module.exports.create = async (name, date, associatedCalendarId) => {
  const newEvent = await Events.create({ name, date, associatedCalendarId });
  return {name: newEvent.name, date: newEvent.date, _id: newEvent._id }
};

module.exports.updateById= async(eventId, event) => {
  return await Events.update({_id: eventId}, event)
};

module.exports.getById = async (id) => {
  try {
    const event = await Events.findOne({ _id: id }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async(id) => {
  await Events.remove({_id: id});
}

module.exports.getAllEvents = async(associatedCalendarId)=> {
    const events = await Events.find({associatedCalendarId});
    
    return events;
}



