export default {
  geohash (state) { // geohash
    if (state.latitude && state.longitude) {
      return `${state.latitude},${state.longitude}`
    }
  }
}
