const config = require('../config')
const GameState = require('./models/state')

const state = new GameState()

let iterator = 0
const mainLoop = (socket_connections) => {
    //gathering events
    let aggregated_actions = {
        user_actions: {},
        system_actions: []
    }
    for (let user_id in socket_connections) {
        aggregated_actions.user_actions[user_id] = []
    }
    for (let user_id in socket_connections) {
        for (action of socket_connections[user_id].query) {
            if (action.action == 'keyPressed') {
                aggregated_actions.user_actions[user_id].push(action)
                // console.log(action)
            } else if (action.action == 'connection') {
                aggregated_actions.system_actions.push(action)
            }
        }
        socket_connections[user_id].query = []
    }

    //updating state
    updated_state = state.update(aggregated_actions)
    for (let user_id in socket_connections) {
        let current_connection = socket_connections[user_id]
        current_connection.emit('/update', updated_state)
    }
    iterator = iterator % 1000
    if (iterator%60==0) {
        console.log(updated_state.users)
        // console.log(aggregated_actions)

    }
    iterator++
}

module.exports = (socket_connections) => {
    setInterval(() => {
        mainLoop((socket_connections))
    }, 1000 / config.FPS)
}