import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import {
  IconButton,
  InputAdornment,
  // FormControl,
  // InputLabel,
  // MenuItem,
  // Select,
  TextField,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import { BarChart, OpenInNew, Search } from '@mui/icons-material'
import axios from 'axios'
import sweetAlert from 'sweetalert'

export default function Home() {
  const [playerProfile, setPlayerProfile] = useState()
  const [leaderBoard, setLeaderBoard] = useState([])

  useEffect(() => {
    //Get Leaderboard

    axios.get(`https://api.chess.com/pub/leaderboards`).then((res) => {
      console.log(res.data.daily)
      setLeaderBoard(
        res.data.daily.map((obj, index) => ({
          id: index,
          rank: obj.rank,
          avatar: obj.avatar,
          username: obj.username,
          url: obj.url,
          score: obj.score,
        }))
      )
    })
  }, [])

  const getPlayerData = () => {
    const playerName = document.getElementById('playerName').value

    if (playerName === '') {
      sweetAlert({
        title: 'Warning',
        text: 'Please enter a username',
        icon: 'warning',
        buttons: {
          confirm: {
            text: 'OK',
            visible: true,
            closeModal: true,
          },
        },
      })
    } else {
      axios
        .get(`https://api.chess.com/pub/player/${playerName}`)
        .then((res) => {
          console.log('data: ', res.data)
          const { country, ...rest } = res.data
          // setPlayerProfile({ ...rest })

          axios
            .get(`${res.data.country}`)
            .then((countryRes) => {
              console.log(countryRes.data.name)
              setPlayerProfile({ ...rest, country: countryRes.data.name })
            })
            .catch((error) => {
              if (error.response.status === 404) {
                sweetAlert({
                  title: 'Sorry',
                  text: 'User Not Found',
                  icon: 'info',
                  buttons: {
                    confirm: {
                      text: 'OK',
                      visible: true,
                      closeModal: true,
                    },
                  },
                })
              } else {
                sweetAlert({
                  title: 'ERROR!',
                  text: ``,
                  icon: 'error',
                  buttons: {
                    confirm: {
                      text: 'OK',
                      visible: true,
                      closeModal: true,
                    },
                  },
                  dangerMode: true,
                })
              }
            })
        })
        .catch((error) => {
          if (error.response.status === 404) {
            sweetAlert({
              title: 'Sorry',
              text: 'User Not Found',
              icon: 'info',
              buttons: {
                confirm: {
                  text: 'OK',
                  visible: true,
                  closeModal: true,
                },
              },
            })
          } else {
            sweetAlert({
              title: 'ERROR!',
              text: ``,
              icon: 'error',
              buttons: {
                confirm: {
                  text: 'OK',
                  visible: true,
                  closeModal: true,
                },
              },
              dangerMode: true,
            })
          }
        })
    }
  }

  const columns = [
    {
      headerClassName: 'cellColor',

      field: 'rank',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Rank',
      flex: 0.3,
    },
    {
      headerClassName: 'cellColor',

      field: 'username',
      headerAlign: 'center',
      headerName: 'Username',
      flex: 1,
      renderCell: (params) => {
        return (
          <div
            style={{ display: 'flex', columnGap: '20px', alignItems: 'center' }}
          >
            <Image
              className={styles.avatar}
              src={leaderBoard[params.row.rank - 1]['avatar']}
              height={45}
              width={45}
            />
            <div>
              <span style={{ fontWeight: 'bold' }}>{params.row.username}</span>
              <IconButton
                onClick={() => {
                  window.open(
                    `${leaderBoard[params.row.rank - 1]['url']}`,
                    '_blank'
                  )
                }}
              >
                <OpenInNew sx={{ color: '#0a0908', height: 20 }} />
              </IconButton>
            </div>
          </div>
        )
      },
    },
    {
      headerClassName: 'cellColor',

      field: 'score',
      align: 'center',
      headerAlign: 'center',
      headerName: 'Score',
      flex: 0.4,
    },
  ]

  return (
    <>
      <Head>
        <title>{`Grandmaster's Corner`}</title>
      </Head>
      <div className={styles.wrapper}>
        <h1>{`Grandmaster's Corner`}</h1>
        <h2>{`Your favourite player's all stats at one place`}</h2>
        <TextField
          id="playerName"
          label="Enter Player's Username"
          variant="standard"
          sx={{
            minWidth: 200,
            width: '60vw',
            maxWidth: 730,
            marginTop: '5vh',
          }}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  sx={{ color: '#0a0908' }}
                  onClick={() => {
                    getPlayerData()
                  }}
                >
                  <Search />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
        {playerProfile && (
          <div className={styles.contentContainer}>
            <h2>Player Profile</h2>
            <div className={styles.playerData}>
              {playerProfile.avatar ? (
                <Image
                  className={styles.avatar}
                  src={playerProfile.avatar}
                  height={150}
                  width={150}
                  alt="avatar"
                />
              ) : (
                <Image
                  className={styles.avatar}
                  src="/noImageFound.png"
                  height={150}
                  width={150}
                  alt="No Image Found"
                />
              )}
              <div className={styles.right}>
                <label className={styles.verifiedName}>
                  Name: <span>{playerProfile.name ?? 'No name found'}</span>{' '}
                  {playerProfile.verified && (
                    <Image
                      src="/verified.png"
                      alt="verified"
                      height={20}
                      width={20}
                    />
                  )}
                </label>
                <label>
                  Title: <span>{playerProfile.title ?? 'No title'}</span>
                </label>
                <label>
                  Followers: <span>{playerProfile.followers}</span>
                </label>
                <label>
                  Country: <span>{playerProfile.country}</span>
                </label>
                <label>
                  Location:{' '}
                  <span>{playerProfile.location ?? 'No location found'}</span>
                </label>
                <label>
                  League: <span>{playerProfile.league ?? 'No league'}</span>
                </label>
              </div>
            </div>
          </div>
        )}
        <label
          style={{
            marginTop: '8vh',
            marginBottom: '2vh',
            fontSize: '20px',
            textTransform: 'uppercase',
            fontFamily: 'Lato',
            fontWeight: 'bold',

            display: 'flex',
          }}
        >
          Leaderboard
          <BarChart sx={{ width: 40 }} />
        </label>
        <DataGrid
          autoHeight
          sx={{
            minWidth: 360,
            width: '60vw',
            maxWidth: 730,
            // width: '50vw',
            backgroundColor: '#c6ac8f',
            color: '#0a0908',

            '& .cellColor': {
              backgroundColor: '#5e503f',
              color: 'white',
            },
          }}
          rows={leaderBoard}
          //@ts-ignore
          columns={columns}
          pageSize={10}
          // rowsPerPageOptions={[5]}
          hideFooter
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </div>
    </>
  )
}

// +-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+-+

{
  /* <FormControl
            variant="standard"
            sx={{
              minWidth: 200,
              width: '60vw',
              maxWidth: 730,
            }}
          >
            <InputLabel id="demo-simple-select-standard-label">
              Select a player
            </InputLabel>
            <Select
              value={player}
              onChange={(e) => {
                setPlayer(e.target.value)
              }}
            >
              <MenuItem value={10}>Ten</MenuItem>
              <MenuItem value={20}>Twenty</MenuItem>
              <MenuItem value={30}>Thirty</MenuItem>
            </Select>
          </FormControl> */
}
