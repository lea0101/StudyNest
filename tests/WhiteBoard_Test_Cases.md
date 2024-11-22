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

# Test Case 2
System: WhiteBoard
Sprint: 3
Severity: 1
Test Whiteboard Image Insertion Feature with Ctrl+V and Image Addresses

## Preconditions
1. Have a valid working image address URL copied to the clipboard.
2. Have a valid URL that leads to a non-image.

## Instructions
1. Open project and start server with npm start.
2. Login in create a new room.
3. Enter the room and join its WhiteBoard page.
4. With the valid image URL copied to the clipboard, press Ctrl+V on the active whiteboard page.
5. In the pop-up modal, press the insert image button.
6. Repeat steps 4 and 5 for both images.

## Expected Result
1. When ctrl+V is presesd, a pop-up modal should appear with the image URL input line populated with whatever the user has on their clipboard.
2. When the insert image button is pressed in the pop-up modal, the image should then appear in the whiteboard in the top left corner.
3. If the image URL is invalid, an error message should appear in the pop-up modal.

# Test Case 3
System: WhiteBoard
Sprint: 3
Severity: 1
Test Whiteboard Image Insertion Feature with Insert Image Button + File

## Preconditions
1. Have a valid image file saved on your computer.
2. Have a non-image file saved on your computer.

## Instructions
1. Open project and start server with npm start.
2. Login in create a new room.
3. Enter the room and join its WhiteBoard page.
4. Press the insert image button.
5. In the pop-up modal, click the upload file button and choose the file you have prepared.
6. Click insert image in the pop-up modal.
7. Repeat steps 4-6 for both images.

## Expected Result
1. When insert image is pressed, a pop-up modal should appear.
2. When "upload file" is pressed, a file explorer should appear for the user to select a file to upload.
3. After clicking the insert image button in the pop-up modal, the image should appear on the cnavas of the whiteboard.
4. If the file uploaded is not a valid image, then an error message should appear in the pop-up modal.

# Test Case 4
System: WhiteBoard
Sprint: 3
Severity: 1
Test Whiteboard Image Transforms and Permanence

## Preconditions
1. Have a valid image files/URLs.

## Instructions
1. Open project and start server with npm start.
2. Login in create a new room.
3. Enter the room and join its WhiteBoard page.
4. Insert the images either by URL or by file upload.
5. Select the grab tool from the toolbar.
6. Use left click to select and drag images around the canvas.
7. Right click one of the images.
8. In the menu items that appear below, adjust the width and height of the image.
9. Press the delete button.
10. Refresh the page.

## Expected Result
1. Valid inserted images should all appear in the top-left corner when first inserted.
2. Left clicking and dragging with the grab tool should move the images around the canvas.
3. Right clicking on an image should show the menu for the resizing/deleting the image. 
4. Changing the width and height input box values should immediately reflect in the resolution of the image.
5. If the width and height are non-positive, the dimensions should remain unchanged.
6. Pressing the delete button should remove the image from the canvas.
7. Refreshing the page should show all the image elements as they last were.