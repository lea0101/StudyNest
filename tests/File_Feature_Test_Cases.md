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


# Test Case 311
Sprint 3

User Story 1
As a user, I would like to make highlights on the file that everyone else in the room can also see.
# Instructions
1) Log into StudyNest
2) Enter an existing group that has files uploaded to it.
3) Navigate to the File Sharing page.
4) Open a file.
5) Select some text on the page,
6) Press the highlight icon.
# Expected Results
1) The selected text should be highlighted
2) The user should not be prompted to add a note

# Test Case 312
Sprint 3

User Story 1
As a user, I would like to make highlights on the file that everyone else in the room can also see.

This test handles the edge case where two users highlight the same area.
# Instructions
1) Log into StudyNest
2) Enter an existing group that has files uploaded to it.
3) Navigate to the File Sharing page.
4) Open a file.
5) Select some text on the page,
6) Press the highlight icon.
7) Log out and log back into an account that is in the same previous group.
8) Select an overlapping text area with the previous highlight.
9) Press the highlight icon.
# Expected Results
1) The selected text should be highlighted with an overlap in color
2) The distinct highlights from each user should be listed in the sidebar
3) Each user should be able to see their own and the other's highlight
4) Deleting one highlight will not affect the other

# Test Case 313
Sprint 3

User Story 1 
As a user, I would like to make highlights on the file that everyone else in the room can also see.

This tests the persistence of highlights between sessions.
# Instructions
1) Open some file in some group.
2) Add a highlight to some part of the file.
3) Log out and clear all cookies.
4) Log back in, and navigate to the group and the file.
# Expected Results
1) The annotation should still be present in the file view.
2) The annotation should still be listed in the sidebar, along with the user's name and the content of the highlight.

# Test Case 314
Sprint 3

User Story 1 
As a user, I would like to make highlights on the file that everyone else in the room can also see.

This tests the visibility of highlights to other users.
# Instructions
1) Open some file in some group.
2) Add a highlight to some part of the file.
3) Log out, and log in as another user from that group.
4) Navigate to the original file.
# Expected Results
1) The other user's annotation should be present in the file view.
2) The other user's annotation should be listed in the sidebar, along with the user's name and the content of the highlight.

# Test Case 321
Sprint 3

User Story 2
As a user, I would like to remove notes and highlights from the file.
# Instructions
1) Given completion of test case 311, also add a note to some text on the page.
2) Open the notes sidebar.
3) On the recently added highlight, click the X button.
4) On the recently added note, click the X button.
# Expected Results
1) Both the note and highlight should disappear from the sidebar.
2) Both the note and highlight should disappear from the file.
3) Other users should no longer see the note or the highlight on that file.

# Test Case 322
Sprint 3

User Story 2
As a user, I would like to remove notes and highlights from the file.

This tests the extra feature that was added as a part of this user story. The feature allows users to click on a note or highlight in the sidebar to automatically scroll to the page that the annotation appears on.
# Instructions
1) Open some file in some group.
2) Add a note to some part of the file.
3) Scroll to another part of the file.
4) Open the note sidebar.
5) On the recently added note, click anywhere but the X button.
6) Perform the same test for a highlight instead of a note.
# Expected Results
1) The user's view of the file should automatically scroll to where they left the note.
2) In the sidebar, the note should also read who authored it, a snippet of the text highlighted, and the user's comment. If it is a highlight, it should show the highlighted text and the author of the annotation.
3) The view of other users should be identical, except for the X button which should not be present.

# Test Case 323
Sprint 3

User Story 2
As a user, I would like to remove notes and highlights from the file.

This tests the case where a user deletes a note while another user is viewing the file.
# Instructions
1) Open some file in some group.
2) Add a note to some part of the file.
3) Open another browser and navigate to the same group and file.
4) On the original browser, open the sidebar and click the X button on the note.
# Expected Results
1) The note should be removed from both users' sidebars.
2) The note should be removed from both users' view of the file.

# Test Case 324
Sprint 3

User Story 2
As a user, I would like to remove notes and highlights from the file.

This tests the case where a user deletes a highlight while another user is viewing the file.
# Instructions
1) Open some file in some group.
2) Add a highlight to some part of the file.
3) Open another browser and navigate to the same group and file.
4) On the original browser, open the sidebar and click the X button on the highlight.
# Expected Results
1) The annotation should be removed from both users' sidebars.
2) The annotation should be removed from both users' view of the file.



# Test Case 331
Sprint 3

User Story 3
As a user, I would like to be able to emphasize a highlight or part of the file, if time allows.

# Instructions
1) Open some file in some group.
2) Scroll to page 2.
3) On the toolbar, click the bookmark icon on the top right.
# Expected Results
1) The page should now have a bookmark icon on it in the sidebar.
2) The bookmark icon should be filled in when scrolled to page 2.

# Test Case 332
Sprint 3

User Story 3
As a user, I would like to be able to emphasize a highlight or part of the file, if time allows.

This tests the extra functionality that was added as a part of this user story. After clicking on any page in the sidebar, regardless of whether the page is bookmarked or not, the user's view should scroll them to that page in the file view.
# Instructions
1) Open some file in some group.
2) Scroll to page 2.
3) Open the bookmarks tab in the sidebar.
4) Click on page 4.
# Expected Results
1) The user's view should scroll to page 4.

# Test Case 333
Sprint 3

User Story 3
As a user, I would like to be able to emphasize a highlight or part of the file, if time allows.

This tests the removal of a bookmark.
# Instructions
1) Complete test 331.
2) While on page 2, click on the bookmark icon in the toolbar again.
# Expected Results
1) The view of page 2 in the sidebar should no longer have the bookmark icon on it.
2) The bookmark icon in the toolbar should no longer be filled in.

# Test Case 334
Sprint 3

User Story 3
As a user, I would like to be able to emphasize a highlight or part of the file, if time allows.

This tests the uniqueness of bookmarks, i.e. each user has their own separate bookmarks for the same file.
# Instructions
1) Complete test 331.
2) Log out and log back in as a member of the same group.
3) Navigate to the file.
4) Scroll to page 2 and open the sidebar.
# Expected Results
1) The view of page 2 in the sidebar should NOT have a bookmark icon.
2) The toolbar, when scrolled to page 2, should NOT have a bookmark icon filled in.

# Test Case 335
Sprint 3

User Story 3
As a user, I would like to be able to emphasize a highlight or part of the file, if time allows.

This tests the persistence of bookmarks between sessions.
# Instructions
1) Complete test 331.
2) Log out and log back into the same account.
3) Navigate to the file.
4) Scroll to page 2 and open the sidebar.
# Expected Results
1) The view of page 2 in the sidebar should have a bookmark icon.
2) The icon of the bookmark in the toolbar on page 2 should be filled in.
