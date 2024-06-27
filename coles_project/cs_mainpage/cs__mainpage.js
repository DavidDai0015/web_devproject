
document.addEventListener("DOMContentLoaded", function () {
  carouselSliderProduct()
})


// Detecting Button Function
function carouselSliderProduct() {
  const carouselBtns = document.querySelectorAll(".carousel-btn");

  carouselBtns.forEach(button => {
    button.addEventListener("click", () => {
      handleCarouselButtonClick(button);
    });
  });
}

// Button Core Functionality
function handleCarouselButtonClick(button) {
  const carouselSlider = document.querySelector(`.${button.getAttribute("data-carouselClass")}`);
  const direction = button.classList.contains("previous-button") ? -1 : 1;
  const scrollAmount = carouselSlider.clientWidth * direction;
  const oppositeBtn = getOppositeButton(button, direction);

  scrollCarousel(carouselSlider, scrollAmount);
  oppositeBtn.classList.remove("hidden");

  updateButtonVisibility(button, carouselSlider, direction, scrollAmount);
}

// Determine the Opposite Button
function getOppositeButton(button, direction) {
  const classList = button.classList[0];
  return direction < 0
    ? document.querySelector(`.${classList}.next-button`)
    : document.querySelector(`.${classList}.previous-button`);
}

function scrollCarousel(carouselSlider, scrollAmount) {
  carouselSlider.scrollBy({ left: scrollAmount, behavior: "smooth" });
}

// Update Button display
function updateButtonVisibility(button, carouselSlider, direction, scrollAmount) {
  const scrollable = carouselSlider.scrollWidth - carouselSlider.clientWidth - scrollAmount - carouselSlider.scrollLeft;
  const atEnd = scrollable <= 0;
  const atStart = scrollable + carouselSlider.clientWidth === carouselSlider.scrollWidth;

  if (direction > 0 && atEnd) {
    button.classList.add("hidden");
  } else if (direction < 0 && atStart) {
    button.classList.add("hidden");
  }
}