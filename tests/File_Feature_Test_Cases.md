# Test Case 261
Sprint 2

User Story 6
As a user, I would like to upload a file into the room.
# Instructions
1) On the test device, have available a PDF file of <2MB in size.
2) Log into StudyNest
3) Join a group or enter an existing group.
4) Click on "File Sharing"
5) Click on "Browse Device" on the left.
6) Select the PDF from the device.
7) Press Submit.
# Expected Results
1) The file appears on the left side of the screen, under "Files in this Room"
2) The file is listed under file_uploads/{roomName} in the database with a unique prefix to prevent overwriting.

# Test Case 262
Sprint 2

User Story 6
As a user, I would like to upload a file into the room.
# Instructions
1) On the test device, have available a PDF file of <2MB in size.
2) Log into StudyNest
3) Join a group or enter an existing group.
4) Click on "File Sharing"
5) From the device, drag and drop the PDF file into the box labeled appropriately.
6) Press Submit.
# Expected Results
1) The file appears on the left side of the screen, under "Files in this Room"
2) The file is listed under file_uploads/{roomName} in the database with a unique prefix to prevent overwriting.

# Test Case 263
Sprint 2

User Story 6
As a user, I would like to upload a file into the room.
# Instructions
1) On the test device, have available a PDF file of <2MB in size.
2) Log into StudyNest
3) Join a group or enter an existing group.
4) Click on "File Sharing"
5) From the device, drag and drop the PDF file into the box labeled appropriately.
6) Press Submit.
7) Press "Home"
8) Join a different group or enter a different existing group
9) Click on "File Sharing"
# Expected Results
1) The file uploaded to the first group is not visible under "Files in this Room" when entering the new room.


# Test Case 264
Sprint 2

User Story 6
As a user, I would like to upload a file into the room.
# Instructions
1) On the test device, have available a PDF file of <2MB in size.
2) Log into StudyNest
3) Join a group or enter an existing group.
4) Click on "File Sharing"
5) From the device, drag and drop the PDF file into the box labeled appropriately.
6) Press Submit.
7) Log out of StudyNest.
8) Log into another account.
9) Join the same group as the previous user.
10) Click on "File Sharing"
# Expected Results
1) The file uploaded by the first user should be visible under "Files in this Room"

# Test Case 265
Sprint 2

User Story 6
As a user, I would like to upload a file into the room.
# Instructions
1) On the test device, have available a PDF file of >2MB in size.
2) Log into StudyNest
3) Join a group or enter an existing group.
4) Click on "File Sharing"
5) From the device, drag and drop the PDF file into the box labeled appropriately.
6) Press Submit.
# Expected Results
1) An error message stating that the user is exceeding the file size limit should appear.
2) The file should not appear in the room's list of files nor on the database.


# Test Case 266
Sprint 2

User Story 6
As a user, I would like to upload a file into the room.
# Instructions
1) On the test device, have available a non-PDF file.
2) Log into StudyNest
3) Join a group or enter an existing group.
4) Click on "File Sharing"
5) From the device, drag and drop the file into the box labeled appropriately.
6) Press Submit.
# Expected Results
1) An error message stating that the user must upload a PDF file should appear.
2) The file should not appear in the room's list of files nor on the database.

# Test Case 271
Sprint 2

User Story 7
As a user, I would like to see the same file as everyone else in the room.
# Instructions
1) Log into StudyNest
2) Join a group or enter an existing group, given that the group has files uploaded to it.
3) Click on "File Sharing"
# Expected Results
1) The list of previously uploaded files should appear on the left.

# Test Case 272
Sprint 2

User Story 7
As a user, I would like to see the same file as everyone else in the room.
# Instructions
1) Log into StudyNest
2) Enter an existing group that the user has uploaded files to.
3) Leave the group.
4) Log out of StudyNest and log back in as a different user.
5) Join the previous group.
6) Click on "File Sharing"
# Expected Results
1) The previously uploaded files should be on the left, including those of the user who left the group.

# Test Case 281
Sprint 2

User Story 8
As a user, I would like to make notes on the file that everyone else in the room can also see.
# Instructions
1) Log into StudyNest
2) Enter an existing group with files uploaded to it.
3) Click and select to highlight a portion of the file.
4) Click the note icon.
5) Type in a note and click OK
# Expected Results
1) The note should appear on the user screen when they hover over the highlighted text.
2) Refreshing the page should not remove the note -- it should still be there after re-opening the file.


# Test Case 282
Sprint 2

User Story 8
As a user, I would like to make notes on the file that everyone else in the room can also see.
# Instructions
1) Log into StudyNest
2) Enter an existing group with files uploaded to it that have been annotated.
4) Navigate to the File Sharing page
5) Open a file that other users have annotated
# Expected Results
1) The annotated notes should appear when hovering over the highlighted text portions.

