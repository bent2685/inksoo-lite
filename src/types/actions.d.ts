interface ISave {
  taskId: string
  filepath?: string
  data?: string
  opt4Save?: import('fs').WriteFileOptions
  opt4Dialog?: import('electron').SaveDialogOptions
}

type ISaveOption = Omit<ISave, 'opt4Dialog'>
type ISaveAsOption = Omit<ISave, 'filePath'>
interface IChooseFile {
  data: string
  filename: string
  filepath: string
}

/**
 * 另存为返回值
 */
interface ISaveAsReturn {
  taskId: string
  filepath: string
  filename: string
}
