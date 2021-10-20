# Google Calendar Python Test
This is a test script for both read and write to a Google Workspace Calendar.
To use this you need to grant access with a Service Account to your Calendar.
More information can you find on our [Blog](https://www.isstech.io/blogg/)

## Quick Guide
Before you start make sure you have done following.
1. Create a agent in DialogFlow
2. Enable Billing
3. Enable the Google Calendar API for you Project
4. Create a Service Account and copy the JSON File with credentials. (We need this)
5. Create a Shared Calender
6. Grant access to the Service Account
7. Created OAuth Scope with the Service Account Client ID.

## Configuration
Open test.py in any preferred text editor, like Atom, VIM or any similar.
It is recommended to create a virtual environment wrapper before you use this code, because we need to install a few dependancies.

To install all required dependancies please run.
`pip install -r requirements.txt`

### Calendar ID
Add your Calendar ID that you find in your Shared Calendar Settings and add that key to the `CALENDAR_ID` variable.

### Service Account Key
When you created the Service Account you downloaded a JSON file. Copy all content in that file paste it under the `SERVICE_ACCOUNT` variable.

## RUN
When you have configured the script you should be able to create a Calendar Invite in your shared Google calendar.
