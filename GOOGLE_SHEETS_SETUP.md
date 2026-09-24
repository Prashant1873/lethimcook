# Google Sheets Setup Guide for LunaTick

Follow these 4 quick steps to connect your Google Sheet to the LunaTick frontend:

---

### Step 1: Create a Google Sheet
1. Go to [sheets.google.com](https://sheets.google.com) and create a **Blank spreadsheet**.
2. Name it something like **"LunaTick Experiment Data"**.

---

### Step 2: Open Apps Script
1. In the top menu of your Google Sheet, click **Extensions** > **Apps Script**.
2. Delete whatever text is inside the editor window (`function myFunction() { ... }`).
3. Open [`google-apps-script.js`](./google-apps-script.js) from this folder, copy all of its content, and paste it into the editor.
4. Click the **Save** icon (diskette icon) or press `Ctrl + S`.

---

### Step 3: Deploy as a Web App
1. At the top right of the Apps Script window, click the blue **Deploy** button > **New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Fill in the deployment details:
   - **Description**: `LunaTick Logger`
   - **Execute as**: `Me (your email)`
   - **Who has access**: **`Anyone`** *(⚠️ Critical: must be "Anyone", otherwise anonymous respondents won't be able to log without Google login).*
4. Click **Deploy**.
5. Google will ask you to **Authorize access**:
   - Click *Authorize access*.
   - Choose your Google account.
   - Click *Advanced* (small link at bottom left).
   - Click *Go to Untitled project (unsafe)*.
   - Click *Allow*.
6. You will see a **Web app URL** that looks like:
   `https://script.google.com/macros/s/AKfycbx.../exec`
7. Click **Copy** to copy this URL.

---

### Step 4: Connect to LunaTick Frontend
- Open `index.html` in your browser.
- Click the small discreet **⚙️ icon** (or press `Ctrl + Shift + S`) in the bottom corner.
- Paste your copied Web App URL and click **Save**.
- Or edit `app.js` and set `GOOGLE_APPS_SCRIPT_URL = "your-url-here"`.

You're done! Every time someone picks a mood card, it will instantly add a row with their Name, Mood, Date, Moon Phase, and Illumination % into your Google Sheet.
