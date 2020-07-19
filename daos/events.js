const Events = require('../models/events');

module.exports = {};


  
module.exports.create = async (name, date, calendar) => {
  return await Events.create({ name, date });
};

module.exports.updateById= async(eventId, event, calendar) => {
  return await Events.update({_id: eventId}, event)
};

module.exports.getById = async (id, calendar) => {
  try {
    const event = await Events.findOne({ _id: id }).lean();
    return event;
  } catch (e) {
    return null;
  }
};

module.exports.deleteById = async(id, calendar) => {
  await Events.remove({_id: id});
}

module.exports.getAllEvents = async(calendar)=> {
  try {
    const events = await Events.find({});
    return events
  } catch (e) {
    return null;
  }
}



