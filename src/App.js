import React, { Component } from 'react'
import web3 from './web3.js'
import './App.css'
import { PLACE_LIST_ABI, PLACE_LIST_ADDRESS } from './config'
import PlaceList from './PlaceList'
import CheckinList from './CheckinList'
import FilteredCheckinList from './FilteredCheckinList'

const placeList = new web3.eth.Contract(PLACE_LIST_ABI, PLACE_LIST_ADDRESS)

class App extends Component {
  componentWillMount() {
    this.loadBlockchainData()
  }

  async loadBlockchainData() {   
    this.setState({ placeList })
    
    const placeCount = await placeList.methods.placeCount().call()
    this.setState({ placeCount })
    for (var i = 1; i <= placeCount; i++) {
      const place = await placeList.methods.places(i).call()
      this.setState({
        places: [...this.state.places, place]
      })
    }

    const userCount = await placeList.methods.userCount().call()
    this.setState({ userCount })
    for (var k = 1; k <= userCount; k++) {
      const checkin = await placeList.methods.checkins(k).call()
      checkin.checkintime  = new Date(checkin.checkintime * 1000).toLocaleString()
      this.setState({
        checkins: [...this.state.checkins, checkin]
      })
    }

    await navigator.geolocation.getCurrentPosition(
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude,
      }), 
      err => console.log(err)
    );

    this.setState({ loading: false })
    this.setState({ filtering: false })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      placeCount: 0,
      places: [],
      userCount: 0,
      checkins: [],
      filtering: true,
      filteredCheckins: [],
      latitude: null,
      longitude: null,
      loading: true,
    }

    this.createPlace = this.createPlace.bind(this)
    this.userCheckIn = this.userCheckIn.bind(this)
    this.handleFilterVal = this.handleFilterVal.bind(this)
  }

  createPlace = async (name) => {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({ loading: true })

    await navigator.geolocation.getCurrentPosition(
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude,
      }), 
      err => console.log(err)
    );
    const latitude = String(this.state.latitude);
    const longitude = String(this.state.longitude);

    this.state.placeList.methods.createPlace(name, latitude, longitude).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  userCheckIn = async (placeId) => {
    const accounts = await web3.eth.getAccounts()
    this.setState({ account: accounts[0] })
    this.setState({ loading: true })

    await navigator.geolocation.getCurrentPosition(
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude,
      }), 
      err => console.log(err)
    );
    const latitude = String(this.state.latitude);
    const longitude = String(this.state.longitude);

    this.state.placeList.methods.userCheckIn(placeId, latitude, longitude).send({ from: this.state.account })
    .once('receipt', (receipt) => {
      this.setState({ loading: false })
    })
  }

  handleFilterVal(val) {
    const line = this.state.checkins.filter((item) => (
       item.placeid.indexOf( val ) >= 0
    ));
    this.setState({
      filteredCheckins: line,
      filtering: true
    });
  }
  
  position = async () => {
    await navigator.geolocation.getCurrentPosition(
      position => this.setState({ 
        latitude: position.coords.latitude, 
        longitude: position.coords.longitude,
      }), 
      err => console.log(err)
    );
    console.log(this.state.latitude)
  }

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a className="navbar-brand col-sm-3 col-md-2 mr-0" href="http://www.dappuniversity.com/free-download" target="_blank" rel="noopener noreferrer">Dapp University | Todo List</a>
          <ul className="navbar-nav px-3">
            <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
              <small><a className="nav-link" href="https://gaiax-blockchain.com/"><span id="account"></span>Blockchain Biz</a></small>
            </li>
          </ul>
        </nav>
        <div className="container-fluid">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading ? <
                 div id="loader" className="text-center"><p className="text-center">Loading...</p></div
                 > : <
                  PlaceList
                  places={this.state.places}
                  createPlace={this.createPlace}
                  userCheckIn={this.userCheckIn}
                  handleRefrsh={this.handleRefrsh}
                />
              }
            </main>
          </div>
          <div className="row">
            <main role="main" className="col-lg-12 d-flex justify-content-center">
              { this.state.loading ? (
                <p></p>
                ) : ( this.state.filtering
                  ?<FilteredCheckinList 
                    filteredCheckins={this.state.filteredCheckins}
                    handleFilterVal={this.handleFilterVal}
                    />
                  :<CheckinList 
                    checkins={this.state.checkins}
                    handleFilterVal={this.handleFilterVal}
                    />  
                  )
              } 
            </main>
           </div>   
          <button onClick={this.position} className='Filter'>Filter</button>
        </div>
      </div>
    );
  }
}

export default App;
