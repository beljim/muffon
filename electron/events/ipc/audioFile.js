import {
  ipcMain
} from 'electron'
import {
  handleSaveAudioFile,
  handleDeleteAudioFile,
  handleReadAudioFileMetadata,
  handleReadAudioFileCover,
  handleSaveTrackToLocalFolder
} from '../../handlers/ipc/audioFile.js'

export default function () {
  ipcMain.handle(
    'save-audio-file',
    handleSaveAudioFile
  )

  ipcMain.handle(
    'delete-audio-file',
    handleDeleteAudioFile
  )

  ipcMain.handle(
    'read-audio-file-metadata',
    handleReadAudioFileMetadata
  )

  ipcMain.handle(
    'read-audio-file-cover',
    handleReadAudioFileCover
  )

  ipcMain.handle(
    'save-track-to-local-folder',
    handleSaveTrackToLocalFolder
  )
}
