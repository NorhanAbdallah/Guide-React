import React from 'react'
import Player from './play'
import { Container, Col, Row } from "reactstrap"
const page = {
  width: '100vw',
  height: '100vh',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}
const keyboard = {
  width: '300px',
  height: '300px',
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center',
  border: '1px solid black',
}

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      currentKey: [],
      bankTwo: [
        {
          keyCode: 81,
          keyTrigger: 'Q',
          id: 'Chord-1',
          url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_1.mp3',
        },
        {
          keyCode: 87,
          keyTrigger: 'W',
          id: 'Chord-2',
          url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_2.mp3',
        },
        {
          keyCode: 69,
          keyTrigger: 'E',
          id: 'Chord-3',
          url: 'https://s3.amazonaws.com/freecodecamp/drums/Chord_3.mp3',
        },
        {
          keyCode: 65,
          keyTrigger: 'A',
          id: 'Shaker',
          url:
            'https://s3.amazonaws.com/freecodecamp/drums/Give_us_a_light.mp3',
        },
        {
            keyCode: 83,
            keyTrigger: 'S',
            id: 'Open-HH',
            url: 'https://s3.amazonaws.com/freecodecamp/drums/Dry_Ohh.mp3',
          },
          {
            keyCode: 68,
            keyTrigger: 'D',
            id: 'Closed-HH',
            url: 'https://s3.amazonaws.com/freecodecamp/drums/Bld_H1.mp3',
          },
          {
            keyCode: 90,
            keyTrigger: 'Z',
            id: 'Punchy-Kick',
            url: 'https://s3.amazonaws.com/freecodecamp/drums/punchy_kick_1.mp3',
          },
          {
            keyCode: 88,
            keyTrigger: 'X',
            id: 'Side-Stick',
            url: 'https://s3.amazonaws.com/freecodecamp/drums/side_stick_1.mp3',
          },
          {
            keyCode: 67,
            keyTrigger: 'C',
            id: 'Snare',
            url: 'https://s3.amazonaws.com/freecodecamp/drums/Brk_Snr.mp3',
          },
        ],
        isChecked: false,
        bgColor: 'white',
      }
      this.handleKeyPress = this.handleKeyPress.bind(this)
  
      this.Q = React.createRef()
      this.W = React.createRef()
      this.E = React.createRef()
      this.A = React.createRef()
      this.D = React.createRef()
      this.S = React.createRef()
      this.Z = React.createRef()
      this.X = React.createRef()
      this.C = React.createRef()
    }
    componentDidMount() {
        document.addEventListener('keydown', this.handleKeyPress)
      }
    
      componentWillUnmount() {
        document.removeEventListener('keydown', this.handleKeyPress)
      }
    
      playAudioOnClick = e => {
        e.target.children[0].play()
        this[e.target.id].current.toggleActiveState()
    
      }
    
      handleKeyPress = e => {
        if (this.state.isChecked) {
          // in any case uppercase
          let which = e.key.toUpperCase()
    
          // check if the pressed key is defined as a keyTrigger in the state else do nothing
          if (
            this.state.bankTwo.some(key => {
              return key.keyTrigger === which
            })
          ) {
            // trigger functions in child
            this[which].current.playAudio()
            this[which].current.toggleActiveState()
          }
        }
    }
    handleCheck = () => {
      this.setState({
        isChecked: !this.state.isChecked,
      })
    }
  
    render() {
      const drum = this.state.bankTwo.map(player => {
        return (
            
              
          <Player
            id={player.keyTrigger}
            ref={this[player.keyTrigger]}
            key={player.keyCode}
            keyTrigger={player.keyTrigger}
            url={player.url}
            clicked={this.playAudioOnClick}
          />
          
        
        )
      })
  
      return (
        <section style={page}>
          <main style={keyboard}>{drum}</main>
          {/* <section>
            <label>play with keyboard</label>
            <input type="checkbox" onChange={this.handleCheck} />
          </section> */}
        </section>
      )
    }
  }