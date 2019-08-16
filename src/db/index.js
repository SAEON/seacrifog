import Pool from '../lib/pg'
import { log } from '../lib/log'
import { readFileSync } from 'fs'
import { config } from 'dotenv'
import { join, normalize } from 'path'
config()

const getPool = database => Pool({
  host: process.env.POSTGRES_HOST || 'localhost',
  user: process.env.POSTGRES_USER || 'postgres',
  database,
  password: process.env.POSTGRES_PASSWORD || 'password',
  port: parseInt(process.env.POSTGRES_PORT, 10) || 5432
})

export default (async () => {
  let seacrifogPool;
  const configDbPool = getPool('postgres')
  const dbExists = (await configDbPool.query(
    `select exists(select datname from pg_catalog.pg_database where datname = 'seacrifog');`
  )).rows[0].exists

  if (!dbExists) {
    log('Creating seacrifog database')
    await configDbPool.query('create database seacrifog;')
    await configDbPool.end()

    seacrifogPool = getPool(process.env.POSTGRES_DATABASE || 'seacrifog')
    log('Creating seacrifog schema')
    const schema = readFileSync(normalize(join(__dirname, './schema.sql')), { encoding: 'utf8' })
    await seacrifogPool.query(schema)
    await seacrifogPool.end()
  }

  return seacrifogPool || getPool(process.env.POSTGRES_DATABASE || 'seacrifog')
})()
