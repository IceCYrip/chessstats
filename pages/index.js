import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import {
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material'
import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import {
  BarChart,
  GitHub,
  LinkedIn,
  OpenInNew,
  Search,
  Twitter,
} from '@mui/icons-material'
import axios from 'axios'
import sweetAlert from 'sweetalert'

export default function Home() {
  const [playerProfile, setPlayerProfile] = useState()
  const gameMode = [
    { code: 'daily', name: 'Daily' },
    { code: 'daily960', name: 'Daily 960' },
    { code: 'live_rapid', name: 'Rapid' },
    { code: 'live_blitz', name: 'Blitz' },
    { code: 'live_bullet', name: 'Bullet' },
    { code: 'live_bughouse', name: 'Doubles Bughouse' },
    { code: 'live_blitz960', name: 'Blitz 960' },
    { code: 'live_threecheck', name: '3 Check' },
    { code: 'live_crazyhouse', name: 'Crazy House' },
    { code: 'live_kingofthehill', name: 'King of the Hill' },
    { code: 'tactics', name: 'Tactics' },
    { code: 'rush', name: 'Puzzle Rush' },
    { code: 'battle', name: 'Puzzle Battle' },
  ]
  const [leaderBoard, setLeaderBoard] = useState([])
  const [playerSearchLoading, setPlayerSearchLoading] = useState(false)
  const [gameModeLoading, setGameModeLoading] = useState(true)

  useEffect(() => {
    //Get Leaderboard
    axios.get(`https://api.chess.com/pub/leaderboards`).then((res) => {
      let firstKey = Object.keys(res.data)[0]

      setLeaderBoard(
        res.data[firstKey].map((obj, index) => ({
          id: index,
          rank: obj.rank,
          avatar: obj.avatar,
          username: obj.username,
          url: obj.url,
          score: obj.score,
        }))
      )
      setGameModeLoading(false)
    })
  }, [])

  const getLeaderBoardData = (modeName) => {
    setGameModeLoading(true)
    //Get Particular Leaderboard
    axios.get(`https://api.chess.com/pub/leaderboards`).then((res) => {
      setLeaderBoard(
        res.data[modeName].map((obj, index) => ({
          id: index,
          rank: obj.rank,
          avatar: obj.avatar,
          username: obj.username,
          url: obj.url,
          score: obj.score,
        }))
      )
      setGameModeLoading(false)
    })
  }

  const getPlayerData = () => {
    setPlayerSearchLoading(true)
    const playerName = document.getElementById('playerName').value

    if (playerName === '' || playerName.includes(' ')) {
      sweetAlert({
        title: 'Warning',
        text: 'Please enter a valid username',
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

          axios
            .get(`${res.data.country}`)
            .then((countryRes) => {
              console.log(countryRes.data.name)
              setPlayerProfile({ ...rest, country: countryRes.data.name })
              setPlayerSearchLoading(false)
            })
            .catch((error) => {
              if (error?.response?.status === 404) {
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
          if (error?.response?.status === 404) {
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
              text: `error`,
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
              src={
                leaderBoard[params.row.rank - 1]['avatar'] ??
                'https://www.chess.com/bundles/web/images/noavatar_l.84a92436@2x.gif'
              }
              height={45}
              width={45}
            />
            <div>
              <span style={{ fontWeight: 'bold' }}>{params.row.username}</span>
              {leaderBoard[params.row.rank - 1]['url'] && (
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
              )}
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
        <div
          className={styles.containsLoader}
          style={{
            marginTop: '5vh',
          }}
        >
          <TextField
            id="playerName"
            label="Enter Player's Username"
            variant="standard"
            sx={{
              minWidth: 200,
              width: '60vw',
              maxWidth: 730,
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
          {playerSearchLoading && <div className={styles.loader}></div>}
        </div>
        {playerProfile && (
          <div className={styles.contentContainer}>
            <h2>Player Profile</h2>
            <div className={styles.playerData}>
              <Image
                className={styles.avatar}
                src={
                  playerProfile.avatar ??
                  'https://www.chess.com/bundles/web/images/noavatar_l.84a92436@2x.gif'
                }
                height={150}
                width={150}
                alt="avatar"
              />

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
            marginTop: '10vh',
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
        <div className={styles.leaderBoard}>
          <div className={styles.containsLoader}>
            <FormControl
              className={styles.modeSelect}
              variant="standard"
              sx={{
                width: '150px',
              }}
            >
              <InputLabel id="demo-simple-select-standard-label">
                Select a game mode
              </InputLabel>
              <Select
                defaultValue={gameMode[0]['code']}
                onChange={(e) => {
                  getLeaderBoardData(e.target.value)
                }}
              >
                {gameMode &&
                  gameMode.map((mode, index) => {
                    return (
                      <MenuItem key={index} value={mode.code}>
                        {mode.name}
                      </MenuItem>
                    )
                  })}
              </Select>
            </FormControl>
            {gameModeLoading && <div className={styles.loader}></div>}
          </div>
          <DataGrid
            autoHeight
            sx={{
              marginBottom: '5vh',

              minWidth: 360,
              // width: '60vw',
              width: '100%',
              // maxWidth: 730,

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

        <div className={styles.footer}>
          <h3> Developed by Karan Sable</h3>
          <div className={styles.iconDiv}>
            <IconButton
              onClick={() => {
                window.open('https://www.twitter.com/IceCYrip', '_blank')
              }}
            >
              <Twitter className={styles.twitterIcon} />
            </IconButton>
            <IconButton
              onClick={() => {
                window.open('https://github.com/IceCYrip', '_blank')
              }}
            >
              <GitHub className={styles.githubIcon} />
            </IconButton>
            <IconButton
              onClick={() => {
                window.open(
                  'https://www.linkedin.com/in/karan-sable-581641167/',
                  '_blank'
                )
              }}
            >
              <LinkedIn className={styles.linkedInIcon} />
            </IconButton>
          </div>
        </div>
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
