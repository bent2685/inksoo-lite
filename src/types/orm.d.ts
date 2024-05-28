type ISchema = 'recentFiles'

interface IDBEvent {
  schema: ISchema
  action: 'add' | 'remove' | 'update' | 'get' | 'list'
  payload: {
    id?: TKey
    data?: TKey
  }
}

interface ORecentFile {
  id?: number
  /**
   * 文件路径
   */
  path: string
  /**
   * 文件名
   */
  name: string

  create_at?: Date

  update_at?: Date
}
