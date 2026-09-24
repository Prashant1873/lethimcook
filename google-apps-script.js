/**
 * LunaTick - Google Apps Script Backend
 * 
 * Instructions:
 * 1. Open your Google Sheet.
 * 2. Click "Extensions" > "Apps Script".
 * 3. Delete any default code in Code.gs and paste this entire file.
 * 4. Click "Deploy" > "New deployment".
 * 5. Select type: "Web app".
 * 6. Set Description: "LunaTick Logger".
 * 7. Set "Execute as": "Me".
 * 8. Set "Who has access": "Anyone" (crucial so responses can be logged without requiring sign-in).
 * 9. Click "Deploy", authorize permissions when prompted, and copy the Web App URL.
 * 10. Paste the Web App URL into the LunaTick frontend settings!
 */

function doPost(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp (UTC)",
        "Date & Time (Local)",
        "Moon Phase",
        "Illumination",
        "Moon Age (Days)",
        "Name",
        "Mood"
      ]);
      // Format header row
      sheet.getRange(1, 1, 1, 7)
        .setFontWeight("bold")
        .setBackground("#F3F4F6");
      sheet.setFrozenRows(1);
    }

    var data;
    if (e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (err) {
        data = e.parameter;
      }
    } else {
      data = e.parameter;
    }

    var timestamp = new Date().toISOString();
    var localTime = data.localTime || new Date().toLocaleString();
    var moonPhase = data.moonPhase || "Unknown";
    var illumination = data.illumination || "";
    var moonAge = data.moonAge || "";
    var name = data.name || "Anonymous";
    var mood = data.mood || "Unspecified";

    sheet.appendRow([
      timestamp,
      localTime,
      moonPhase,
      illumination,
      moonAge,
      name,
      mood
    ]);

    return ContentService.createTextOutput(JSON.stringify({
      status: "success",
      message: "Mood & Moon logged successfully."
    })).setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({
      status: "error",
      message: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: "online",
    message: "LunaTick Google Apps Script is active and listening for POST requests."
  })).setMimeType(ContentService.MimeType.JSON);
}
