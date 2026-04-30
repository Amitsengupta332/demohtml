let index = 0;
const slider = document.getElementById("slider");
const totalSlides = slider ? slider.children.length : 0;

function updateSlider() {
  if (!slider) return;
  slider.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
  if (!totalSlides) return;
  index = (index + 1) % totalSlides;
  updateSlider();
}

setInterval(nextSlide, 5000);

function playPromoVideo() {
  const video = document.getElementById("promoVideo");
  const button = document.getElementById("playVideoBtn");
  const overlay = document.getElementById("videoOverlay");

  video.play();
  video.setAttribute("controls", "true");

  button.style.display = "none";
  overlay.style.display = "none";
}