# How to Connect Google Sheets to CarVault Feedback Form

Here is a step-by-step guide to connect your `feedback.html` form to a Google Sheet:

### 1. Create a Google Sheet
1. Go to [Google Sheets](https://sheets.google.com) and create a new blank spreadsheet.
2. Name the spreadsheet (e.g., "CarVault Feedback").
3. In the first row (Row 1), add the following column headers exactly in this order:
   - **Column A:** `Name`
   - **Column B:** `Email`
   - **Column C:** `Type`
   - **Column D:** `Message`
   - **Column E:** `Timestamp`

### 2. Add the Apps Script
1. In your Google Sheet, click on **Extensions** in the top menu, then select **Apps Script**. This will open a new tab with a code editor.
2. Delete any existing code in the editor and paste the following script:

```javascript
function doPost(e) {
  try {
    // Get the active sheet
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Parse the JSON data sent from your website
    const data = JSON.parse(e.postData.contents);
    
    // Append the data as a new row in the sheet
    sheet.appendRow([
      data.name || "",
      data.email || "",
      data.type || "",
      data.message || "",
      data.timestamp || new Date().toISOString()
    ]);
    
    // Return a success response
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    // Return an error response if something fails
    return ContentService.createTextOutput(JSON.stringify({ 'result': 'error', 'error': error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
```
3. Click the **Save** icon (the floppy disk) and give the project a name (e.g., "Feedback Handler").

### 3. Deploy the Script as a Web App
1. In the Apps Script editor, click the blue **Deploy** button in the top right corner and select **New deployment**.
2. Click the gear icon ⚙️ next to "Select type" and check **Web app**.
3. Fill out the configuration:
   - **Description:** Form integration (or leave blank)
   - **Execute as:** `Me (your email)`
   - **Who has access:** Change this to **`Anyone`** (This is crucial, otherwise your website visitors won't be able to submit the form without logging in).
4. Click **Deploy**.
5. *Note: Google will ask you to authorize the app. Click "Authorize access", choose your Google account, click "Advanced", and then "Go to [Project Name] (unsafe)" and click "Allow". This just gives the script permission to edit your own spreadsheet.*
6. Once deployed, Google will give you a **Web app URL** (it will look like `https://script.google.com/macros/s/.../exec`). **Copy this URL.**

### 4. Connect It to Your Website
Finally, go back to your `feedback.html` file in your code editor. Scroll down to the script section (around line 414) and replace the existing `GOOGLE_SCRIPT_URL` with the one you just copied:

```javascript
const GOOGLE_SCRIPT_URL = 'YOUR_NEW_WEB_APP_URL_HERE';
```

Once you save the file, any new feedback submitted through the form on your website will automatically appear as a new row in your Google Sheet!