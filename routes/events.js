const events = require('express').Router({ mergeParams: true });

const EventDAO = require('../daos/events');
const CalendarDAO= require('../daos/calendars')


// create

events.post("/", async (req, res, next) => {
  
  const { name, date } = req.body;

  if (!name) {
    res.status(400).send('body parameter "name" is required"');
    } 
  else if (!date){
    res.status(400).send('body parameter "date" is required"');

  }
  else {
    try{
      const event = await EventDAO.create(name, date, req.calendarId);
      res.json(event);
      }
    catch(e) {
      res.status(500).send(e.message);
    }
    
  }
});

//read - single event id

events.get("/:id", async (req, res, next) => {
  const event = await EventDAO.getById(req.params.id);
  if (event) {
    res.json(event);
    } 
    else {
    res.sendStatus(404);
    }
});


// update

events.put("/:id", async (req, res, next) => {
  const eventId= req.params.id;
  const event = req.body;
  
  try{
    if (!event || JSON.stringify(event) === '{}'){
      res.status(400).send('atleast name or date is required');
    } else
    {
      const updatedEvent= await EventDAO.updateById(eventId, event);
      res.json(updatedEvent)
    } 
} catch (e) {
  res.status(500).send(e.message);
}

});

// delete
events.delete("/:id", async (req, res, next) => {
  const eventId = req.params.id;
  try {
    await EventDAO.deleteById(eventId);
    res.sendStatus(200);
    } catch(e){
      res.status(500).send(e.message);
    }
    
});

//get all

events.get("/", async (req, res, next) => {
  const event = await EventDAO.getAllEvents(req.calendarId);
  if (event.length) {
    res.json(event);
  } 
  else {
    res.sendStatus(404);
  }
});


module.exports = events;