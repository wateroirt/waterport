function scaleGameToViewport() {
  const game = document.getElementById("game");
  const scaleX = window.innerWidth / WATERPORT_CONFIG.resolution.width;
  const scaleY = window.innerHeight / WATERPORT_CONFIG.resolution.height;
  const scale = Math.min(scaleX, scaleY);
  game.style.transform = `scale(${scale})`;
}
