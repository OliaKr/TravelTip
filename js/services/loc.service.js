
import {storageService} from './storage.service.'

// export const locService = {
//     getLocs
// }
export const locService = {
    post,   // Create
    get,    // Read
    put,    // Update
    remove, // Delete
    query,  // List 
}

const LOC_KEY = 'locationDB'

const gLocs = [
    { id: _makeId(), name: 'Greatplace', lat: 32.047104, lng: 34.832384, weather, createdAt: Date().now, updatedAt: Date().now },
    { id: _makeId(), name: 'Neveragain', lat: 32.047201, lng: 34.832581, weather, createdAt: Date().now, updatedAt: Date().now },
]


function query(entityType = LOC_KEY, delay = 1000) {
    var locs  = JSON.parse(localStorage.getItem(entityType)) || gLocs
    return new Promise(resolve => setTimeout(() => resolve(locs), delay))
}

function get(entityType, entityId) {
    return query(entityType).then(entities => {
        const entity = entities.find(entity => entity.id === entityId)
        // if (!entity) return Promise.reject(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        if (!entity) throw new Error(`Get failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        return entity
    })
}

function post(entityType, newEntity) {
    newEntity = JSON.parse(JSON.stringify(newEntity))
    newEntity.id = _makeId()
    return query(entityType).then(entities => {
        entities.push(newEntity)
        _save(entityType, entities)
        return newEntity
    })
}

function put(entityType, updatedEntity) {
    updatedEntity = JSON.parse(JSON.stringify(updatedEntity))
    return query(entityType).then(entities => {
        const idx = entities.findIndex(entity => entity.id === updatedEntity.id)
        if (idx < 0) throw new Error(`Update failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1, updatedEntity)
        _save(entityType, entities)
        return updatedEntity
    })
}

function remove(entityType, entityId) {
    return query(entityType).then(entities => {
        const idx = entities.findIndex(entity => entity.id === entityId)
        if (idx < 0) throw new Error(`Remove failed, cannot find entity with id: ${entityId} in: ${entityType}`)
        entities.splice(idx, 1)
        _save(entityType, entities)
    })
}

// Private functions
function _save(entityType, entities) {
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