const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'cricketTeam.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/players/', async (request, response) => {
  const getCricketTeam = `
    SELECT *
    FROM cricket_team;`
  const cricketArray = await db.all(getCricketTeam)
  response.send(cricketArray)
})

app.post('/players/', async (request, response) => {
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const addPlayerQuery = `
  INSERT INTO
    cricket_team(playerName, jerseyNumber, role)
  VALUES
   (
    '${playerName}',
    ${jerseyNumber}',
    '${role}',
   );`

  const dbResponse = await db.run(addPlayerQuery)
  response.send('Book Added to Team')
})

app.get('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const getPlayerIdQuery = `
  SELECT *
  FROM cricket_team
  WHERE player_id = ${playerId};`
  const playerArray = await db.get(getPlayerIdQuery)
  response.send(playerArray)
})

app.put('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const playerDetails = request.body
  const {playerName, jerseyNumber, role} = playerDetails
  const updatePlayerQuery = `
  UPDATE cricket_team
  SET 
  player_name='${playerName}',
  jersey_number=${jerseyNumber},
  role='${role}'
  WHERE player_id = ${playerId};`

  await db.run(updatePlayerQuery)
  response.send('Player Details Updated')
})

app.delete('/players/:playerId/', async (request, response) => {
  const {playerId} = request.params
  const deletePlayerQuery = `
  DELETE FROM 
  cricket_team
  WHERE 
   player_id = ${playerId};`
  await db.run(deletePlayerQuery)
  response.send('Player Removed')
})

module.exports = app
