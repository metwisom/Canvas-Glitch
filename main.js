
var requestAnimationFrame = window.requestAnimationFrame;

var canvas = document.getElementById('canvas');

canvas.style.width = '100vw';
canvas.style.height = '100vh';

var resize_canvas = () => {
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;
};
resize_canvas()

window.addEventListener('resize', () => resize_canvas());

var scene = canvas.getContext("2d");


var noise = new Image();
noise.src = '/noise.png'

var image = new Image();
image.src = '/id-monster.jpg'
image.onload = () => requestAnimationFrame(draw);

function draw() {
    scene.sillStyle = '#050505'
    scene.fillRect(0, 0, canvas.width, canvas.height)

    let koef = Math.min(canvas.width / image.width, canvas.height / image.height); //Коеффицент для ресайза
    let centerX = canvas.width / 2 - image.width * koef / 2;
    let centerY = canvas.height / 2 - image.height * koef / 2;

    if (sub_height.value <= 0) {
        sub_height.value = 1;
    }
    let sdvig = 0;
    //if (Math.random() > Math.random() * 2) как варик
    if (Math.random() > 0.9) { // 10% что произойдет глитч т.е примерно 6 раз в секнду при 60 кадрах
        sdvig = Math.random() * sub_padding.value - sub_padding.value / 2;
    }
    for (let tile = 0; tile <= image.height; tile += ~~sub_height.value) { // тайл это горизонтальная полока картинки заданой высоты
        let local_sdvig = 0;
        if (Math.random() > 0.5) { // 50% что не будем гличить тайл
            local_sdvig = sdvig;
        }

        scene.drawImage(image, 0, tile, image.width, sub_height.value, centerX + local_sdvig, centerY + tile * koef, image.width * koef, sub_height.value * koef);
        scene.save();
        scene.scale(-1, 1);
        //scene.drawImage(v, 0, 0, width*-1, height);
        scene.drawImage(image, 0, tile, image.width, sub_height.value, -centerX + local_sdvig - image.width * koef, centerY + tile * koef , -image.width * koef, sub_height.value * koef);
        scene.drawImage(image, 0, tile, image.width, sub_height.value, -centerX + local_sdvig + image.width * koef, centerY + tile * koef , -image.width * koef, sub_height.value * koef);
        scene.restore();
    }
    x_bias = Math.random() * noise.width;
    y_bias = Math.random() * noise.height;

    scene.globalAlpha = 1;
    for (let x = -noise.width; x < canvas.width; x += noise.width) {
        for (let y = -noise.height; y < canvas.height; y += noise.height) {
            scene.drawImage(noise, x +x_bias, y +y_bias, noise.width, noise.height);
            scene.drawImage(noise, x +x_bias, y +y_bias, noise.width, noise.height);
        }
    }
    scene.globalAlpha = 1;
    requestAnimationFrame(draw);
}