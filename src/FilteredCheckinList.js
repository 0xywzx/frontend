import React, { Component } from 'react'

class FilteredCheckinList extends Component {

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
              { this.props.filteredCheckins.map((checkin, key) => {
                return(
                  <div key={key}>
                    <p>Placeid:{checkin.placeid}: {checkin.user} </p>
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
  
  export default FilteredCheckinList;
  