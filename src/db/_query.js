import pool from '../db/_pool'
export default ({ text, values, name }) =>
  new Promise((resolve, reject) =>
    pool
      .connect()
      .then(client =>
        client
          .query({ text, values, name })
          .then(res => resolve(res))
          .then(() => client)
      )
      .then(client => client.release())
      .catch(err => reject(err))
  )
