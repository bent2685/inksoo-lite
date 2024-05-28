import knex from 'knex'
import { Knex } from 'knex'
import { app } from 'electron'
import path from 'path'

/**
 * 自动判断环境获取db存放路径
 */
const getPathOnEnv = () => {
  return process.env.NODE_ENV === 'development'
    ? path.join(__dirname, 'local.db')
    : path.join(app.getPath('userData'), 'local.db')
}

const initDB = () => {
  const userDataPath = app.getPath('userData')
  const dbPath = path.join(userDataPath, 'local.db')
  return knex({
    client: 'sqlite3',
    connection: {
      filename: getPathOnEnv()
    },
    useNullAsDefault: true
  })
}
const initScehma = async (knex: Knex<any, unknown>) => {
  let exists = await knex.schema.hasTable('recent_files')
  if (!exists) {
    await knex.schema.createTable('recent_files', (table) => {
      table.increments('id').primary()
      table.string('path').notNullable()
      table.string('name').notNullable()
      table.date('create_at').defaultTo(knex.fn.now())
      table.date('update_at').defaultTo(knex.fn.now())
    })
  }
  exists = await knex.schema.hasTable('demo')
  if (!exists) {
    await knex.schema.createTable('demo', (table) => {
      table.increments('id').primary()
    })
  }
}

export default (async function setup() {
  try {
    const knex = initDB()
    await initScehma(knex)
    return knex
  } catch (error) {
    throw new Error('database init error')
  }
})()
