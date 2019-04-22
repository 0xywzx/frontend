import React, { Component } from 'react'

class CheckinList extends Component {

    constructor(props) {
      super(props)
      this.state = {
        val: ''
      }
    }
  
    _filterVal = e => {
      this.setState({ val: e.target.value })
      this.props.handleFilterVal(this.state.val)
    } 
  
    handleSetFilter = async () => {
      this.props.handleFilterVal(this.state.val)
    }
  
    render() {
      return (
        <div id="content">
          <div>
            <li>Checkin List</li>
            <input
              type="text"
              defaultValue=""
              onKeyUp={this._filterVal}
            />
            <button onClick={this.handleSetFilter} className='Filter'>Filter</button>
              { this.props.checkins.map((checkin, key) => {
                return(
                  <div key={key}>
                    <span className="content">Placeid:{checkin.placeid}</span>
                    <span className="content">User:{checkin.user}</span>
                    <span className="content">User:{checkin.checkintime }</span>
                    <p className="content"> Latitude:{checkin.latitude} Longitude:{checkin.longitude}</p>
                  </div>
                )
              })}
          </div>  
          <ul id="completedPlaceList" className="list-unstyled">
          </ul>
        </div>
      );
    }
  }
  
  export default CheckinList;
  