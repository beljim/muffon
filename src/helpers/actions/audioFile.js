export async function decrypt (
  {
    filePath,
    key,
    iv
  }
) {
  function getDecryptedFile () {
    const decryptArgs = {
      filePath,
      key,
      iv
    }

    return window
      .mainProcess
      .sendAsyncCommand(
        'decrypt-file',
        decryptArgs
      )
  }

  const result =
    await getDecryptedFile()

  if (result) {
    const blob = new Blob(
      [
        result
      ]
    )

    return URL.createObjectURL(
      blob
    )
  } else {
    throw new Error()
  }
}

function sanitizeFilename (name) {
  if (!name) return '';
  // Replace common problematic characters with an underscore
  let sanitized = name.replace(/[\\/:*?"<>|]/g, '_');
  // Optionally, replace spaces for better cross-platform compatibility or preference
  sanitized = sanitized.replace(/\s+/g, '_');
  // Reduce multiple underscores to a single one
  sanitized = sanitized.replace(/__+/g, '_');
  // Trim leading/trailing underscores
  sanitized = sanitized.replace(/^_+|_+$/g, '');
  // Limit length (optional, but good practice)
  const maxLength = 100; // Max length for the name part, not including extension
  return sanitized.substring(0, maxLength);
}

/**
 * Prompts the user to select a destination folder, constructs a filename,
 * and then initiates track download via an IPC call.
 *
 * @param {object} trackData - The track data object. Expected to have audio.link, title, and artistName or artist.name.
 * @returns {Promise<any>} - Promise resolving with the result of the IPC call, or null if dialog is canceled.
 */
export async function saveTrackToLocalFolder (
  trackData
) {
  if (!trackData || !trackData.audio || !trackData.audio.link) {
    console.error('Invalid trackData for saveTrackToLocalFolder: audio link missing.');
    throw new Error('Invalid track data: audio link is missing.');
  }
  if (!trackData.title) {
    console.warn('Track title is missing in trackData.');
  }
  // artistName might be trackData.artistName or trackData.artist.name
  const artistName = trackData.artistName || (trackData.artist && trackData.artist.name);
  if (!artistName) {
    console.warn('Artist name is missing in trackData.');
  }

  const dialogOptions = {
    title: 'Select Folder to Save Track',
    buttonLabel: 'Save Here',
    properties: [
      'openDirectory',
      'createDirectory'
    ]
  };

  try {
    const dialogResult = await window.mainProcess.callOpenDialog(
      dialogOptions
    );

    if (
      dialogResult.canceled ||
      !dialogResult.filePaths ||
      dialogResult.filePaths.length === 0 ||
      !dialogResult.filePaths[0]
    ) {
      console.log('Save track to local folder cancelled by user.');
      return null;
    }

    const selectedDirectory = dialogResult.filePaths[0];

    const safeArtist = sanitizeFilename(artistName || 'UnknownArtist');
    const safeTitle = sanitizeFilename(trackData.title || 'UnknownTitle');
    const filename = `${safeArtist} - ${safeTitle}.mp3`; // Assuming mp3, extension could be derived if available

    // Constructing full path as per subtask.
    // Note: This requires the main process to correctly handle this full path.
    // The current main process action saveTrackToLocalFolder expects a directory
    // and generates its own filename. This will need adjustment in a future step.
    const fullDestinationPath = selectedDirectory + '/' + filename; // Basic concatenation

    return window.ipcRenderer.invoke(
      'save-track-to-local-folder',
      {
        trackData,
        destinationPath: fullDestinationPath // Sending full path (folder + filename)
      }
    );
  } catch (error) {
    console.error('Error in saveTrackToLocalFolder helper:', error);
    throw error;
  }
}

/**
 * Prompts the user to select a destination folder and then initiates track download.
 * The actual filename is determined by the main process from trackData.audio.link.
 *
 * @param {object} trackData - The track data object, must contain at least trackData.audio.link.
 * @returns {Promise<any>} - Promise resolving with the result of the IPC call, or null if dialog is canceled.
 */
export async function saveTrackToLocalFolder (
  trackData
) {
  if (!trackData || !trackData.audio || !trackData.audio.link) {
    console.error('Invalid trackData for saveTrackToLocalFolder');
    throw new Error('Invalid track data: audio link is missing.');
  }

  const dialogOptions = {
    title: 'Select Folder to Save Track',
    buttonLabel: 'Save Here',
    properties: [
      'openDirectory',
      'createDirectory'
    ]
  };

  try {
    const dialogResult = await window.mainProcess.callOpenDialog(
      dialogOptions
    );

    if (
      dialogResult.canceled ||
      !dialogResult.filePaths ||
      dialogResult.filePaths.length === 0 ||
      !dialogResult.filePaths[0]
    ) {
      console.log('Save track to local folder cancelled by user.');
      return null; // User cancelled or selected no folder
    }

    const selectedDirectory = dialogResult.filePaths[0];

    return window.ipcRenderer.invoke(
      'save-track-to-local-folder',
      {
        trackData,
        destinationPath: selectedDirectory
      }
    );
  } catch (error) {
    console.error('Error in saveTrackToLocalFolder helper:', error);
    throw error; // Re-throw the error to be handled by the caller
  }
}
