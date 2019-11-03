var socket = io();

socket.on('connect', () => {
    socket.emit('/hello')
});

socket.on('/update', (data) => {

    if (data.users.length === 0) {
        return players.clear()
    }

    for (const uuid in data.users) {

        let reqUser = data.users[uuid];
        let player = players.get(uuid);

        // unknown player
        if (player === undefined) {

            let newPlayer = new PIXI.Graphics();
            randHex = () => {
                return  '0x' + (function co(lor){   return (lor +=
                    [0,1,2,3,4,5,6,7,8,9,'a','b','c','d','e','f'][Math.floor(Math.random()*16)])
                && (lor.length == 6) ?  lor : co(lor); })('');
            }

            newPlayer.lineStyle(4, randHex(), 1);
            newPlayer.beginFill(randHex()); // TODO: rand color

            newPlayer.drawRect(reqUser.position.x, reqUser.position.y, 20, 20);
            newPlayer.interactive = true;

            newPlayer.endFill();

            players.set(uuid, newPlayer);

            app.stage.addChild(newPlayer);
            continue
        }

        player.x = reqUser.position.x;
        player.y = reqUser.position.y;

        players.set(uuid, player)
    }

    function removeExitPlayers(value, key, map) {
        if (!(key in data.users)) {
            delete players[key]
        }
    }

    if (data.users.length !== players.size) {
        players.forEach(removeExitPlayers)
    }
});

socket.on('disconnect', function(){});

let players = new Map();


type = "canvas";

let app = new PIXI.Application({
            width: 256,         // default: 800
            height: 256,        // default: 600
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
    }
);

PIXI.AbstractRenderer.autoDensity = true;
app.renderer.backgroundColor = 0x061639;
app.renderer.resize(512, 512);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";
app.renderer.resize(window.innerWidth, window.innerHeight);

let border = new PIXI.Graphics();
border.lineStyle(4, 0x66CCFF, 1);
border.beginFill(0x061639);
border.drawRect(50, 50, 1300, 300);
border.endFill();

app.stage.addChild(border);

// PIXI.Loader.shared
//     .add("images/background.png")
//     .load(setup);
//
// // WIP
// function setup() {
//
//     //There are 3 ways to make sprites from textures atlas frames
//
//     //1. Access the `TextureCache` directly
//     let dungeonTexture = TextureCache["background.png"];
//     dungeon = new Sprite(dungeonTexture);
//     app.stage.addChild(dungeon);
//
//     //2. Access the texture using through the loader's `resources`:
//     explorer = new Sprite(
//         resources["images/treasureHunter.json"].textures["explorer.png"]
//     );
//     explorer.x = 68;
//
//     //Center the explorer vertically
//     explorer.y = app.stage.height / 2 - explorer.height / 2;
//     app.stage.addChild(explorer);
//
//     //3. Create an optional alias called `id` for all the texture atlas
//     //frame id textures.
//     id = PIXI.loader.resources["images/treasureHunter.json"].textures;
//
//     //Make the treasure box using the alias
//     treasure = new Sprite(id["treasure.png"]);
//     app.stage.addChild(treasure);
//
//     //Position the treasure next to the right edge of the canvas
//     treasure.x = app.stage.width - treasure.width - 48;
//     treasure.y = app.stage.height / 2 - treasure.height / 2;
//     app.stage.addChild(treasure);
// }

let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");


left.press = () => {
    emitUpdatePressed("ArrowLeft")
};
up.press = () => {
    emitUpdatePressed("ArrowUp")
};
right.press = () => {
    emitUpdatePressed("ArrowRight")
};
down.press = () => {
    emitUpdatePressed("ArrowDown")
};

const actionKeyPressed = 'keyPressed'
function emitUpdatePressed(aEnum) {
    ret = {action:actionKeyPressed, enum:aEnum}
    socket.emit('/event', ret)
}

document.body.appendChild(app.view);

function keyboard(value) {
    let key = {};
    key.value = value;
    key.isDown = false;
    key.isUp = true;
    key.press = undefined;
    key.release = undefined;
    //The `downHandler`
    key.downHandler = event => {
        if (event.key === key.value) {
            if (key.isUp && key.press) key.press();
            key.isDown = true;
            key.isUp = false;
            event.preventDefault();
        }
    };

    //The `upHandler`
    key.upHandler = event => {
        if (event.key === key.value) {
            if (key.isDown && key.release) key.release();
            key.isDown = false;
            key.isUp = true;
            event.preventDefault();
        }
    };

    //Attach event listeners
    const downListener = key.downHandler.bind(key);
    const upListener = key.upHandler.bind(key);

    window.addEventListener(
        "keydown", downListener, false
    );
    window.addEventListener(
        "keyup", upListener, false
    );

    // Detach event listeners
    key.unsubscribe = () => {
        window.removeEventListener("keydown", downListener);
        window.removeEventListener("keyup", upListener);
    };

    return key;
}
