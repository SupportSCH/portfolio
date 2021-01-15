var pwa = document.querySelector('#pwa');
var deferredPrompt;

pwa.addEventListener('click', function () {
  if (deferredPrompt) {
    deferredPrompt.prompt();

    deferredPrompt.userChoice.then(function (choice) {
      console.log(choice.outcome);
      if (choice.outcome === 'dismissed') {
        console.log('installation was cancelled by user');
        $('#pwaDiv').removeClass('hidden');
        $('#pwaDiv').toggleClass('pwa-download');
      } else {
        console.log('User added to home screen');
        $('#pwaDiv').removeClass('pwa-download');
        $('#pwaDiv').toggleClass('hidden');
      }
    });

    deferredPrompt = null;
  }
});

window.addEventListener('beforeinstallprompt', function (event) {
  console.log('beforeinstallprompt fired');
  event.preventDefault();
  deferredPrompt = event;
  if (deferredPrompt) {
    $('#pwaDiv').removeClass('hidden');
    $('#pwaDiv').toggleClass('pwa-download');
  }
  return false;
});

// if(navigator.serviceWorker) {
// OR
if ('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
    navigator.serviceWorker
      // .register('/sw.js', { scope: '/subFolders'})
      .register('/sw.js')
      .then(function (reg) {
        console.log('Service Worker Registered' + reg.scope);
      }).catch(function (error) {
        console.log('Error while egistering Servie Worker' + error);
      })
  })
}


if('serviceWorker' in navigator && 'SyncManager' in window) {
  navigator.serviceWorker.ready.then(function (sw) {
    return sw.sync.register('a-tag-name');
  }).then(function () {
    console.log('tag name has been registered');
  }).catch(function (e) {
    console.log('Error while registering tag');
  })
}

!(function ($) {
  "use strict";

  // Hero typed
  if ($('.typedAge').length) {
    var typed_strings = $(".typedAge").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typedAge', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 30,
      backDelay: 1000
    });
  }

  if ($('.typedSkills').length) {
    var typed_strings = $(".typedSkills").data('typed-items');
    typed_strings = typed_strings.split(',')
    new Typed('.typedSkills', {
      strings: typed_strings,
      loop: true,
      typeSpeed: 100,
      backSpeed: 30,
      backDelay: 1000
    });
  }

  // Smooth scroll for the navigation menu and links with .scrollto classes
  $(document).on('click', '.nav-menu a, .scrollto', function (e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      e.preventDefault();
      var target = $(this.hash);
      if (target.length) {

        var scrollto = target.offset().top;

        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');

        if ($(this).parents('.nav-menu, .mobile-nav').length) {
          $('.nav-menu .active, .mobile-nav .active').removeClass('active');
          $(this).closest('li').addClass('active');
        }

        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
        }
        return false;
      }
    }
  });

  // Activate smooth scroll on page load with hash links in the url
  $(document).ready(function () {
    if (window.location.hash) {
      var initial_nav = window.location.hash;
      if ($(initial_nav).length) {
        var scrollto = $(initial_nav).offset().top;
        $('html, body').animate({
          scrollTop: scrollto
        }, 1500, 'easeInOutExpo');
      }
    }
  });

  $(document).on('click', '.mobile-nav-toggle', function (e) {
    $('body').toggleClass('mobile-nav-active');
    $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
  });

  $(document).click(function (e) {
    var container = $(".mobile-nav-toggle");
    if (!container.is(e.target) && container.has(e.target).length === 0) {
      if ($('body').hasClass('mobile-nav-active')) {
        $('body').removeClass('mobile-nav-active');
        $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      }
    }
  });

  // Navigation active state on scroll
  var nav_sections = $('section');
  var main_nav = $('.nav-menu, .mobile-nav');

  $(window).on('scroll', function () {
    var cur_pos = $(this).scrollTop() + 200;

    nav_sections.each(function () {
      var top = $(this).offset().top,
        bottom = top + $(this).outerHeight();

      if (cur_pos >= top && cur_pos <= bottom) {
        if (cur_pos <= bottom) {
          main_nav.find('li').removeClass('active');
        }
        main_nav.find('a[href="#' + $(this).attr('id') + '"]').parent('li').addClass('active');
      }
      if (cur_pos < 300) {
        $(".nav-menu ul:first li:first").addClass('active');
      }
    });
  });

  // Back to top button
  $(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
      $('.back-to-top').fadeIn('slow');
    } else {
      $('.back-to-top').fadeOut('slow');
    }
  });

  $('.back-to-top').click(function () {
    $('html, body').animate({
      scrollTop: 0
    }, 1500, 'easeInOutExpo');
    return false;
  });

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function () {
    $('.progress .progress-bar').each(function () {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Porfolio isotope and filter
  $(window).on('load', function () {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function () {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
      aos_init();
    });

    // Initiate venobox (lightbox feature used in portofilo)
    $(document).ready(function () {
      $('.venobox').venobox();
    });
  });

  // Init AOS
  function aos_init() {
    AOS.init({
      duration: 1000,
      easing: "ease-in-out-back",
      once: true
    });
  }
  $(window).on('load', function () {
    aos_init();
  });

})(jQuery);

$(document).ready(function () {
  $('[data-toggle="tooltip"]').tooltip();
});


// removes all console.log
// console.log = function () { }