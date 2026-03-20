# PDF to Word Converter

A React app that converts PDF files to Word documents using the ilovepdf API.

## Setup

1. Sign up for an ilovepdf account at https://ilovepdf.com/
2. Go to your Developer Dashboard > API Keys (https://developer.ilovepdf.com/)
3. Create a new project and get your public API key
4. Install dependencies: `npm install`
5. Set up your ilovepdf API key in `.env`:
   ```
   VITE_ILOVEPDF_API_KEY=your_api_key_here
   ```
6. Run the app: `npm run dev`

## How it works

The app uses CloudConvert's API to upload a PDF, convert it to DOCX, and provide a download link.

## Troubleshooting

If conversion fails:
- Ensure your ilovepdf account has sufficient credits or is on a paid plan (PDF to DOCX conversion may require premium access).
- Check that your API key is valid and has the necessary permissions.
- Verify the PDF file is valid and not corrupted.

The app includes better error handling to show specific error messages.
