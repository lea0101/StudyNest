# Test Case 1
System: WhiteBoard
Sprint: 2
Severity: 2
Test WhiteBoard Authentication and Authorization

## Preconditions
1. Have two separate account registered in StudyNest.

## Instructions
1. Open project and start server with npm start.
2. Login in with the first account and create a new room.
3. Enter the room and join its WhiteBoard page.
4. In a separate browser window, open StudyNest and login with the second account.
5. Copy and paste the URL from the first browser window to the second browser window and hit enter.

## Expected Result
1. The first account should be able to view the the whiteboard page and interact with the system normally.
2. The second account, upon entering in the URL from the first browser window, should be presented with a Not Authorized Page. 