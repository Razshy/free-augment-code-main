# Augment Refill Chrome Extension

This is a Chrome browser extension that adds a "Refill" feature to the Augment login page.

> **Important Note:** Before using, please enter your own domain email suffix (e.g., example.com) in the extension settings. The extension no longer provides a default domain. The refill feature will not work if the domain is not set!

## Features

- Adds a "Refill" button to the Augment login page
- Automatically generates a random email address when the button is clicked
- Automatically fills in the login form and clicks the continue button
- Supports custom email suffixes
- Supports custom random string length (default is 12 characters)

## Development Guide

### Requirements

- Node.js (recommended v14 or higher)
- npm (recommended v6 or higher)

### Install Dependencies

```bash
npm install
```

### Build the Extension

```bash
npm run build
```

After building, a ZIP file will be generated in the `dist` directory, which can be shared directly with others.

## Installation

### Development Version

1. Clone this repository
2. Install dependencies: `npm install`
3. Build the extension: `npm run build`
4. Open Chrome and go to the extensions page (chrome://extensions/)
5. Enable "Developer mode"
6. Click "Load unpacked"
7. Select the `dist/build` directory

### User Version

1. Download the latest ZIP file
2. Unzip the ZIP file
3. Open Chrome and go to the extensions page (chrome://extensions/)
4. Enable "Developer mode"
5. Click "Load unpacked"
6. Select the unzipped folder

## Usage

1. After installing the extension, click the extension icon and **set your own email suffix** (e.g., example.com) and the random string length (default is 12)
2. Visit the [Augment login page](https://login.augmentcode.com/)
3. On the login page, you will see a "Refill" button appear below the original "Continue" button
4. Click the "Refill" button; it will automatically generate a random email, fill in the form, and click the continue button

> **Note:** If you have not set an email suffix, you will receive a prompt when clicking the "Refill" button and will not be able to proceed.

## How the Unlimited Refill Works

The Augment Refill extension leverages the characteristics of the Augment login system to achieve "unlimited refills" by automatically generating random email addresses. Here's how it works:

### Basic Principle

1. **Random Email Generation:** The extension generates a random string of the user-specified length (default 12 characters) and combines it with the user-provided domain suffix to form a new email address.
2. **Auto-Fill:** The generated random email is automatically filled into the email input box on the Augment login page.
3. **Auto-Submit:** The extension automatically clicks the "Continue" button on the page to submit the newly generated email.
4. **Bypass Verification:** Since the Augment login system does not immediately verify the authenticity of the email, as long as the email format is correct, the system will accept it and create a new session.

### Technical Implementation

- **Domain Control:** Users need to use a domain they control as the email suffix. This way, even if the Augment system sends a verification email, it will not affect actual use.
- **Ensuring Randomness:** By generating a sufficiently long random string (default 12 characters), each generated email address is unique, avoiding conflicts with already registered accounts.
- **DOM Manipulation:** The extension uses JavaScript to manipulate page DOM elements, enabling automatic filling and clicking without manual user intervention.

### Usage Recommendations

- It is recommended to use a domain you actually own so you have full control over email addresses under that domain.
- Adjust the random string length as needed to ensure uniqueness without making it excessively long.
- Please use this feature responsibly and comply with relevant terms of service and laws.

## Project Structure

```
augment-refill/
├── dist/               # Build output directory
├── scripts/            # Build scripts
├── src/                # Source code
│   ├── background.js   # Background script
│   ├── content.js      # Content script
│   ├── icon.ico        # Extension icon
│   ├── manifest.json   # Extension manifest
│   ├── popup.html      # Popup window HTML
│   └── popup.js        # Popup window script
├── package.json        # Project configuration
└── README.md           # Project documentation
```

## Clearing Augment Code Cache

If you want to fully log out of Augment Code or remove all cached account information from your system, you can use the provided `clear-augment-cache.sh` script.

### What does it do?

- Detects your operating system (macOS, Linux, or Windows).
- Locates your VS Code user data directory.
- Removes all Augment Code global storage and cached data from VS Code.
- Attempts to remove Augment-related files from workspace storage.
- Provides instructions for clearing browser storage in VS Code for a complete clean.

### How to use

1. **Close VS Code** before running the script for best results.
2. Open a terminal and navigate to the directory containing `clear-augment-cache.sh`.
3. Run the script:
   ```bash
   bash clear-augment-cache.sh
   ```
4. Follow any on-screen instructions. The script will guide you through the process and notify you of any remaining manual steps (such as clearing browser storage via VS Code's Developer Tools).

> **Note:** This script is safe to use, but it will remove all Augment Code account data from your VS Code environment. You will need to log in again the next time you use Augment Code.
