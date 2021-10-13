# Google Calendar Node JS
This is a test script for both read and write to a Google Workspace Calendar.
To use this you need to grant access with a Service Account to your Calendar.
More information can you find on our ['https://isstech.io'](blog post)

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
Open index.js in any preferred text editor, like Atom, VIM or any similar.

### Calendar ID
Add your Calendar ID that you find in your Shared Calendar Settings and add that key to the `calendarId` variable.

### Service Account Key
When you created the Service Account you downloaded a JSON file. Copy all content in that file paste it under the `serviceAccount` variable.

## Deploy
Now can you deploy the code and test your chatbot.
