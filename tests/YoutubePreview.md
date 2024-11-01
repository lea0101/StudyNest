# Test Case 1
## User Story 11
System: YouTube Preview
Sprint: 2
Severity: 2
Test being able to add videos to the queue 

## Prerequisites
1. Have a StudyNest account

## Instructions
1. Open project and start server with npm start
2. Login and navigate to a room
3. Enter the room’s YouTube Preview
4. Press the Add Video button and in the pop-up that appears, type in a valid URL to a Youtube video
5. Press the Add Video button in the pop-up, then enter in an invalid URL
6. Press the Add Video button in the pop-up, then close out of the pop-up

## Expected Result
1. Upon pressing the first Add Video button, the screen should gray out and a pop-up should appear containing an input field, an Add Video button, and a close button
2. When entering a valid link, the input space should clear out, and no error message should appear
3. When entering an invalid link, a pop up should appear showing that the link was invalid
4. Closing out of the pop up, the queue should be updated with the new valid video being added at the bottom, featuring it's thumbnail, title, and duration



# Test Case 2
## User Story 12
System: YouTube Preview
Sprint: 2
Severity: 1
Test the annotation feature of the Youtube Preview system

## Prerequisites
1. Have two separate StudyNest accounts
2. A room with videos already present/the add video feature is function
3. The share feature is functional

## Instructions
1. Open project and start server with npm start
2. Login with the first account and navigate to a room
3. Enter the room’s YouTube Preview
4. Click on a video in the queue if present, or add one using the add feature
5. Go to a random timestamp on the video
6. Enter a comment into the annotation input box below the video, and press the Submit button
7. Go forward by less than 3 seconds in the video and add a second comment
8. Open another browser window, open Study Nest, and login with the second account
9. Use the share feature on the first account to share a link to the room with the second account
10. On the second browser window, join the room joined by the first account and navigate to the newly joined room, and the Youtube Preview
11. In the second browser window, click on the same video, go to the timestamp chosen in step 5, and press play on the video

## Expected Result
1. Upon entering the Youtube Preview and choosing a video, the video should appear like it does on Youtube
2. Going to a random timestamp and submiting a comment should then update the view with the presence of a comment featuring the users display name, the timestamp where they made the comment, and their comment content 
3. When creating a separate comment on a timestamp less than 3 seconds away from the first, both the original and new comments should be visible in chronological order
4. Joining the Youtube Preview on another account, clicking on the same video, and going to the first timestamp should then both the timestamps since they are less than 3 seconds apart
5. When playing the video, after 3 seconds, the first timestamp should disappear, then shortly after the second timestamp, again 3 seconds from when it was created