const Vector = require('./vector')

module.exports = class User {
    constructor() {
        this.position = new Vector(10, 10)
    }
}