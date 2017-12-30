export default {
  geoGet (state, geo) {
    state.latitude = geo.latitude
    state.longitude = geo.longitude
  },

  clientHeightSave (state, clientHeight) {
    state.clientHeight = clientHeight
  }
}
