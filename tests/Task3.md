# Test Case 211
System: Chat
Sprint: 2
Severity: 2
Test upload button and file prompting

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
Severity: 2
Test sending file into chat

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
Severity: 2
Test if the previous images are correctly rendered.

## Instructions
1. Open project and start server with npm start
2. Login and navigate to a room
3. Enter the room’s chat

## Expected Result
1. Images from prior sending should appear in the chat
2. Gifs from prior senders should appear in the chat
