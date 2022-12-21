import { locService } from './services/loc.service.js'
import { mapService } from './services/map.service.js'
import { storageService } from './services/storage.service.js'

window.onload = onInit
window.onAddMarker = onAddMarker
window.onPanTo = onPanTo
window.onGetUserPos = onGetUserPos
window.renderSavedLocs = renderSavedLocs
window.onRemoveLoc = onRemoveLoc
window.onSearch = onSearch
window.onAddLoc = onAddLoc

function onInit() {
    mapService.initMap()
        .then(map => {
            map.addListener("click", (mapsMouseEvent) => {
                const { lat, lng } = mapsMouseEvent.latLng.toJSON()
                onAddLoc({ lat, lng })
                onAddMarker({ lat, lng })
            })
        })
        .then(() => {
            console.log('Map is ready')
        })
        .catch(() => console.log('Error: cannot init map'))
    // locService.post()
    //     .then(console.log())

    locService.query()
        .then(renderSavedLocs)
}

function onAddLoc(loc) {
    const placeName = prompt('Where are we?')
    if(!placeName) return
    locService.post(loc,placeName)
        .then(renderSavedLocs)
}

function renderSavedLocs(locs) {
    console.log(locs)
    const strHTMLs = locs.map(loc => {
        const { id, name, lat, lng, createdAt } = loc
        return `
        <article class="loc">
        <button class="btn-remove" onclick="onRemoveLoc('${id}')">✖️</button>
        <h4>${name}</h4>
        <ul>
            <li>lat: ${lat}</li>
            <li>lng: ${lng}</li>
        </ul>
        <button onclick="onPanTo(${lat},${lng})">GO</button>
        <p>${new Date(createdAt).toUTCString()}</p>
        </article>`
    })
    document.querySelector('.locations-table').innerHTML = strHTMLs.join('')
}

function onRemoveLoc(locId) {
    console.log(locId)
    locService.remove(locId)
        .then(renderSavedLocs)
}

// This function provides a Promise API to the callback-based-api of getCurrentPosition
function getPosition() {
    console.log('Getting Pos')
    return new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(resolve, reject)
    })
}

function onSearch(ev) {
    ev.preventDefault()
    const val = document.querySelector('.input-search').value
    console.log(val)
    mapService.search(val)
}

function onAddMarker(loc) {
    const { lat, lng } = loc
    console.log('Adding a marker')
    mapService.addMarker({ lat, lng })
}

// function onGetLocs() {
//     locService.getLocs()
//         .then(locs => {
//             console.log('Locations:', locs)
//             document.querySelector('.locs').innerText = JSON.stringify(locs, null, 2)
//         })
// }

function onGetUserPos() {
    getPosition()
        .then(pos => {
            console.log('User position is:', pos.coords)
            const { latitude: lat, longitude: lng } = pos.coords
            document.querySelector('.user-pos').innerText =
                `Latitude: ${lat} - Longitude: ${lng}`
            mapService.panTo(lat, lng)
        })
        .catch(err => {
            console.log('err!!!', err)
        })
}
function onPanTo(lat, lng) {
    console.log(lat, lng)
    console.log('Panning the Map')
    mapService.panTo(lat, lng)
}