<template>
  <div id="allmap"></div>
</template>

<script>
import BMap from 'BMap'

export default {
  data () {
    return {
      address: ''
    }
  },
  
  mounted () {
    this.MapInit()
  },

  methods: {
    MapInit (a, b) {
      let map = new BMap.Map('allmap')
      let point = new BMap.Point(116.404, 39.915)
      map.centerAndZoom(point, 11)
      let myGeo = new BMap.Geocoder()
      myGeo.getLocation(new BMap.Point(a, b), addressGet)
    },
     addressGet (result) {
       if (result) {
         this.address = result.address
       }
     }
  }
}
</script>

