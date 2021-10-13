import datetime
import time

# You most install Google API Client.
# Please read the README.md file how to setup all dependencies
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Pleasae Modify the credentials and add the Calendar ID
# Calendar ID can you find in your Google Calendar
calendar_id = '<Add your calendar ID here>'

# You need to create a Service Account and create a JSON Key,
# Copy and paste the JSON file you created. If you need help,
# please read the README.md for more information.
SERVICE_ACCOUNT = {<Add your service account details here>} ## Starts with {"type": "service_account",...

# Time settings for this test. You may need to switch timezone depending on where you are located.
# Europe / Stockholm is GMT+02:00
timezone = "Europe/Stockholm"
start_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1)
end_time = datetime.datetime.now(datetime.timezone.utc) + datetime.timedelta(days=1, hours=1)

SCOPES = ['https://www.googleapis.com/auth/calendar']

creds = service_account.Credentials.from_service_account_info(
        SERVICE_ACCOUNT, scopes=SCOPES)

# Try your credentials to Google Calendar API version 3
service = build('calendar', 'v3', credentials=creds)


# Event information that will be created in you calendar.
# It will create a event that is in RFC3339 time format
# based on the start_time, end_time variables above.
# Default is Start Time NOW + 1 Day and it will end at  1 Hours from NOW + 1 Day


event = {
  'summary': 'Meeting with IssTech',
  'location': 'Vasagatan 24, Stockholm, Sweden',
  'description': 'A chance to hear more about IssTech\'s AI Solutions.',
  "start": {
    "dateTime": str(start_time.isoformat()),
    "timeZone": timezone,
  },
  "end": {
    "dateTime": str(end_time.isoformat()),
    "timeZone": timezone,
  },
  'reminders': {
    'useDefault': False,
    'overrides': [
      {'method': 'popup', 'minutes': 10},
    ],
  },
}


# Create the Event and print out the URL.
events = service.events().insert(calendarId=calendar_id, body=event).execute()
print('*' * 100)
print('We have now try to Create a event in your calendar, please view your calendar and see if you can see the event bellow.')
print ('Event created: %s' % (events.get('htmlLink')))
print('*' * 100)

# Sleep for 5 seconds to make sure the event has been created
# and print out all events from your calendar.
time.sleep(5)
print("Let's print all event in your calendar..")
event_result = service.events().list(calendarId=calendar_id, maxResults=10, singleEvents=True, orderBy='startTime').execute()
events = event_result.get('items', [])
print(events)
