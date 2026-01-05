/**
 * ============================================
 * Google Vision OCR – Apps Script Integration
 * --------------------------------------------
 * Purpose:
 * - Authenticate using a Google Cloud service account
 * - Run OCR on images stored in a Google Drive folder
 * - Output raw OCR text into a Google Sheet
 *
 * Prerequisites:
 * 1. Google Cloud project with Vision API enabled
 * 2. Service account with Vision permissions
 * 3. Service account JSON stored securely in Script Properties

/**
 * Generates an OAuth2 access token using a
 * Google Cloud service account (JWT flow).
 *
 * Service account JSON should be stored in:
 * Script Properties → VISION_SERVICE_ACCOUNT_JSON
 */
function getVisionAccessToken() {
  // Load service account credentials from Script Properties
  const serviceAccount = JSON.parse(
    PropertiesService.getScriptProperties()
      .getProperty("VISION_SERVICE_ACCOUNT_JSON")
  );

  // JWT header
  const header = {
    alg: "RS256",
    typ: "JWT"
  };

  // JWT claims
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    iss: serviceAccount.client_email,
    scope: "https://www.googleapis.com/auth/cloud-platform",
    aud: "https://oauth2.googleapis.com/token",
    iat: now,
    exp: now + 3600 // token valid for 1 hour
  };

  // Base64 encode header + claims
  const encodedHeader = Utilities.base64EncodeWebSafe(JSON.stringify(header));
  const encodedClaims = Utilities.base64EncodeWebSafe(JSON.stringify(claims));
  const signatureInput = encodedHeader + "." + encodedClaims;

  // Sign JWT using service account private key
  const signature = Utilities.computeRsaSha256Signature(
    signatureInput,
    serviceAccount.private_key
  );

  const jwt =
    signatureInput + "." +
    Utilities.base64EncodeWebSafe(signature);

  // Exchange JWT for OAuth access token
  const response = UrlFetchApp.fetch(
    "https://oauth2.googleapis.com/token",
    {
      method: "post",
      payload: {
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt
      }
    }
  );

  return JSON.parse(response.getContentText()).access_token;
}


/**
 * Runs OCR on all image files inside a given
 * Google Drive folder and writes raw text
 * output to the active Google Sheet.
 *
 * Configuration:
 * - Set OCR_SOURCE_FOLDER_ID in Script Properties
 */
function runVisionOCR() {
  const folderId =
    PropertiesService.getScriptProperties()
      .getProperty("OCR_SOURCE_FOLDER_ID");

  if (!folderId) {
    throw new Error("OCR_SOURCE_FOLDER_ID is not configured.");
  }

  const accessToken = getVisionAccessToken();
  const folder = DriveApp.getFolderById(folderId);
  const files = folder.getFiles();

  const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();

  // Reset output sheet
  sheet.clear();
  sheet.appendRow(["File Name", "Raw OCR Text"]);

  // Iterate through images in folder
  while (files.hasNext()) {
    const file = files.next();
    const blob = file.getBlob();

    // Convert image to base64 for Vision API
    const imageBase64 = Utilities.base64Encode(blob.getBytes());

    const requestPayload = {
      requests: [{
        image: { content: imageBase64 },
        features: [{ type: "TEXT_DETECTION" }]
      }]
    };

    const response = UrlFetchApp.fetch(
      "https://vision.googleapis.com/v1/images:annotate",
      {
        method: "post",
        contentType: "application/json",
        headers: {
          Authorization: "Bearer " + accessToken
        },
        payload: JSON.stringify(requestPayload)
      }
    );

    const result = JSON.parse(response.getContentText());

    // Vision API returns full text in first annotation
    const extractedText =
      result.responses &&
      result.responses[0] &&
      result.responses[0].textAnnotations
        ? result.responses[0].textAnnotations[0].description
        : "";

    sheet.appendRow([
      file.getName(),
      extractedText
    ]);
  }
}
