const User = require('./user')
const Vector = require('./vector')
const viewport = require('pixi-viewport').Viewport

module.exports = class GameState {
    constructor() {
        this.exports = {
            users: {}
        }
    }

    update(aggregated_actions) {
        let self = this.exports
        for (const system_action of aggregated_actions.system_actions) {
            if ((system_action.value === 'connected') && !(system_action.user_id in self.users) && system_action.user_id) {
                self.users[system_action.user_id] = new User()
            } else if ((system_action.value === 'disconnected') && (system_action.user_id in self.users)) {
                delete self.users[system_action.user_id]
            }
        }

        // console.log(aggregated_actions.user_actions)
        for (let user_id in aggregated_actions.user_actions) {
            let user_actions = aggregated_actions.user_actions[user_id]

            for (action of user_actions) {
                switch (action.value) {
                    case "ArrowRight":
                        self.users[user_id].position.add(new Vector(10, 0))
                        break
                    case "ArrowLeft":
                        self.users[user_id].position.add(new Vector(-10, 0))
                        break
                    case "ArrowUp":
                        self.users[user_id].position.add(new Vector(0, -10))
                        break
                    case "ArrowDown":
                        self.users[user_id].position.add(new Vector(0, 10))
                        break
                }
            }
        }

        return this
    }
}