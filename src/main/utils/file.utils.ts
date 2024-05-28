import fs from 'fs'
import path from 'path'
import db from '../storage/connect'

/**
 * @description 通过文件路径获取文件对象
 * @param filepath 文件路径
 * @returns
 */
export const getFileDataByFilePath = (filepath: string): Promise<IChooseFile> => {
  return new Promise((resolve, reject) => {
    let data = ''
    const stream = fs.createReadStream(filepath, 'utf-8')
    const filename = path.basename(filepath) || 'unknow file'
    stream.on('data', (chunk) => {
      data += chunk
    })
    stream.on('end', () => {
      resolve({ data, filename, filepath })
    })
    stream.on('error', (err) => {
      reject(err)
    })
  })
}

export const syncRecentFileByFilePath = async (filepath: string): Promise<ORecentFile> => {
  const dbConn = await db
  if (!fs.existsSync(filepath)) {
    //! 路径不存在线删除数据库中的记录
    await dbConn('recent_files').where('path', '=', filepath).del()
  }
  const files = await dbConn('recent_files').where('path', '=', filepath).select('*')
  if (files.length > 0) {
    // 更新时间
    const id = files[0]?.id
    const update_at = new Date()
    await dbConn('recent_files').where('id', '=', id).update({ update_at })
  } else {
    // 插入数据
    await dbConn('recent_files').insert({
      path: filepath,
      name: path.basename(filepath),
      create_at: new Date(),
      update_at: new Date()
    })
  }
  const file = await dbConn('recent_files').select('*').orderBy('update_at', 'desc').first()
  return file
}
