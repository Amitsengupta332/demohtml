let index = 0;
const slider = document.getElementById("slider");
const totalSlides = 2;

function updateSlider() {
  if (!slider) return;
  slider.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
  index = (index + 1) % totalSlides;
  updateSlider();
}

function prevSlide() {
  index = (index - 1 + totalSlides) % totalSlides;
  updateSlider();
}

setInterval(nextSlide, 5000);