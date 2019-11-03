var socket = io();

socket.on('connect', () => {
    socket.emit('/hello')
});

socket.on('/update', (data) => {
    for (const uuid in data.users) {

        let reqUser = data.users[uuid];
        let player = players.get(uuid);

        // unknown player
        if (player === undefined) {

            let newPlayer = new PIXI.Graphics();
            newPlayer.lineStyle(4, 0xFF3300, 1);
            newPlayer.beginFill(0x000000); // TODO: rand color

            newPlayer.drawRect(reqUser.x, reqUser.y, 20, 20);
            newPlayer.interactive = true;

            newPlayer.endFill();

            players.set(uuid, newPlayer);

            app.stage.addChild(newPlayer);
            continue
        }

        player.x = data.users[uuid].x;
        player.y = data.users[uuid].y;

        players.set(uuid, player)
    }

    function removeExitPlayers(value, key, map) {
        if (!data.users[key].has()) {
            players.delete(key)
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
