const User = require('./user')
const Vector = require('./vector')

module.exports = class GameState {
    constructor() {
        this.users = {}
    }

    update(aggregated_actions) {
        for (const system_action of aggregated_actions.system_actions) {
            // console.log(aggregated_actions)
            // console.log((system_action.enum == 'disconnected'), (system_action.user_id in this.users), system_action.user_id)
            if ((system_action.enum == 'connected') && !(system_action.user_id in this.users) && system_action.user_id) {
                this.users[system_action.user_id] = new User()
                // console.log(`${this.users[system_action.user_id]} has been added to state`)state
            } else if ((system_action.enum == 'disconnected') && (system_action.user_id in this.users)) {
                delete this.users[system_action.user_id]
            }
        }

        // console.log(aggregated_actions.user_actions)
        for (let user_id in aggregated_actions.user_actions) {
            let user_actions = aggregated_actions.user_actions[user_id]

            for (action of user_actions) {
                switch (action.enum) {
                    case "ArrowRight":
                        this.users[user_id].position.add(new Vector(1, 0))
                        break
                    case "ArrowLeft":
                        this.users[user_id].position.add(new Vector(-1, 0))
                        break
                    case "ArrowUp":
                        this.users[user_id].position.add(new Vector(0, -1))
                        break
                    case "ArrowDown":
                        this.users[user_id].position.add(new Vector(0, 1))
                        break
                }
            }
        }

        return this
    }
}