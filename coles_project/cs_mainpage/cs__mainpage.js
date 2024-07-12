document.addEventListener('DOMContentLoaded', function () {
  // Initialize hero carousel functionality
  initHeroCarousel();
  initProductCarousel();
  updateHeroCaroWidth();
  initNavHideOnScroll();
});

// Initialize hero carousel functionality
function initHeroCarousel() {
  const wrapper = document.querySelector('.hero__carousel');
  const carousel = wrapper.querySelector('.hero__container');
  const arrowBtns = wrapper.querySelectorAll('.hero_index-btn');
  const firstCard = carousel.querySelector('.hero__carousel-slide');

  // Defining neccesary Variable
  let direction = -1;
  let isTransitioning = false;
  let dragging = false;
  let startX = 0;
  let draggingDisabled = false;

  // Event listeners for drag functionality
  carousel.addEventListener('mousedown', handleDragStart);
  carousel.addEventListener('mouseup', handleDragEnd);
  carousel.addEventListener('mouseleave', handleDragEnd);
  carousel.addEventListener('mousemove', handleDragMove);

  // Event Listener For Button
  carousel.addEventListener('transitionend', handleTransitionEnd);
  arrowBtns.forEach(btn => { btn.addEventListener('click', () => handleArrowClick(btn)); });

  // Button Functionality ================================================================================================================
  function handleArrowClick(btn) {

    // Disable button & drag when pressing
    arrowBtns.forEach(button => button.disabled = true);
    draggingDisabled = true;

    // Adjustment to the carousel when changing direction & Transform
    const isNext = btn.classList.contains("next-button");
    transformCarousel(isNext, firstCard.clientWidth)
    isTransitioning = true;

    // Adding Animation
    carousel.style.transition = 'transform 500ms ease';
  }

  // Drag Functionality ================================================================================================================
  // Track the starting position and start drag event
  function handleDragStart(event) {
    if (draggingDisabled) return;
    startX = event.clientX;
    dragging = true;
    carousel.style.transition = '';
  }

  function handleDragMove(event) {
    if (!dragging || draggingDisabled) return;
    const diffX = event.clientX - startX;
    carousel.style.transform = `translate3d(${diffX}px, 0, 0)`;
  }

  function handleDragEnd(event) {
    if (!dragging) return;
    dragging = false;
    draggingDisabled = true;

    // Add Animation
    carousel.style.transition = 'transform 500ms ease';

    const currentX = event.clientX
    const diffX = currentX - startX;

    // Determine if a slide change is needed
    if (Math.abs(diffX) > 150) {
      transformCarousel(diffX < 0, firstCard.clientWidth)
      isTransitioning = true;

    } else {
      // Revert to original position
      carousel.style.transform = `translate3d(0, 0, 0)`;
      setTimeout(() => { draggingDisabled = false; }, 500)
    }

    // Update Index
    updateIndexPagination();
  }

  // Transition End ================================================================================================================

  // Handle transition end events
  function handleTransitionEnd() {
    if (!isTransitioning) return;

    // Move the slide to the end
    if (direction === -1) {
      carousel.appendChild(carousel.firstElementChild);
    } else if (direction === 1) {
      carousel.prepend(carousel.lastElementChild);
    }

    carousel.style.transition = '';
    carousel.style.transform = 'translate3d(0, 0, 0)';

    setTimeout(() => {
      arrowBtns.forEach(button => button.disabled = false);
      isTransitioning = false;
      draggingDisabled = false;
    }, 0);

    updateIndexPagination();
  }


  // Transform the Carousel
  function transformCarousel(isRight, transformAmount) {
    if (direction === -1 && !isRight) {
      direction = 1;
      carousel.appendChild(carousel.firstElementChild);
    } else if (direction === 1 && isRight) {
      direction = -1;
      carousel.prepend(carousel.lastElementChild);
    }

    direction = isRight ? -1 : 1
    wrapper.style.justifyContent = isRight ? 'flex-start' : 'flex-end';
    carousel.style.transform = `translate3d(${direction * transformAmount}px, 0, 0)`;
  }

  // Update Dot ================================================================================================================
  // Update the Dot index
  function updateIndexPagination() {
    const paginations = wrapper.querySelectorAll('.pagination-dot');
    const selectedIndex = direction === -1 ?
      carousel.firstElementChild.getAttribute('data-index') :
      carousel.lastElementChild.getAttribute('data-index');

    // Remove dot classes
    paginations.forEach(pagination => { pagination.classList.remove('selected'); });
    paginations[selectedIndex].classList.add('selected');
  }

}

// Product Carousel ================================================================================================================
// Initialize hero carousel functionality
function initProductCarousel() {
  const carouselBtns = document.querySelectorAll('.carousel-btn');

  // Add event Listener for the Button
  carouselBtns.forEach(button => { button.addEventListener('click', () => handleCarouselButtonClick(button)); });

  function handleCarouselButtonClick(button) {
    const carouselClass = button.getAttribute('data-carouselClass');
    const carouselSlider = document.querySelector(`.${carouselClass}`);

    if (!carouselSlider) { // Debugging
      console.error(`Carousel slider with class ${carouselClass} not found.`);
      return;
    }

    // Calculate the scrollamount, direction, and the opposing button
    const direction = button.classList.contains('previous-button') ? -1 : 1;
    const scrollAmount = carouselSlider.clientWidth * direction;
    const oppositeBtn = getOppositeButton(button, direction);


    scrollCarousel(carouselSlider, scrollAmount);
    oppositeBtn.classList.remove('hidden');

    updateButtonVisibility(button, carouselSlider, direction, scrollAmount);
  }

  // Get Opposing Button
  function getOppositeButton(button, direction) {
    const classList = button.classList[0];
    return direction < 0 ?
      document.querySelector(`.${classList}.next-button`) :
      document.querySelector(`.${classList}.previous-button`);
  }

  // Scroll Button
  function scrollCarousel(carouselSlider, scrollAmount) {
    carouselSlider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  }

  function updateButtonVisibility(button, carouselSlider, direction, scrollAmount) {
    // Scrollable = What is the width in total - the size of displaying - how much you going to scroll - how much left to scroll
    const scrollable = carouselSlider.scrollWidth - carouselSlider.clientWidth - scrollAmount - carouselSlider.scrollLeft;
    const atEnd = scrollable <= 0;
    const atStart = scrollable + carouselSlider.clientWidth >= carouselSlider.scrollWidth;

    // if reaches the end, hide the button
    if (direction > 0 && atEnd) {
      button.classList.add('hidden');
    } else if (direction < 0 && atStart) {
      button.classList.add('hidden');
    }
  }
}

// Initilisation of Hero Carousel ================================================================================================================
// Change the Hero Carousel Width accordding to the number of slide 
function updateHeroCaroWidth() {
  const heroContainer = document.querySelector('.hero__container');
  const heroIndexUl = document.querySelector('.index-slide-ul');

  const containerSlideNum = heroContainer.childElementCount;
  let indexLi = '';

  heroContainer.style.width = `calc(100vw * ${containerSlideNum})`;

  // for each slide, add a pagination dot
  for (let i = 0; i < containerSlideNum; i++) {
    indexLi += `
      <li class="index-slide-li">
        <button class="index-slide-pagination index-btn">
          <span class="pagination-dot" aria-label="hidden"></span>
        </button>
      </li>`;
  }

  heroIndexUl.innerHTML = indexLi;
  updateIndexPagination();

  function updateIndexPagination() {
    const paginations = heroIndexUl.querySelectorAll('.pagination-dot');
    paginations.forEach(pagination => {
      pagination.classList.remove('selected');
    });

    // Assuming the first dot should be selected initially
    if (paginations.length > 0) {
      paginations[0].classList.add('selected');
    }
  }
}

// Initilisation scroll hidden Navigation ================================================================================================================
function initNavHideOnScroll() {
  const navigationBar = document.querySelector('.header__sub');
  const navBarFlex = document.querySelector('.header__nav');

  if (!navigationBar || !navBarFlex) {
    console.error('Navigation elements not found.');
    return;
  }

  document.addEventListener('scroll', () => {
    if (document.body.scrollTop > 80 || document.documentElement.scrollTop > 80) {
      navigationBar.classList.add('closed');
      navBarFlex.classList.add('disable');
    } else {
      navigationBar.classList.remove('closed');
      navBarFlex.classList.remove('disable');
    }
  });
}
