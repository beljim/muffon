const { download } = require('electron-dl');
const fs = require('fs');
const path = require('path');

// Assuming mainWindow is globally accessible as set in electron/actions/mainWindow/create.js
// global.mainWindow

/**
 * Downloads an audio file from a URL and saves it to a local folder.
 *
 * @param {object} trackData - Object containing track information, including the audio URL.
 * @param {string} destinationPath - The local folder path to save the downloaded file.
 * @returns {Promise<string>} - Promise resolving with the full path to the saved file, or rejecting with an error.
 */
async function saveTrackToLocalFolder(trackData, destinationPath) {
  if (!trackData || !trackData.audio || !trackData.audio.link) {
    return Promise.reject(new Error('Invalid track data or audio link.'));
  }

  if (!destinationPath) {
    return Promise.reject(new Error('Destination path is required.'));
  }

  const filename = path.basename(trackData.audio.link);
  const fullPath = path.join(destinationPath, filename);

  try {
    // Use global.mainWindow if it's set globally, or ensure it's accessible.
    // If it's not directly global, it might need to be imported from where it's defined.
    // For now, assuming it's available as `mainWindow` or `global.mainWindow`
    const win = global.mainWindow; 
    if (!win) {
      return Promise.reject(new Error('Main window is not available.'));
    }
    await download(win, trackData.audio.link, {
      directory: destinationPath,
      filename: filename,
      onProgress: (progress) => {
        // Optionally, handle progress updates (e.g., send to renderer process)
        console.log(`Download progress: ${Math.round(progress.percent * 100)}%`);
      },
    });
    console.log(`File downloaded successfully to ${fullPath}`);
    return fullPath;
  } catch (error) {
    console.error('Error downloading file:', error);
    // Attempt to clean up partially downloaded file if an error occurs
    if (fs.existsSync(fullPath)) {
      try {
        fs.unlinkSync(fullPath);
      } catch (cleanupError) {
        console.error('Error cleaning up partial file:', cleanupError);
      }
    }
    return Promise.reject(error);
  }
}

module.exports = {
  saveTrackToLocalFolder,
};
