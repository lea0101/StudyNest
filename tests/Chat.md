# Test Case 211
System: Chat
Sprint: 2
User Story: 3
Severity: 2
> Test upload button and file prompting

## Instructions
1. Open project and start server with npm start
2. Login and navigate to a room
3. Enter the room’s chat
4. Click on the upload icon at the bottom of the page next to the chat input box

## Expected Result
1. Upon clicking, the file prompt should appear
2. Once you have selected a file there should be a confirmation animation
3. If you cancel, it should not be uploaded (and sending a messages should not have the
image)


# Test Case 212
System: Chat
Sprint: 2
User Story: 3
Severity: 2
> Test sending file into chat

## Instructions
1. Open project and start server with npm start
2. Login and navigate to a room
3. Enter the room’s chat
4. Click on the upload icon at the bottom of the page next to the chat input box
5. Select a file
6. Click the send icon

## Expected Result
1. Upon sending, the image should appear in the chat
2. While sending, the chat send icon should vanish
3. After sending, the file input should be cleared and the icon indicate as such

# Test Case 213
System: Chat
Sprint: 2
User Story: 3
Severity: 2
> Test if the previous images are correctly rendered.

## Instructions
1. Open project and start server with npm start
2. Login and navigate to a room
3. Enter the room’s chat

## Expected Result
1. Images from prior sending should appear in the chat
2. Gifs from prior senders should appear in the chat

# Test Case 221
System: Chat
Sprint: 2
User Story: 4
Severity: 2
> Test if the edit and deleting function works correctly.

## Instructions
1. Open the chat in a room you are authenticated to be in.
2. Send the message "hello".
3. Click on the sent message and select "edit" from the options.
4. Edit the message to "hi".
5. Click confirm edit and wait for an edited indicator.
6. Refresh the page.
7. Click on the message again and select "delete".
8. Refresh the page.

## Expected Result
1. The message should prompt you with 3 options upon clicking it.
2. Clicking "edit" should let you modify the contents of the text bubble.
3. Clicking "confirm edit" should disable editing the contents of the text bubble, and an edited indicator should appear below the message that was editied.
4. Refreshing the page should not undo the edit.
5. The message should be deleted and not reappear after refreshing.

# Test Case 231
System: Chat
Sprint: 2
User Story: 5
Severity: 2
> Test the pinging feature

## Instructions
1. Open the chat in a room with multiple users and enter "Ping" into the chat box.
2. Select the user to send a ping to on the left side of the screen by clicking a check box.
3. Click on the bell icon.

## Expected Result
1. The user who was pinged recieves an email with the message "Ping".
2. The sender sees a pop up that says the message sent successfully.

# Test Case 391
System: Chat
Sprint: 3
User Story: 9
Severity: 2
> Test the embed feature for YouTube links

## Instructions
1. Open the chat and submit a message containing a valid YouTube link.
2. Click on the embed that appears and go back to the StudyNest screen.
3. Refresh the page.

## Expected Result
1. The YouTube link should be highlighted and clickable in the message that appears.
2. The thumbnail and title of the video should be shown in the card that appears beneath the original message. 
3. Clicking on the link or embed should redirect the uesr to the YouTube video.
4. Refreshing the page should still show the embed.

# Test Case 392
System: Chat
Sprint: 3
User Story: 9
Severity: 2
> Test the embed feature for images links

## Instructions
1. Open the chat and submit a message containing one or more images.
2. Refresh the page.

## Expected Result
1. The image links should be highlighted and clickable in the message that appears.
2. Each image should appear beneath the original chat message in the order that it was originally sent.
2. Refreshing the page should still show the images.

# Test Case 393
System: Chat
Sprint: 3
User Story: 9
Severity: 2
> Test the embed feature for non-YouTube, non-image links

## Instructions
1. Open the chat and submit a message containing a link to a non-Youtube, non-image website.
2. Refresh the page.

## Expected Result
1. The link should be highlighted and clickable in the message that appears.
2. After a short period, an embed of the website should appear beneath the original message containing the favicon for the website and it's title.
2. Refreshing the page should still show the embed.