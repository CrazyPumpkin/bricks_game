var socket = io();
socket.on('connect', () => {
    socket.emit('/hello', uuid4())
});
socket.on('/update', function(data){
    console.log(data)
});
socket.on('disconnect', function(){});


type = "canvas";

let app = new PIXI.Application({
            width: 256,         // default: 800
            height: 256,        // default: 600
            antialias: true,    // default: false
            transparent: false, // default: false
            resolution: 1       // default: 1
    }
);

app.renderer.backgroundColor = 0x061639;

PIXI.AbstractRenderer.autoDensity = true;
app.renderer.resize(512, 512);
app.renderer.view.style.position = "absolute";
app.renderer.view.style.display = "block";



app.renderer.resize(window.innerWidth, window.innerHeight);
let rectangle = new PIXI.Graphics();
rectangle.lineStyle(4, 0x66CCFF, 1);
rectangle.beginFill(0x061639);
rectangle.drawRect(50, 50, 1300, 300);
rectangle.endFill();


app.stage.addChild(rectangle);
let player = new PIXI.Graphics();
player.lineStyle(4, 0xFF3300, 1);
player.beginFill(0x000000);

player.drawRect(60, 60, 20, 20);
player.interactive = true;

player.endFill();

app.stage.addChild(player);
// s.emit("test", {"x":1, "y": 2});




let left = keyboard("ArrowLeft"),
    up = keyboard("ArrowUp"),
    right = keyboard("ArrowRight"),
    down = keyboard("ArrowDown");


right.press = () => {
    console.log("handler right");
    player.x += 10;
};


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

function uuid4()
{
    function hex (s, b)
    {
        return s +
            (b >>> 4   ).toString (16) +  // high nibble
            (b & 0b1111).toString (16);   // low nibble
    }

    let r = crypto.getRandomValues (new Uint8Array (16));

    r[6] = r[6] >>> 4 | 0b01000000; // Set type 4: 0100
    r[8] = r[8] >>> 3 | 0b10000000; // Set variant: 100

    return r.slice ( 0,  4).reduce (hex, '' ) +
        r.slice ( 4,  6).reduce (hex, '-') +
        r.slice ( 6,  8).reduce (hex, '-') +
        r.slice ( 8, 10).reduce (hex, '-') +
        r.slice (10, 16).reduce (hex, '-');
}
