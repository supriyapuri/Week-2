// const { Router } = require("express");
// const router = Router();

// const {Router2} = require('./events');
// const events = Router2();

const router = require('express').Router();
const events = require('./events');



const CalendarDAO = require('../daos/calendars');


// create
router.post("/", async (req, res, next) => {
  const { name } = req.body;
  if (!name) {
    res.status(400).send('body parameter "name" is required"');
    } 
  else {
    try{
      const calendar = await CalendarDAO.create(name);
      res.json(calendar);
      }
    catch(e) {
      res.status(500).send(e.message);
    }
    
  }
});

//read - single calendar id
router.get("/:id", async (req, res, next) => {
  const calendar = await CalendarDAO.getById(req.params.id);
  if (calendar) {
    res.json(calendar);
    } 
    else {
    res.sendStatus(404);
    }
});


// update
router.put("/:id", async (req, res, next) => {
  const calendarId= req.params.id;
  const calendar = req.body;
  
  if (!calendar || JSON.stringify(calendar)=== '{}'){
    res.status(400).send('calendar is required');
  } else
  {
    const updatedCalendar = await CalendarDAO.updateById(calendarId, calendar);
    res.json(updatedCalendar)
  } 
});

// delete
router.delete("/:id", async (req, res, next) => {
  const calendarId = req.params.id;
  try {
    await CalendarDAO.deleteById(calendarId);
    res.sendStatus(200);
    } catch(e){
      res.status(500).send(e.message);
    }
    
});

//get all

router.get("/", async (req, res, next) => {
  
  const calendar = await CalendarDAO.getAllCalendars();
  
  if (calendar) {
    res.json(calendar);
    } 
    else {
    res.sendStatus(404);
    }
});



router.use('/:calendarId/events', function(req, res, next) {
  req.calendarId = req.params.calendarId;
  next()
}, events);




 module.exports = router;