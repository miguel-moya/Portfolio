// ===========================================================
// Portfolio
// Javascript v1.0
// ===========================================================

// Global Variables
var resizeId;
var classes = ["paso", "ensayo"];

//// Function - Resize Home
function resizeHome() {
	var windowHeight = parseInt($(window).height());
	$('#home').css('height', windowHeight + 'px');
}

//// Function - Sticky Header
function stickyHeader() {
	var windowHeight = parseInt($(window).height());
	var headerHeight = parseFloat($('#header-site').outerHeight(true));
	var stickyHeight = windowHeight - headerHeight - 1;

	if ($(this).scrollTop() > stickyHeight){  
    	$('#header-site').addClass("sticky");
    	$('#navigation-site').addClass("sticky");
  	}
  	else{
    	$('#header-site').removeClass("sticky");
    	$('#navigation-site').removeClass("sticky");
  	}
}

//// Function - Random Home Class
function randomHomeClass() {				
	$('#home').addClass(classes[~~(Math.random()*classes.length)]);
}

//// Funcion - scroll To Content
//function scrollToContent(aid) {
//	$('html,body').animate({ scrollTop: $(aid).offset().top }, 'slow');
//}

// On Document Ready
$(document).ready(function(){
	resizeHome();
	randomHomeClass();        		
});

// On Window Resize is Complete
function doneResizing(){
    resizeHome();
}

// On Window Resize
$(window).resize(function() {
    clearTimeout(resizeId);
    resizeId = setTimeout(doneResizing, 500);
});

// On Window Scroll
$(window).scroll(function() {
	stickyHeader();
});

// On click Navigation fire Scroll to Content
//$("#header-site a").click(function (e) {
//	e.preventDefault();
//	var sectionID = $(this).attr('href');
//	scrollToContent(sectionID);				
//});

var sections = $('.section-site');
var nav = $('#navigation-site');
var header = $('#header-site');
var nav_height = 50;

$(window).on('scroll', function () {
  var cur_pos = $(this).scrollTop();
  
  sections.each(function() {
    var top = $(this).offset().top - nav_height,
        bottom = top + $(this).outerHeight();
    
    if (cur_pos >= top && cur_pos <= bottom) {
      nav.find('a').removeClass('active');
      sections.removeClass('active');
      
      $(this).addClass('active');
      nav.find('a[href="#'+$(this).attr('id')+'"]').addClass('active');
    }
  });
});

header.find('a').on('click', function () {
  var $el = $(this);
  var id = $el.attr('href');
  
  $('html, body').animate({
    scrollTop: $(id).offset().top - nav_height
  }, 500);
  
  return false;
});

