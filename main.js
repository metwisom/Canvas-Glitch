var resizeFactor = 1;
var centerX = 1;
var centerY = 1;
const canvas = document.getElementById("canvas");
const scene = canvas.getContext("2d");
scene.sillStyle = "#050505";

/**
 * Settings
 */
const subHeight = 40; // any value in pixels
const subPadding = 500; // any value in pixels
const frameGlitchChance = 0.1; // 0-1
const tileGlitchChance = 0.1; // 0-1
const noiseUrl = "./assets/noise.png";
const monsterUrl = "./assets/monster.jpg";

const noise = new Image();
noise.src = noiseUrl;
const noiseLoaded = new Promise((res) => (noise.onload = res));

const monster = new Image();
monster.src = monsterUrl;
const monsterLoaded = new Promise((res) => (monster.onload = res));

Promise.all([noiseLoaded, noiseLoaded]).then((res) => {
  requestAnimationFrame(draw);
  const resizeСanvas = () => {
    canvas.width = canvas.getBoundingClientRect().width;
    canvas.height = canvas.getBoundingClientRect().height;

    resizeFactor = Math.min(
      canvas.width / monster.width,
      canvas.height / monster.height
    );

    centerX = canvas.width / 2 - (monster.width * resizeFactor) / 2;
    centerY = canvas.height / 2 - (monster.height * resizeFactor) / 2;
  };
  resizeСanvas();
  window.addEventListener("resize", () => resizeСanvas());
});

function draw() {
  scene.fillRect(0, 0, canvas.width, canvas.height);

  let offset = 0;
  if (Math.random() < frameGlitchChance) {
    offset = Math.random() * subPadding - subPadding / 2;
  }
  for (let tile = 0; tile <= monster.height; tile += ~~subHeight) {
    let tileOffset = 0;
    if (offset && Math.random() < tileGlitchChance) {
      tileOffset = offset;
    }

    scene.drawImage(
      monster,
      0,
      tile,
      monster.width,
      subHeight,
      centerX + tileOffset,
      centerY + tile * resizeFactor,
      monster.width * resizeFactor,
      subHeight * resizeFactor
    );

    scene.save();
    scene.scale(-1, 1);

    scene.drawImage(
      monster,
      0,
      tile,
      monster.width,
      subHeight,
      -centerX + tileOffset - monster.width * resizeFactor,
      centerY + tile * resizeFactor,
      -monster.width * resizeFactor,
      subHeight * resizeFactor
    );
    scene.drawImage(
      monster,
      0,
      tile,
      monster.width,
      subHeight,
      -centerX + tileOffset + monster.width * resizeFactor,
      centerY + tile * resizeFactor,
      -monster.width * resizeFactor,
      subHeight * resizeFactor
    );
    scene.restore();
  }

  const noiseXBias = Math.random() * noise.width;
  const noiseYBias = Math.random() * noise.height;
  for (let x = -noise.width; x < canvas.width; x += noise.width) {
    for (let y = -noise.height; y < canvas.height; y += noise.height) {
      scene.drawImage(
        noise,
        x + noiseXBias,
        y + noiseYBias,
        noise.width,
        noise.height
      );
      scene.drawImage(
        noise,
        x + noiseXBias,
        y + noiseYBias,
        noise.width,
        noise.height
      );
    }
  }
  requestAnimationFrame(draw);
}
