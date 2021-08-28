/*
Theme Name: Asa
Description: Responsive Coming Soon Template
Author: Erilisdesign
Theme URI: https://preview.erilisdesign.com/html/asa/
Author URI: https://themeforest.net/user/erilisdesign
Version: 3.0.1
License: https://themeforest.net/licenses/standard
*/

/*------------------------------------------------------
[Table of contents]

1. Preloader
2. Website slider
3. Navigation
4. Backgrounds
5. Lightbox
6. Countdown
7. Subscribe Form
8. Contact Form
9. Bootstrap
10. Typed text
11. Slider
------------------------------------------------------*/

(function($){
  "use strict";

  // Vars
  var $html = $('html'),
    $body = $('body'),
    $siteNavbar = $('.site-navbar'),
    $siteNavbarCollapse = $('.site-navbar #navbarCollapse'),
    $siteNavbarToggler = $('.site-navbar .navbar-toggler-alternative'),
    slideAnimaionRun = false,
    $websiteSliderInner = $('.website-slider-inner'),
    $websiteSliderItem = $('.website-slider-item');

  function getWindowWidth(){
    return Math.max($(window).width(), window.innerWidth);
  }

  function getWindowHeight(){
    return Math.max($(window).height(), window.innerHeight );
  }

  function getDocumentWidth(){
    return Math.max($(document).width(), document.body.clientWidth);
  }

  function getScrollbarWidth(){
    var scrollDiv = document.createElement('div');
    scrollDiv.className = 'modal-scrollbar-measure';
    document.body.appendChild(scrollDiv);
    var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
    return scrollbarWidth;
  }

  function setOverflowScroll(){
    var html = document.documentElement;
    var body = document.body;
    var measureDiv = document.createElement('div');
    measureDiv.className = 'body-overflow-measure';
    body.appendChild(measureDiv);
    if ( ( window.getComputedStyle(html).overflowY !== 'visible' && window.getComputedStyle(html).overflowY !== 'hidden' ) && html.scrollHeight > html.clientHeight ){
      html.style.overflowY = 'scroll';
    } else if ( ( window.getComputedStyle(body).overflowY !== 'visible' && window.getComputedStyle(body).overflowY !== 'hidden' ) && body.scrollHeight > body.clientHeight ){
      body.style.overflowY = 'scroll';
    }
    body.removeChild(measureDiv);
  }
  setOverflowScroll();

  // [1. Loader]
  window.addEventListener( 'load', function(){
    document.querySelector('body').classList.add('loaded');
  });

  // [2. Website slider]
  function websiteSlider_layout(){
    if( !$websiteSliderItem.length > 0 )
      return;

    var websiteSliderItemLength = $websiteSliderItem.length,
      websiteSliderItemsWidth = websiteSliderItemLength * getDocumentWidth();

    $websiteSliderItem.css( 'width', getDocumentWidth() );
    $websiteSliderInner.css( 'width', websiteSliderItemsWidth );

    $websiteSliderItem.each(function(){
      var height = $(this).find('.website-slider-item-inner').innerHeight();

      $(this).css( 'height', height );
    });
  }

  function websiteSlider_resize(){
    if( !$websiteSliderItem.length > 0 )
      return;

    if( slideAnimaionRun )
      return;

    var $currentSlide = $('.website-slider-item.active').length > 0 ? $('.website-slider-item.active') : $websiteSliderItem.first(),
      position = $currentSlide.length > 0 ? $currentSlide.index() : 0,
      move = position * getDocumentWidth(),
	  currentSlide_height = parseInt( $currentSlide.find('.website-slider-item-inner').innerHeight(), 10 ),
      websiteSliderInner_height = currentSlide_height;
    if ( position > 0 ){
      move = move * -1;
    }

    $websiteSliderInner.css({
      'height': websiteSliderInner_height,
      'transform': 'translate3d('+move+'px, 0px, 0px)'
    });
  }

  function websiteSlider_showSlide(target){
    if( !$(target).length > 0 && !$(target).hasClass('website-slider-item') )
      return;

    if( slideAnimaionRun )
      return;

    if ( $(target).hasClass('active') )
      return;

    slideAnimaionRun = true;

    var position = $(target).index(),
      move = position * getDocumentWidth(),
      target_height = parseInt( $(target).find('.website-slider-item-inner').innerHeight(), 10 ),
      websiteSliderInner_height = target_height,
      $lastSlide = $('.website-slider-item.active');
    if ( position > 0 ){
      move = move * -1;
    }

    if( $(window).scrollTop() === 0 ){
      $websiteSliderItem.removeClass('last active');
      $lastSlide.addClass('last');
      $('.site-navbar li a').removeClass('active');
      $('.site-navbar a[href="'+target+'"]').addClass('active');

      setTimeout(function(){
        $websiteSliderInner.css({
          'height': websiteSliderInner_height,
          'transform': 'translate3d('+move+'px, 0px, 0px)'
        });

        $(target).addClass('active');
      }, 400);

      setTimeout(function(){
        slideAnimaionRun = false;
      }, 800);
    } else {
      smoothScroll(0);

      setTimeout(function(){
        $websiteSliderItem.removeClass('last active');
        $lastSlide.addClass('last');
        $('.site-navbar li a').removeClass('active');
        $('.site-navbar a[href="'+target+'"]').addClass('active');

        setTimeout(function(){
          $websiteSliderInner.css({
            'height': websiteSliderInner_height,
            'transform': 'translate3d('+move+'px, 0px, 0px)'
          });

          $(target).addClass('active');
        }, 400);

        setTimeout(function(){
          slideAnimaionRun = false;
        }, 800);
      }, 800);
    }
  }

  function websiteSlider_showFirstSlide(){
    if( !$websiteSliderItem.length > 0 )
      return;

    var windowHash = window.location.hash ? window.location.hash : '',
      loadSlide;

    if( windowHash !== '#' && windowHash !== '#!' && $(windowHash).length > 0 && $(windowHash).hasClass('website-slider-item') ){
      loadSlide = windowHash;
    } else {
      loadSlide = '#' + $websiteSliderItem.first().attr('id');
    }

    websiteSlider_showSlide(loadSlide);
  }

  // [3. Navigation]
  function asa_navigation(){

    // Clickable Links
    $(document).on( 'click', 'a.scrollto, .site-navbar a[href^="#"]', function(e){
      var target;

      // Make sure this.hash has a value before overriding default behavior
      if ( this.hash !== '' && this.hash !== '#!' && $( this.hash ).length > 0 ){
        target = this.hash;
      } else {
        return false;
      }

      if( target !== '' ){
        // Prevent default anchor click behavior
        e.preventDefault();

        if( $( target ).length > 0 && $( target ).hasClass('website-slider-item') ){
          websiteSlider_showSlide(target);

          $(this).blur();
        } else {
          var targetPosition = parseInt( Math.max( document.querySelector(target).offsetTop, $(target).offset().top ), 10 );

          smoothScroll(targetPosition);
          $(this).blur();
        }
      }

      return false;
    });

    // Arrow keys support - left/right
    document.addEventListener( 'keydown', function(e){
      if( !$websiteSliderItem.length > 0 )
        return;

      if ($('input,select,textarea').is(':focus')){
        return;
      }

      if( ( !e.keyCode == 37 || !e.keyCode == 39 ) && e.repeat )
        return;

      var currentPart = $('.website-slider-item.active'),
        target;
      if( currentPart.length === 0 ){
        currentPart = $('.website-slider-item').first();
      }

      if( e.keyCode == 37 && !e.repeat ){ // prev
        target = currentPart.prev().attr('id');
      } else if( e.keyCode == 39 && !e.repeat ){ // next
        target = currentPart.next().attr('id');
      }

      if( target ){
        websiteSlider_showSlide( '#'+ target );
      }
    });

	// Close nav on click outside of '.sitenav-collapse-inner'
    $(document).on( 'click touchstart', function(e){
      if ( $siteNavbar.is(e.target) || $(e.target).closest('.site-navbar').hasClass('site-navbar') || $(e.target).hasClass('navbar-toggler') || $(e.target).hasClass('navbar-toggler-alternative') ){
        return;
      }

      if ( $siteNavbarToggler.attr('aria-expanded') === 'true' ){
        $siteNavbarToggler.trigger('click');
      }
    });

  }

  function smoothScroll(targetPosition){
    $(window).scrollTo(targetPosition,800);
  }

  // [4. Backgrounds]
  function asa_backgrounds(){

    // Image
    var $bgImage = $('.bg-image-holder');
    if($bgImage.length){
      $bgImage.each(function(){
        var $self = $(this);
        var src = $self.children('img').attr('src');

        $self.css('background-image','url('+src+')').children('img').hide();
      });
    }

    // Video Background
    if ( $body.hasClass('mobile') ){
      $('.video-wrapper').css('display','none');
    }

  }

  function asa_granim(){
    if ( $('[data-gradient-bg]').length > 0 ){
      if (typeof Granim == 'undefined' && typeof Granim !== 'function'){
        console.log('Granim: Granim not defined.');
        return true;
      }

      $('[data-gradient-bg]').each(function(index,element){
        var granimParent = $(this),
          granimID = 'granim-'+index+'',
          colours = granimParent.attr('data-gradient-bg'),
          colours = colours.replace(' ',''),
          colours = colours.replace(/'/g, '"')
          colours = JSON.parse( colours );

        // Add canvas
        granimParent.prepend('<canvas id="'+granimID+'"></canvas>');

        var granimInstance = new Granim({
          element: '#'+granimID,
          name: 'basic-gradient',
          direction: 'left-right', // 'diagonal', 'top-bottom', 'radial'
          opacity: [1, 1],
          isPausedWhenNotInView: true,
          states : {
            "default-state": {
              gradients: colours
            }
          }
        });
      });
    }
  }

  // [5. Lightbox]
  function asa_lightbox(){
    if(!$().featherlight){
      console.log('Featherlight: featherlight not defined.');
      return true;
    }

    $.extend($.featherlight.defaults, {
      closeIcon: '<i class="fas fa-times"></i>'
    });

    $.extend($.featherlightGallery.defaults, {
      previousIcon: '<i class="fas fa-chevron-left"></i>',
      nextIcon: '<i class="fas fa-chevron-right"></i>'
    });

    $.featherlight.prototype.afterOpen = function(){
      $body.addClass('featherlight-open');
    };

    $.featherlight.prototype.afterContent = function(){
      var title = this.$currentTarget.attr('data-title');
      var text = this.$currentTarget.attr('data-text');

      if( !title && !text )
        return;

      this.$instance.find('.caption').remove();

      var title = title ? '<h4 class="title-gallery">' + title + '</h4>' : '',
        text = text ? '<p class="text-gallery">' + text + '</p>' : '';

      $('<div class="caption">').html( title + text ).appendTo(this.$instance.find('.featherlight-content'));
    };

    $.featherlight.prototype.afterClose = function(){
      $body.removeClass('featherlight-open');
    };
  }

  // [6. Countdown]
  function asa_countdown(){
    var countdown = $('.countdown[data-countdown]');

    if (countdown.length > 0){
      countdown.each(function(){
        var $countdown = $(this),
          finalDate = $countdown.data('countdown');
        $countdown.countdown(finalDate, function(event){
          $countdown.html(event.strftime(
            '<div class="countdown-container row"> <div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%-D</div><span class="title">Day%!d</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%H</div><span class="title">Hours</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%M</div><span class="title">Minutes</span></div></div><div class="col-6 col-sm-auto"><div class="countdown-item"><div class="number">%S</div><span class="title">Seconds</span></div></div></div>'
          ));
        });
      });
    }
  }

  // [7. Subscribe Form]
  function asa_subscribeForm(){
    var $subscribeForm = $('.subscribe-form');

    if ( $subscribeForm.length > 0 ){
      $subscribeForm.each( function(){
        var el = $(this),
          elResult = el.find('.subscribe-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              resetForm: true,
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [8. Contact Form]
  function asa_contactForm(){
    var $contactForm = $('.contact-form');

    if ( $contactForm.length > 0 ){
      $contactForm.each( function(){
        var el = $(this),
          elResult = el.find('.contact-form-result');

        el.find('form').validate({
          submitHandler: function(form) {
            elResult.fadeOut( 500 );

            $(form).ajaxSubmit({
              target: elResult,
              dataType: 'json',
              success: function( data ) {
                elResult.html( data.message ).fadeIn( 500 );
                if( data.alert != 'error' ) {
                  $(form).clearForm();
                  setTimeout(function(){
                    elResult.fadeOut( 500 );
                  }, 5000);
                };
              }
            });
          }
        });

      });
    }
  }

  // [9. Bootstrap]
  function asa_bootstrap(){

    // Botostrap Tootltips
    $('[data-toggle="tooltip"]').tooltip();

    // Bootstrap Popovers
    $('[data-toggle="popover"]').popover();

    // Modals
    $('.modal').on({
      'show.bs.modal': function(){
        document.documentElement.style.overflow = 'hidden';
        document.body.style.paddingRight = getScrollbarWidth() + 'px';
        $('.overlay-global').css( 'right', getScrollbarWidth() );
        if( getWindowWidth() >= 1200 ){
          $('.global-frame .top, .global-frame .bottom, .global-frame .right').css( 'right', getScrollbarWidth() );
          $('.site-navbar').css( 'right', getScrollbarWidth() );
          $('.site-footer .social-nav').css( 'right', getScrollbarWidth() );
        }
      },
      'hidden.bs.modal': function(){
        document.documentElement.style.overflow = '';
        setOverflowScroll();
        document.body.style.paddingRight = '';
        $('.overlay-global').css( 'right', '' );
        if( getWindowWidth() >= 1200 ){
          $('.global-frame .top, .global-frame .bottom, .global-frame .right').css( 'right', '' );
          $('.site-navbar').css( 'right', '' );
          $('.site-footer .social-nav').css( 'right', '' );
        }
      }
    });

  }

  // [10. Typed text]
  function asa_typedText(){
    var toggle = document.querySelectorAll('[data-toggle="typed"]');

    function init(el) {
      var elementOptions = el.dataset.options;
          elementOptions = elementOptions ? JSON.parse(elementOptions) : {};
      var defaultOptions = {
        typeSpeed: 40,
        backSpeed: 40,
        backDelay: 3000,
        loop: true
      }
      var options = Object.assign(defaultOptions, elementOptions);

      new Typed(el, options);
    }

    if (typeof Typed !== 'undefined' && toggle) {
      [].forEach.call(toggle, function(el) {
        init(el);
      });
    }

  }

  // [11. Slider]
  function asa_slider() {
    var $slider = $('.slider');

    if($slider.length > 0){

      if( !$slider.hasClass('slick-initialized') ){
        $slider.slick({
          slidesToShow: 1,
          infinite: true,
          nextArrow: '<button type="button" class="slick-next"><i class="fas fa-angle-right"></i></button>',
          prevArrow: '<button type="button" class="slick-prev"><i class="fas fa-angle-left"></i></button>'
        });
      }

      if( 1199 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-xl') ){
        $slider.slick('unslick');
      }

      if( 991 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-lg') ){
        $slider.slick('unslick');
      }

      if( 767 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-md') ){
        $slider.slick('unslick');
      }

      if( 575 >= getWindowWidth() && $slider.hasClass('slick-initialized') && $slider.hasClass('slick-destroy-sm') ){
        $slider.slick('unslick');
      }

    }
  }

  $(document).ready(function($){
    $(window).scrollTop(0);
    websiteSlider_layout();

    asa_navigation();
    asa_backgrounds();
    asa_granim();
    asa_lightbox();
    asa_countdown();
    asa_subscribeForm();
    asa_contactForm();
    asa_bootstrap();
    asa_typedText();
    asa_slider();
  });

  var clear_websiteSlider_layout;
  var clear_websiteSlider_resize;

  window.addEventListener( 'load', function(){
    websiteSlider_layout();
    websiteSlider_showFirstSlide();
  });

  $(window).on('resize', function(){
    asa_slider();

    clear_websiteSlider_layout = setTimeout( websiteSlider_layout(), 20 );
    clear_websiteSlider_resize = setTimeout( websiteSlider_resize(), 20 );
  });

})(jQuery);