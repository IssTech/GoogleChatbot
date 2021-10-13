'use strict';

const functions = require('firebase-functions');
const {google} = require('googleapis');
const {WebhookClient} = require('dialogflow-fulfillment');

// Enter your calendar ID below and OAuth Credentials
const calendarId = "<Add your calendar ID here>";
const serviceAccount = {<Add your service account details here>}; // Starts with {"type": "service_account",...

// Insert your TimeZone Location America/Los_Angeles and -07:00
const timeZone = 'Europe/Stockholm';
const timeZoneOffset = '+02:00';


// Set up Google Calendar Service account credentials
const serviceAccountAuth = new google.auth.JWT({
  email: serviceAccount.client_email,
  key: serviceAccount.private_key,
  scopes: 'https://www.googleapis.com/auth/calendar'
});

// Login to Google Cloud and generate a temporary Token
const authToken = serviceAccountAuth.authorize(function(err, token) {
  if(err){
    console.log(err);
    return 1;
  }
  console.log('[INFO] Login successfully...');
});

process.env.DEBUG = 'dialogflow:*'; // enables lib debugging statements

exports.dialogflowFirebaseFulfillment = functions.https.onRequest((request, response) => {
   const agent = new WebhookClient({ request, response });
   console.log('[INFO] Started the Webhook process..');
   // console.log("Parameters", agent.parameters);


   function makeAppointment (agent) {
     // Create our Date and Timeset in UTC format and allocate 1 hours for our meeting.
     // When we will convert the Date object to a String.
     console.log('[INFO] Collect Date and Time and prepare the variables...');
     const agentTime = new Date(agent.parameters.time);
     const agentDate = new Date(agent.parameters.date);

     // Merge information from both agent.parameters.date and agent.parameters.time and plus hours.
     const dateTimeStart = timeConvert(agentDate.toISOString(),agentTime.toISOString(), 0);
     const dateTimeEnd = timeConvert(agentDate.toISOString(),agentTime.toISOString(), 1);


     // Colllect other information from Chatbot like, Firstname and Email.
     console.log('[INFO] Collect End-User Information to create a calendar invite...');
     const emailAddress = String(agent.parameters.email);
     const firstName = String(agent.parameters.FirstName);

     // Check the availibility of the time, and make an appointment if there is time on the calendar
     return createCalendarEvent(dateTimeStart, dateTimeEnd, emailAddress, firstName).then(() => {
       // agent.add(`Let me see if we can fit you in on ${AppointmentDate} at ${AppointmentTime}! Yes It is fine!.`);
       agent.add(`Let me see if we can fit you in on ..... at .....! Yes It is fine!.`);
     }).catch(() => {
       agent.add(`I'm sorry, there are no slots available for .... at .....`);
     });
   }
   let intentMap = new Map();
   intentMap.set('Schedule Appointment', makeAppointment);
   agent.handleRequest(intentMap);
 });


function timeConvert(date, time, plusHours) {
  if (date, time) {
    const objDateTime = new Date(date.split('T')[0] + 'T' + time.split('T')[1]);
    if (Number(plusHours) > Number(0)) {
      // If we need to add hours to the set time it will end up here
      // and return + numbers of hours in UTC format
      return new Date(objDateTime.setHours(objDateTime.getHours() + Number(plusHours)));
    }
    return objDateTime;
  }
  console.log('Time or Date is empty');
 return 0;
}

function createCalendarEvent (dateTimeStart, dateTimeEnd, emailAddress, firstName) {
    const calendar = google.calendar({version: 'v3', serviceAccountAuth});
    return new Promise((resolve, reject) => {
      calendar.events.list({
        auth: serviceAccountAuth,
        calendarId: calendarId,
        timeMin: dateTimeStart.toISOString(),
        timeMax: dateTimeEnd.toISOString()
      }, function(err, calendarResponse) {
        if (err || calendarResponse.data.items.length > 0) {
          // Check if there is a event already on the Calendar
          reject(err || new Error('Requested time conflicts with another appointment'));

       } else {
          calendar.events.insert({
            auth: serviceAccountAuth,
            calendarId: calendarId,
            sendUpdates: "all",
            resource: {
              summary: 'Meeting with IssTech, setup by Chatbot ',
              description: 'Thanks ' + firstName + ' for setup a meeting with our Chatbot, please invite ' + emailAddress + ' .',
              start: {
                dateTime: dateTimeStart.toISOString(),
                timeZone: timeZoneOffset
              },
              end: {
                dateTime: dateTimeEnd.toISOString(),
                timeZone: timeZoneOffset
              },
              reminders: {
                 'useDefault': false,
                 'overrides': [
                   {'method': 'popup', 'minutes': 10},
                   {'method': 'email', 'minutes': 30},
                 ]}
              }
          }, function(err, event) {
                if (err) {
                  reject(err);
                } else {
                  resolve(event);
                }
              }
          );
       }
     });
   });
 }
