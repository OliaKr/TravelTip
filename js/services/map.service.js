import { storageService } from "./storage.service.js"

export const mapService = {
    initMap,
    addMarker,
    panTo,
    search
}


// Var that is used throughout this Module (not global)
const MAP_KEY = 'mapDB'
var gMap

function initMap(lat = 32.0749831, lng = 34.9120554) {
    console.log('InitMap')
    return _connectGoogleApi()
        .then(() => {
            console.log('google available from maps')
            gMap = new google.maps.Map(
                document.querySelector('#map'), {
                center: { lat, lng },
                zoom: 15
            })
            console.log('Map!', gMap)
            gMap.addListener("click", (mapsMouseEvent) => {
                const { lat, lng } = mapsMouseEvent.latLng.toJSON()
                // onAddLoc()
                addMarker({lat,lng})
            })
            return gMap
        })
}

function addMarker(loc) {
    var marker = new google.maps.Marker({
        position: loc,
        map: gMap,
        title: 'Hello World!'
    })
    return marker
}

function panTo(lat, lng) {
    var laLatLng = new google.maps.LatLng(lat, lng)
    gMap.panTo(laLatLng)
    addMarker({ lat, lng })
}

function _connectGoogleApi() {
    if (window.google) return Promise.resolve()
    const API_KEY = 'AIzaSyDnFXVkZNr_UUI6PDoFyiFZJTth_dpSAOc' //TODO: Enter your API Key
    var elGoogleApi = document.createElement('script')
    elGoogleApi.src = `https://maps.googleapis.com/maps/api/js?key=${API_KEY}`
    elGoogleApi.async = true
    document.body.append(elGoogleApi)

    return new Promise((resolve, reject) => {
        elGoogleApi.onload = resolve
        elGoogleApi.onerror = () => reject('Google script failed to load')
    })
}
function search(address) {
    console.log('in')
    const API_KEY = 'AIzaSyDnFXVkZNr_UUI6PDoFyiFZJTth_dpSAOc' //TODO: Enter your API Key
    axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${address}&key=${API_KEY}`)
        .then(console.log())

}
