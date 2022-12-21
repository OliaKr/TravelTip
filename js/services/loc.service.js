
// import {storageService} from './storage.service.js'

export const locService = {
    post,   // Create
    get,    // Read
    put,    // Update
    remove, // Delete
    query,  // List 
}

const LOC_KEY = 'locationDB'

const gLocs = [
    { id: _makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, createdAt: Date.now(), updatedAt: Date.now() },
    { id: _makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, createdAt: Date.now(), updatedAt: Date.now() },
]


function query(entityType = LOC_KEY, delay = 1000) {
    // var locs = JSON.parse(localStorage.getItem(entityType)) || gLocs
    var locs = JSON.parse(localStorage.getItem(entityType)) 
    if(!locs || !locs.length) locs = gLocs
    return new Promise(resolve => setTimeout(() => resolve(locs), delay))
}

function get(entityId) {
    return query().then(entities => {
        const entity = entities.find(entity => entity.id === entityId)
        // if (!entity) return Promise.reject(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        return entity
    })
}

function post(loc,name) {
    // newEntity = JSON.parse(JSON.stringify(newEntity))
    const newEntity = {..._createLoc(),...loc,name}
    // newEntity.id = _makeId()
    console.log(newEntity);
    return query().then(entities => {
        entities.push(newEntity)
        _save(LOC_KEY, entities)
        return entities
    })
}

function put(updatedEntity) {
    updatedEntity = JSON.parse(JSON.stringify(updatedEntity))
    return query().then(entities => {
        const idx = entities.findIndex(entity => entity.id === updatedEntity.id)
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1, updatedEntity)
        _save(LOC_KEY, entities)
        return updatedEntity
    })
}

function remove(entityId) {
    return query().then(entities => {
        const idx = entities.findIndex(entity => entity.id === entityId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${LOC_KEY}`)
        entities.splice(idx, 1)
        _save(LOC_KEY, entities)
        return entities
    })
}

// Private functions
function _save(entityType = LOC_KEY, entities) {
    localStorage.setItem(entityType, JSON.stringify(entities))
}

function _makeId(length = 5) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return txt
}

function _createLoc(){
    return {
     id: _makeId(), 
     createdAt: Date.now(), 
     updatedAt: Date.now(), 
    }
}