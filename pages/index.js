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
import React, { useState } from 'react'
import { Search } from '@mui/icons-material'
import axios from 'axios'
import sweetAlert from 'sweetalert'

export default function Home() {
  const [playerProfile, setPlayerProfile] = useState()

  const getPlayerData = () => {
    const playerName = document.getElementById('playerName').value

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

  return (
    <>
      <Head>
        <title>{`Grandmaster's Corner`}</title>
      </Head>
      <div className={styles.wrapper}>
        <h1>{`Welcome to Grandmaster's Corner`}</h1>
        <h2>{`A one-stop solution for your favourite player's stats`}</h2>
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
                  height={175}
                  width={175}
                  alt="avatar"
                />
              ) : (
                <Image
                  className={styles.avatar}
                  src="/noImageFound.png"
                  height={175}
                  width={175}
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
