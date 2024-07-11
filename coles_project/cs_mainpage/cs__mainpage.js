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
    indexLi +=
      `<li class="index-slide-li selected">
        <button class="index-slide-pagination index-btn">
          <span class="pagination-dot" aria-label="hidden"></span>
        </button>
      </li>`;
  }

  heroIndexUl.innerHTML = indexLi;
  updateIndexPagination()
}

// Testing
const wrapper = document.querySelector('.hero__carousel');
const carousel = wrapper.querySelector('.hero__container');
const arrowBtns = wrapper.querySelectorAll('.hero_index-btn');
const firstCard = carousel.querySelector('.hero__carousel-slide');

let translationHeroCarousel = 0;
let direction = -1;

function handleArrowClick(btn) {
  // Disable buttons to prevent multiple clicks during transition
  arrowBtns.forEach(button => button.disabled = true);

  if (direction === -1 && btn.id !== 'left') {
    direction = 1;
    carousel.appendChild(carousel.firstElementChild);
  } else if (direction === 1 && btn.id === 'left') {
    direction = -1;
    carousel.prepend(carousel.lastElementChild);
  }

  translationHeroCarousel = btn.id === 'left' ? -firstCard.clientWidth : firstCard.clientWidth;
  direction = btn.id === 'left' ? -1 : 1;
  wrapper.style.justifyContent = btn.id === 'left' ? 'flex-start' : 'flex-end';

  carousel.style.transition = 'transform 500ms ease';
  carousel.style.transform = `translate3d(${translationHeroCarousel}px, 0, 0)`;
}

function handleTransitionEnd() {
  if (direction === -1) {
    carousel.appendChild(carousel.firstElementChild);
  } else if (direction === 1) {
    carousel.prepend(carousel.lastElementChild);
  }

  carousel.style.transition = 'none';
  carousel.style.transform = 'translate3d(0, 0, 0)';

  // Re-enable the buttons after the transition ends
  setTimeout(() => {
    arrowBtns.forEach(button => button.disabled = false);
  }, 0);

  updateIndexPagination();
}

function updateIndexPagination() {
  const paginations = wrapper.querySelectorAll('.pagination-dot');
  const selectedIndex = direction === -1 ?
    carousel.firstElementChild.getAttribute('data-index') :
    carousel.lastElementChild.getAttribute('data-index');

  paginations.forEach(pagination => {
    pagination.classList.remove('selected');
  });

  paginations[selectedIndex].classList.add('selected');
}

arrowBtns.forEach(btn => {
  btn.addEventListener('click', () => handleArrowClick(btn));
});

carousel.addEventListener('transitionend', handleTransitionEnd);



