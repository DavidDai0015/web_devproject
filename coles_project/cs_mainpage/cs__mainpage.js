// Load the Documents
document.addEventListener("DOMContentLoaded", function () {
  carouselSliderProduct();
  updateHeroCaroWidth();
  hiddenNav();
});

// OnScroll Disable Navigation
function hiddenNav() {
  const navigationBar = document.querySelector(".header__sub");
  const navBarFlex = document.querySelector(".header__nav");

  if (!navigationBar || !navBarFlex) {
    console.error("Navigation elements not found.");
    return;
  }

  document.addEventListener("scroll", () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      navigationBar.classList.add("closed");
      navBarFlex.classList.add("disable");
    } else {
      navigationBar.classList.remove("closed");
      navBarFlex.classList.remove("disable");
    }
  });
}

// Detecting Button Function
function carouselSliderProduct() {
  const carouselBtns = document.querySelectorAll(".carousel-btn");

  if (!carouselBtns.length) {
    console.error("Carousel buttons not found.");
    return;
  }

  carouselBtns.forEach(button => {
    button.addEventListener("click", () => {
      handleCarouselButtonClick(button);
    });
  });
}

// Button Core Functionality
function handleCarouselButtonClick(button) {
  const carouselClass = button.getAttribute("data-carouselClass");
  const carouselSlider = document.querySelector(`.${carouselClass}`);

  if (!carouselSlider) {
    console.error(`Carousel slider with class ${carouselClass} not found.`);
    return;
  }

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

// Hero Carousel width changer & Element
function updateHeroCaroWidth() {
  const heroContainer = document.querySelector(".hero__container");
  const heroIndexUl = document.querySelector(".index-slide-ul");

  if (!heroContainer || !heroIndexUl) {
    console.error("Hero container or index list not found.");
    return;
  }

  const containerSlideNum = heroContainer.childElementCount;
  let indexLi = "";

  heroContainer.style.width = `calc(100vw * ${containerSlideNum})`;

  for (let i = 0; i < containerSlideNum; i++) {
    indexLi += i === 0
      ? `<li class="index-slide-li selected">
           <button class="index-slide-pagination index-btn">
             <span class="pagination-dot selected" aria-label="hidden"></span>
           </button>
         </li>`
      : `<li class="index-slide-li">
           <button class="index-slide-pagination index-btn">
             <span class="pagination-dot" aria-label="hidden"></span>
           </button>
         </li>`;
  }

  heroIndexUl.innerHTML = indexLi;
}

// If Mouse is Down 



