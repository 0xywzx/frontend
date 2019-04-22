import React, { Component } from 'react'

class PlaceList extends Component {

  render() {
    return (
      <div id="content">
        <form onSubmit={(event) => {
          event.preventDefault()
          this.props.createPlace(this.place.value)
        }}>
          <input
            id="newPlace"
            ref={(input) => {
              this.place = input
            }}
            type="text"
            className="form-control"
            placeholder="Add place..."
            autoFocus={true}
            required />
          <input type="submit" hidden={true} />
        </form>
        <ul id="placeList" className="list-unstyled">
          { this.props.places.map((place, key) => {
            return(
              <div className={["placeTemplate", "checkbox"]} key={key}>
                <label>
                  <input
                  type="checkbox"
                  name={place.id}
                  defaultChecked={place.completed}
                  ref={(input) => {
                    this.checkbox = input
                  }}
                  onClick={(event) => {
                    this.props.userCheckIn(place.id) }}/>
                  <span className="content">{place.name}</span>
                  <span className="content"> Owner: {place.owner}</span>
                  <p className="content"> Latitude:{place.latitude} Longitude:{place.longitude}</p>
                </label>
              </div>
            )
          })}
        </ul>
        <ul id="completedPlaceList" className="list-unstyled">
        </ul>
      </div>
    );
  }
}

export default PlaceList;
