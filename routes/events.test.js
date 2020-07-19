const request = require("supertest");
const sinon= require('sinon');

const server = require("../server");
const testUtils = require('../test-utils');
const eventsDao = require('../daos/events');

describe("/events", () => {
    beforeAll(testUtils.connectDB);
    afterAll(testUtils.stopDB);

//   afterEach(testUtils.clearDB);

 describe("GET (no matching result if incorrect id is given) /:id", () => {
    let calendarEvent1;

    beforeEach(async () => {
        calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
    });

    afterEach(async () =>{
        const res= await request(server).delete("/calendars/" + calendarEvent1._id);
        expect(res.statusCode).toEqual(200);
    });

    it("should return 404 if no matching id", async () => {
      const res = await request(server).get(`/calendars/${calendarEvent1._id }/events/any_id`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe("GET (no matching result) /", () => {
    let calendarEvent1;

    beforeEach(async () => {
        calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
    });

    afterEach(async () =>{
        const res= await request(server).delete("/calendars/" + calendarEvent1._id);
        expect(res.statusCode).toEqual(200);
    });

    it("should return 404 if there is no id", async () => {
      const res = await request(server).get(`/calendars/${calendarEvent1._id }/events/`);
      expect(res.statusCode).toEqual(404);
    });
  });

  describe('POST( getting error if no name or date is added, no name is added or no date is added) /', () => {
    let calendarEvent1;

    beforeEach(async () => {
        calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
    });
    it('should return a 400 without a provided name and date', async () => {
      const res = await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({}); 
      expect(res.statusCode).toEqual(400);    
    });
    it('should return a 400 without a provided date', async () => {
        const res = await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({name: 'event1'}); 
        expect(res.statusCode).toEqual(400);    
      });
      it('should return a 400 without a provided name', async () => {
        const res = await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({date: new Date() }); 
        expect(res.statusCode).toEqual(400);    
      });

      it('should throw a 500 error when an error is encountered', async () => {
          sinon.stub(eventsDao, 'create').throws(Error('db query failed'));
          const res = await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'testFailedEvent', date: new Date() });
          expect(res.statusCode).toEqual(500);
      });
      
    afterEach(async () =>{
        sinon.restore();
        const resCalender= await request(server).delete("/calendars/" + calendarEvent1._id);
        expect(resCalender.statusCode).toEqual(200);
    });

  });

   describe('GET /:id after multiple POST /', () => {
     let event1, event2, calendarEvent1;
     let date = (new Date()).toISOString();

    beforeEach(async () => {
      calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
      event1 = (await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'event1', date: date })).body;
      event2 = (await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'event2', date: date })).body;
    });

    it('should return event1 using its id', async () => {
      const res = await request(server).get(`/calendars/${calendarEvent1._id }/events/${event1._id}`);
      expect(res.statusCode).toEqual(200);    
      const storedEvent = res.body;
      expect(storedEvent).toMatchObject({ 
        name: 'event1', 
        date: date,
        _id: event1._id 
      });
    });

    it('should return event2 using its id', async () => {
      const res = await request(server).get(`/calendars/${calendarEvent1._id }/events/${event2._id}`);
      expect(res.statusCode).toEqual(200);    
      const storedEvent = res.body;
      expect(storedEvent).toMatchObject({ 
        name: 'event2', 
        date: date ,
        _id: event2._id 
      });
    });
  
  afterEach(async () =>{
    const resCalender = await request(server).delete("/calendars/" + calendarEvent1._id);
    expect(resCalender.statusCode).toEqual(200);
    const resEvent1 = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event1._id}`);
    expect(resEvent1 .statusCode).toEqual(200);
    const resEvent2 = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event2._id}`);
    expect(resEvent2 .statusCode).toEqual(200);
  });

});

  describe('GET / after multiple POST /', () => {
    let event1, event2, calendarEvent1;


    beforeEach(async () => {
        calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
        event1 = (await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'event1', date: new Date() })).body;
        event2 = (await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'event2', date: new Date() })).body;
    });

    it('should return all events', async () => {
      const res = await request(server).get(`/calendars/${calendarEvent1._id }/events/`);
      expect(res.statusCode).toEqual(200);    
      const storedEvents = res.body;
      expect(storedEvents).toMatchObject([event1, event2]);
    });

    afterEach(async () =>{
        const resCalender = await request(server).delete("/calendars/" + calendarEvent1._id);
        expect(resCalender.statusCode).toEqual(200);
        const resEvent1 = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event1._id}`);
        expect(resEvent1 .statusCode).toEqual(200);
        const resEvent2 = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event2._id}`);
        expect(resEvent2 .statusCode).toEqual(200);
      
    });
  });

  describe('PUT /:id after POST /', () => {
    let event1, calendarEvent1;
    let date = (new Date()).toISOString();

    beforeEach(async () => {
        calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
        event1 = (await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'event1', date: new Date() })).body;
    });

    it('should store and return event1 with new name', async () => {
        const res = await request(server)
          .put(`/calendars/${calendarEvent1._id }/events/${event1._id}`)
          .send({ name: 'new name'});
        expect(res.statusCode).toEqual(200);    
  
        const storedEvent = (await request(server).get(`/calendars/${calendarEvent1._id }/events/${event1._id}`)).body;
  
        expect(storedEvent).toMatchObject({ 
          name: 'new name', 
          _id: event1._id 
        });
      });
      it('should store and return event1 with new date', async () => {
        const res = await request(server)
          .put(`/calendars/${calendarEvent1._id }/events/${event1._id}`)
          .send({ date: date});
        expect(res.statusCode).toEqual(200);    
  
        const storedEvent = (await request(server).get(`/calendars/${calendarEvent1._id }/events/${event1._id}`)).body;

        expect(storedEvent).toMatchObject({ 
            date: date, 
          _id: event1._id 
        });
      });

      it('should return 400 if request does not have date & name', async()=>{
        const res = await request(server)
        .put(`/calendars/${calendarEvent1._id }/events/${event1._id}`)
        .send({});
        
        expect(res.statusCode).toEqual(400);
    });

      it('should return 500 if there error is encountered', async()=>{
        const res = await request(server)
        .put(`/calendars/${calendarEvent1._id }/events/123`)
        .send({ name: 'new name'});
        
        //MongoDB Object Cast Exception
        expect(res.statusCode).toEqual(500);
    });
    
    
    afterEach(async () =>{
        const resCalender = await request(server).delete("/calendars/" + calendarEvent1._id);
        expect(resCalender.statusCode).toEqual(200);
        const resEvent1 = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event1._id}`);
        expect(resEvent1 .statusCode).toEqual(200);
    });
  });

  describe('DELETE (event_id) /:id after POST /', () => {
    let event1, calendarEvent1;

    beforeEach(async () => {
        calendarEvent1 = (await request(server).post("/calendars").send({name: 'calendar1'})).body;
        event1 = (await request(server).post(`/calendars/${calendarEvent1._id }/events/`).send({ name: 'event1', date: new Date() })).body;
    });

    it('should delete and not return event1 on next GET', async () => {
      const res = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event1._id}`);
      expect(res.statusCode).toEqual(200);    
      const storedCalendarResponse = (await request(server).get(`/calendars/${calendarEvent1._id }/events/${event1._id}`));
      expect(storedCalendarResponse.status).toEqual(404);
    });

    it(' should return 500 if error is encountered', async () =>{
        sinon.stub(eventsDao, 'deleteById').throws(Error('db query failed'));
        const res = await request(server).delete(`/calendars/${calendarEvent1._id }/events/${event1._id}`);
        expect(res.statusCode).toEqual(500);
    });
    afterEach(async()=>{
        sinon.restore();
    });

  });
});