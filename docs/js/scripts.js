/*!
* Start Bootstrap - Scrolling Nav v5.0.5 (https://startbootstrap.com/template/scrolling-nav)
* Copyright 2013-2022 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-scrolling-nav/blob/master/LICENSE)
*/
//
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Activate Bootstrap scrollspy on the main nav element
    const mainNav = document.body.querySelector('#mainNav');
    if (mainNav) {
        new bootstrap.ScrollSpy(document.body, {
            target: '#mainNav',
            offset: 74,
        });
    };

    // Collapse responsive navbar when toggler is visible
    const navbarToggler = document.body.querySelector('.navbar-toggler');
    const responsiveNavItems = [].slice.call(
        document.querySelectorAll('#navbarResponsive .nav-link')
    );
    responsiveNavItems.map(function (responsiveNavItem) {
        responsiveNavItem.addEventListener('click', () => {
            if (window.getComputedStyle(navbarToggler).display !== 'none') {
                navbarToggler.click();
            }
        });
    });
});

// Set aria-current=page
window.addEventListener('load', function () {
  const links = document.querySelectorAll('#mainNav a, nav.second-level a');
  const href = window.location.href;

  for (let i = 0; i < links.length; i += 1) {
    if (href.includes(links[i].href)) {
      links[i].setAttribute('aria-current', 'page');
    }
  }
});


// Set figure widths
window.addEventListener('load', function () {
  const figures = Array.from(document.querySelectorAll('figure.image'));

  figures.forEach( (fig) => {
    const imgElem = fig.querySelector('img');
    if (imgElem) {
        const width = imgElem.getBoundingClientRect().width;
        fig.style.width = width + 'px';
    }
  });

});
