/**
 * Build script - Package files from src directory into a Chrome extension
 */

const fs = require('fs-extra');
const path = require('path');
const archiver = require('archiver');

// Path configuration
const rootDir = path.resolve(__dirname, '..');
const srcDir = path.join(rootDir, 'src');
const distDir = path.join(rootDir, 'dist');
const buildDir = path.join(distDir, 'build');

// List of files to include in the package
const filesToInclude = [
  'manifest.json',
  'content.js',
  'background.js',
  'popup.html',
  'popup.js',
  'icon.ico'
];

/**
 * Clean directories
 */
async function cleanDirectories() {
  console.log('Cleaning directories...');
  await fs.emptyDir(distDir);
  await fs.ensureDir(buildDir);
}

/**
 * Copy files to build directory
 */
async function copyFiles() {
  console.log('Copying files to build directory...');

  for (const file of filesToInclude) {
    const srcPath = path.join(srcDir, file);
    const destPath = path.join(buildDir, file);

    if (await fs.pathExists(srcPath)) {
      await fs.copy(srcPath, destPath);
      console.log(`  Copied: ${file}`);
    } else {
      console.warn(`  Warning: File does not exist - ${file}`);
    }
  }
}

/**
 * Create ZIP package
 */
async function createZipPackage() {
  console.log('Creating ZIP package...');

  // Generate timestamp
  const timestamp = new Date().toISOString().replace(/[-:]/g, '').replace('T', '').substring(0, 14);
  const zipFileName = `AugmentRefill_${timestamp}.zip`;
  const zipFilePath = path.join(distDir, zipFileName);

  // Create write stream
  const output = fs.createWriteStream(zipFilePath);
  const archive = archiver('zip', {
    zlib: { level: 9 } // Maximum compression level
  });

  // Listen for errors
  archive.on('error', (err) => {
    throw err;
  });

  // Pipe connection
  archive.pipe(output);

  // Add files
  archive.directory(buildDir, false);

  // Finalize archive
  await archive.finalize();

  console.log(`ZIP package created successfully: ${zipFileName}`);
  return zipFilePath;
}

/**
 * Main build function
 */
async function build() {
  try {
    console.log('Starting to build Augment Refill Chrome extension...');

    // Clean directories
    await cleanDirectories();

    // Copy files
    await copyFiles();

    // Create ZIP package
    const zipFilePath = await createZipPackage();

    console.log(`\nBuild successful! File saved to: ${zipFilePath}`);
    console.log('\nYou can share this ZIP file directly with others to use.');
    console.log('Installation method:');
    console.log('1. Extract the ZIP file');
    console.log('2. Open Chrome browser, go to extension management page (chrome://extensions/)');
    console.log('3. Enable "Developer mode"');
    console.log('4. Click "Load unpacked extension"');
    console.log('5. Select the extracted folder');

  } catch (error) {
    console.error('Error during build process:', error);
    process.exit(1);
  }
}

// Execute build
build();
