import saveAudioFile from '../../actions/audioFile/save.js'
import deleteAudioFile from '../../actions/audioFile/delete.js'
import readAudioFileMetadata
  from '../../actions/audioFile/readMetadata.js'
import readAudioFileCover
  from '../../actions/audioFile/readCover.js'
import {
  saveTrackToLocalFolder
} from '../../actions/audioFile/saveToLocalFolder.js'

export function handleSaveAudioFile (
  _,
  {
    trackData
  }
) {
  const trackDataFormatted =
    JSON.parse(
      trackData
    )

  return saveAudioFile(
    {
      trackData:
        trackDataFormatted
    }
  )
}

export async function handleSaveTrackToLocalFolder (
  _,
  {
    trackData,
    destinationPath
  }
) {
  // It's good practice to ensure trackData is in the expected format,
  // though saveTrackToLocalFolder already has checks.
  // If trackData is stringified JSON, it should be parsed first.
  // Assuming trackData is already a JavaScript object here.
  return saveTrackToLocalFolder(
    trackData,
    destinationPath
  )
}

export function handleDeleteAudioFile (
  _,
  {
    fileName
  }
) {
  return deleteAudioFile(
    fileName
  )
}

export function handleReadAudioFileMetadata (
  _,
  {
    filePath
  }
) {
  return readAudioFileMetadata(
    {
      filePath
    }
  )
}

export function handleReadAudioFileCover (
  _,
  {
    imageData
  }
) {
  return readAudioFileCover(
    {
      imageData
    }
  )
}
