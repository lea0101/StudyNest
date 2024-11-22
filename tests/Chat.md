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


# Test Case 341
Sprint 3
User Story 4:As a user, I would like to reset my password, if time allows.
This test tests the reset password emailing.
## Instructions
Go to the website and log out if logged in.
From the login page, click on the Forgot Password button
Put in the email to an account with an email that you have access to.
Click the reset password button.
Open your email app and log into the email you put into the bar.
## Expected Results
There should be an email that gives you the option to reset the password

# Test Case 342
Sprint 3
User Story 4:As a user, I would like to reset my password, if time allows.
This test tests the reset password functionality.
## Instructions
Complete test 342
Click the link to reset the password.
In the fields, type a new password.
Go back to the study nest website.
Enter the new password
## Expected Results
The reset password form gives you the option to reset the password.
The user should be able to log into the page given the new password

# Test Case 343
Sprint 3
User Story 4:As a user, I would like to reset my password, if time allows.
This test tests the reset password error.
## Instructions
On the password reset page, put an invalid email like “invalid@gmail.com”
Click the reset password button.
## Expected Results
An invalid user not found error should appear in the bottom of the screen.

# Test Case 351
Sprint 3
User Story 5: As a user, I would like to be able to download and choose sticker packs, if time allows.
This tests the sticker sending functionality.
## Instructions
Go to the study nest website.
Log in and create a new room.
Click the Chat button.
Locate the sticky note button on the bottom of the page and click on it.
From the list of images, click on the top left image.
## Expected Results
After clicking on the sticky node, a list of images in a grid appears.
After clicking on the image, a new message should be sent with the image.

# Test Case 352
Sprint 3
User Story 5: As a user, I would like to be able to download and choose sticker packs, if time allows.
This tests if the sticker was sent properly.
## Instructions
Log into a different account from Test 351
Join the newly created room from Test 351
Click on chat.
## Expected Results
The newly sent sticker should appear in the chat for the other user.

# Test Case 361
Sprint 3
User Story 6: As a user, I would like to be able to react to another user’s message with an emoji, if time allows.
This tests the adding reaction functionality.
## Instructions
Finish Test 351.
Send a new message “Test”.
Click on the new message.
Click on the “Add reaction” button”
From the list of emojis, click on the 🙂
## Expected Results
After clicking on the 🙂, a new emoji should appear underneath # “Test”.

# Test Case 362
Sprint 3
User Story 6: As a user, I would like to be able to react to another user’s message with an emoji, if time allows.
This tests the persistence of reactions## .
## Instructions
Finish Test 361.
Log out of the current account and make/log in to a new account.
Join the room used in Test 351.
Click on the chat in the room.
## Expected Results
The message # “Test” will have the 🙂 emoji underneath it.

# Test Case 363
Sprint 3
User Story 6: As a user, I would like to be able to react to another user’s message with an emoji, if time allows.
This tests m## ultiple reactions.
## Instructions
Finish Test 362.
Underneath “Test”, click on the message.
From the list, click on the ♥️emoji.
## Expected Results
The message # “Test” should have the 🙂 and the ♥️emojis underneath it.

# Test Case 364
Sprint 3
User Story 6: As a user, I would like to be able to react to another user’s message with an emoji, if time allows.
This tests m## ultiple reactions, when they use the same reaction.
## Instructions
Finish Test 362.
Underneath “Test”, click on the 🙂emoji.
## Expected Results
The message “Test” should have the 🙂 underneath it, with a 2 denoting that 2 people reacted to that emoji with 🙂.



