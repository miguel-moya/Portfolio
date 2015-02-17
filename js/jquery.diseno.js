$(document).ready(function () {

    //Images outside of viewport (visible part of web page) wont be loaded before user scrolls to them
    if ($('img.lazy').length > 0) {
        $("img.lazy").show().lazyload({
            skip_invisible: true,
            threshold: 200,
            effect: "fadeIn"
        });


        $('.carousel').on('slide.bs.carousel', function (e) {

            //SCROLLING LEFT
            var prevItem = $('.active.item', this).prev('.item');

            //Account for looping to LAST image
            if (!prevItem.length) {
                prevItem = $('.active.item', this).siblings(":last");
            }

            //Get image selector
            prevImage = prevItem.find('img');

            //Remove class to not load again - probably unnecessary
            $(prevImage).each(function (i, val) {
                if ($(this).hasClass('lazy')) {
                    $(this).removeClass('lazy');
                    $(this).attr('src', $(this).data('original'));
                }
            });

            //SCROLLING RIGHT
            var nextItem = $('.active.item', this).next('.item');

            //Account for looping to FIRST image
            if (!nextItem.length) {
                nextItem = $('.active.item', this).siblings(":first");
            }

            //Get image selector
            nextImage = nextItem.find('img');

            //Remove class to not load again - probably unnecessary
            $(nextImage).each(function (x, val) {
                //Remove class to not load again - probably unnecessary
                if ($(this).hasClass('lazy')) {
                    $(this).removeClass('lazy');
                    $(this).attr('src', $(this).data('original'));
                }
            });

        });

    }

    // Funci�n para pintar las puntas de las flechas autom�ticamente
    $('.flecha > span').after('<span class="punta"></span>');

    //Cuando se abre un modal con pesta�as se deben reconfigurar las pesta�as
    $(".modal.menuPestanyas").on('show', function (event) {
        window.setTimeout(function () {
            pintadoPestanyas();
        }, 0500);
    });

    //En funci�n de la resoluci�n no caben los enlaces en las pesta�as en las cajas...
    pintadoPestanyas();

    if ($('ul.ajustaTabs > li').length > 0) {
        ajustaTabs();
    }

    //Comportamiento del bot�n verde del men� MasterTab
    configMenuPrincipal();

    if ($('ul.mismaAltura > li').length > 0) {
        //mismaAltura($('ul.mismaAltura li'));
        mismaAltura($('ul.mismaAltura li a'));
    }

    //Al hacer click sobre un LI de un UL de tipo caja pesta�as se marca la elegida
    $('ul.nav-tabs').delegate('li a', 'click', function (e) {
        pestanyaClick($(this), e);
    });
    //Al hacer click sobre un LI de un UL de tipo caja pesta�as se marca la elegida (con el men� versi�n m�vil)
    $('.snap-content').delegate('ul.nav-tabs li a', 'click', function (e) {
        pestanyaClick($(this), e);
    });


    /* A�ade color de fondo a los TD de las tablas con class 'table-hover2' al hacer 'hover' */
    $('table.table-hover2, table.table-hover2 td').hover(function () {
        $('table.table-hover2 td').css('background-color', '');
    });
    $('table.table-hover2 td:odd').hover(function () {
        $(this).prev().data('bgcolor', $(this).siblings().css('background-color')).css('background-color', $(this).css('background-color'));
    });
    $('table.table-hover2 td:odd a, table.table-hover2 td:odd .markerToolTip').hover(function () {
        $(this).parent().prev().css('background-color', $(this).parent().css('background-color'));
    });


    //Men� din�mico (cambio de t�tulo y de carouseles)
    $('.dinamicMenu .enlaceRotulo > a[data-carouselid]').click(function (e) {
        var tit = $(this).closest('.dinamicMenu').find("[data-title='titCarousel']");
        var textTit = tit.text();
        var newTextTit = $(this).text();

        //cambio el texto del r�tulo por el seleccionado
        $(tit).text(newTextTit);

        //activo la pesta�a seleccionada
        $(this).siblings('a.active').removeClass('active invisible');
        $(this).addClass('active invisible');

        var carouselID = $(this).data('carouselid');

        //Ocultamos el carousel activo
        $(this).closest('.dinamicMenu').find('.carousel.active').removeClass('active').addClass('invisible');

        //Para mostrar el nuevo seleccionado
        $(this).closest('.dinamicMenu').find(carouselID).removeClass('invisible').addClass('active');

        //Visualizar las im�genes del carousel que estaba oculto
        $("img.lazy").lazyload();
    });
    

    //Al hacer resize llamamos a la siguiente funci�n
    cbList.add(resizeConfigDiseno);
});

function resizeConfigDiseno() {
    if ($('ul.ajustaTabs > li').length > 0) {
        ajustaTabs();
    }

    configMenuPrincipal();

    if ($('ul.mismaAltura > li').length > 0) {
        $('ul.mismaAltura li, ul.mismaAltura li a').css('min-height', '0');
        //mismaAltura($('ul.mismaAltura li'));
        mismaAltura($('ul.mismaAltura li a'));
    }
}


// *************** Funciones Pesta�as ************** //

function pestanyaClick(obj, e) {
    //Evitamos que al pulsar sobre el enlace la pantalla se vaya a la cabecera
    if (e) {
        e.preventDefault();
    }
    //Marcamos por CSS la pesta�a seleccionada excluyendo el LI dropdown en si mismo
    if (!$(obj).parent().hasClass('dropdown')) {
        $(obj).parent().parent().find('li.active').removeClass('active');
        $(obj).parent().addClass('active');
    }
    //Se comprueba si dentro de ese UL hay un LI del tipo dropdown,
    //si lo hay, se debe mover la elegida al primer lugar
    pestanyaElegida($(obj));
}

function pestanyaElegida(obj) {

    //Evitamos cambiar LI's si no hay dropdown
    if (!$(obj).hasClass('dropdown-toggle') && $(obj).parents('ul.nav-tabs').find('.dropdown').length > 0) {

        var ulPadre = $(obj).parents('ul.nav-tabs');
        var liElegido = $(obj).parent();

        //Desmarcamos las pesta�as activas del UL
        $(liElegido).parents('ul.nav-tabs').find('li.active').removeClass('active');

        //Se comprueba que el LI elegido est� dentro del dropdown
        if ($(liElegido).hasClass('dropdownTab')) {

            //Aparte del los posibles LI con class dropdown y fixedTab, deben haber
            //otros LI para moverlos fuera del dropdown sino se deben quedar dentro de �l
            if (ulPadre.children('li').not('.dropdown, .fixedTab').length > 0) {
                //Sacamos el LI perteneciente al dropdown
                $(liElegido).removeClass('dropdownTab').detach();

                //Marcamos por CSS la pesta�a seleccionada excluyendo el LI dropdown en si mismo
                $(liElegido).addClass('active');

                //El LI con class 'fixedTab' debe ir siempre en primer lugar
                if ($(ulPadre).find('li.fixedTab').length == 0) {
                    $(liElegido).prependTo($(ulPadre));
                } else {
                    $(liElegido).insertAfter($(ulPadre).find('li.fixedTab'));
                }

                //Reorganizamos el listado de Tabs se reconfigure en caso de que haya LI's que sean
                //solamente el dropdown o el activo
                if ($(obj).parents('ul.nav-tabs').find('> li').not('.dropdown, .active').length > 0) {
                    pintadoPestanyas();
                }
            }
        }
    }
    //Marcamos por CSS la pesta�a seleccionada en caso de ser un LI 'fixedTab'
    $(liElegido).addClass('active');
}

function pintadoPestanyas() {

    //Recorremos los UL que no tengan la class fixedTabs, que nos servir� para indicar que no queremos que se creen pesta�as
    $('ul.nav-tabs').not('.fixedTabs, .ajustaTabs').each(function (i, e) {

        //Por defecto la pesta�a desplegable tendr� el siguiente ancho + margen (.tabsPeque)
        var anchoTabDW = 42;
        if ($(e).hasClass('tabsMedio')) {
            anchoTabDW = 45;
        } else if ($(e).hasClass('tabsGrande')) {
            anchoTabDW = 52;
        }
        
        //Si acabamos de entrar o se hace la ventana m�s peque�a y adem�s el UL es visible
        if ((opNavTab == 0 || opNavTab == 2) && $(e).is(':visible')) {

            //Variable que suma el ancho de los LI
            var totalWidthLi = 0;

            //Recorremos todos los LI menos los que tienen la class 'dropdown' que es el desplegable
            $($(e).children('li').not('li.dropdown')).each(function (x, li) {

                //Se obtiene el ancho del actual LI
                totalWidthLi = totalWidthLi + parseInt($(this).outerWidth(true));

                //Si hemos excedido con este LI el ancho del UL (a�adiendo tama�o del bot�n dropdown)
                if ((totalWidthLi + anchoTabDW) >= $(e).outerWidth(true)) {
                    //A�adimos la class dropdownTab, incluyendo el LI anterior para
                    //poder colocar un LI desplegable que contendr� todos los que tengan esta class
                    if (!$(this).hasClass('dropdownTab')) {
                        $(this).addClass('dropdownTab');
                    }
                }
            });

            //Si acabamos de entrar en la p�gina o no hay LI dentro del 'dropdown'
            //o el UL todav�a no tiene width (soluci�n al pasar a menos de 768px)
            if (opNavTab == 2 || $(e).find('li.dropdownTab').length > 0) {

                //Creamos el UL donde insertaremos los LI que exceden el tama�o del UL
                if ($(e).find('li.dropdown').length == 0 && $(e).find('li.dropdownTab').length > 0) {
                    $(e).append('<li class="dropdown"><a href="#" data-toggle="dropdown" class="dropdown-toggle"><i class="icon-caret-down"></i></a><ul class="dropdown-menu right"></ul></li>');
                }

                //A�adimos los LI sobrantes dentro del UL class 'dropdown-menu'
                $(e).find('li.dropdownTab').detach().appendTo($(e).find('ul.dropdown-menu'));

            } else {

                //A�adimos los LI sobrantes dentro del UL padre
                $(e).find('li.dropdownTab').removeClass('dropdownTab').detach().appendTo($(e));

                //Borramos el dropdown en caso de que no tenga LI dentro de �l
                if ($(e).find('li.dropdownTab').length == 0) {
                    $(e).find('li.dropdown').detach();
                }
            }

        } else if (opNavTab == 1 && $(e).outerWidth(true) > 0) {
            //Al ampliar la resoluci�n se debe comprobar si los LI dentro del dropdown se pueden volver a insertar en el UL padre

            var totalWidthLi = 0;
            var totalWidthLiDw = 0;

            //Recorremos todos los LI menos los que tienen la class 'dropdown' que es el desplegable
            $($(e).children('li').not('li.dropdown')).each(function (x, li) {

                //Se obtiene el ancho del actual LI
                totalWidthLi = totalWidthLi + parseInt($(this).outerWidth(true));

                //Si hemos excedido con este LI el ancho del UL (a�adiendo tama�o del bot�n dropdown)
                if ((totalWidthLi + anchoTabDW) >= $(e).outerWidth(true)) {

                    //A�adimos la class dropdownTab, incluyendo el LI anterior para
                    //poder colocar un LI desplegable que contendr� todos los que tengan esta class
                    if (!$(this).hasClass('dropdownTab')) {
                        $(this).addClass('dropdownTab');
                    }
                }
            });

            if ($(e).find('li.dropdown').length == 0 && $(e).find('li.dropdownTab').length > 0) {
                $(e).append('<li class="dropdown"><a href="#" data-toggle="dropdown" class="dropdown-toggle"><i class="icon-caret-down"></i></a><ul class="dropdown-menu right"></ul></li>');
            }

            //A�adimos los LI sobrantes dentro del UL class 'dropdown-menu'
            $(e).find('li.dropdownTab').detach().appendTo($(e).find('ul.dropdown-menu'));

            //Comprobamos que el LI con class 'dropdown' exista
            if ($(e).find('li.dropdown').length > 0) {

                //Guardamos el ancho de todos los LI (padre)
                $($(e).children('li').not('li.dropdown')).each(function (x, li) {
                    //Se obtiene el ancho del actual LI
                    totalWidthLi = totalWidthLi + parseInt($(li).outerWidth(true));
                });

                //Abrimos el dropdown para poder medir los LI
                $(e).find('li.dropdown').addClass('open');

                ////Recorremos todos los LI con la class 'dropdown' que es el desplegable para obtener el ancho total
                $($(e).find('li.dropdownTab')).each(function (x, liDw) {

                    //Se modifica el display para que no obtenga el tama�o del LI m�s grande del listado dropdown
                    $(this).css('display', 'table');

                    totalWidthLiDw = totalWidthLiDw + parseInt($(this).outerWidth(true));
                    totalWidthLi = 0;

                    //Se vuelve a conceder los estilos originales al LI
                    $(this).css('display', 'block');

                    $($(e).children('li').not('li.dropdown')).each(function (x, li) {
                        //Se obtiene el ancho de todos los LI fuera del dropdown
                        totalWidthLi = totalWidthLi + parseInt($(li).outerWidth(true));
                    });

                    //Comprobamos para cada LI dentro del desplegable a ver si cabe fuera de �l
                    if (parseInt(totalWidthLi + anchoTabDW + $(this).outerWidth(true)) < parseInt($(e).outerWidth(true))) {

                        //Movemos el LI del desplegable fuera
                        $(this).removeClass('dropdownTab').detach().appendTo($(e));

                        //Colocamos el LI dropdown al final de la lista
                        $(e).find('li.dropdown').detach().appendTo($(this).parents('ul.nav-tabs'));
                    }
                });

                //Cerramos el dropdown
                $(e).find('li.dropdown').removeClass('open');

                //Si no hay elementos en el menu dropdown eliminamos el LI desplegable
                if ($(e).find('ul.dropdown-menu > li').length == 0) {
                    $(e).find('li.dropdown').detach();
                }
            }
        }
    });

    //Al arrancar la web sacamos los LI con class 'active' del dropdown a primera posici�n
    for (var i = 0; i <= $('li.dropdown li.active').length - 1; i++) {
        pestanyaElegida($('li.dropdown li.active a')[i]);
    }
}

function closeMasterTabDefault() {
    $('.navegacion').find('.masterTab.fixedTab').removeClass('open fixedTab');
}

// Ajusta las Pesta�as al 100% del UL
function configMenuPrincipal() {
    if ($('ul.navPrincipal > li').length > 0) {
        var uls = $('ul.navPrincipal');

        uls.each(function () {
            //Si son los LI de la cabecera del men� de Logi
            if ($(this).parent().parent().hasClass('navegacion')) {
                //Si la pesta�a esta dentro del men�
                if (parseFloat($(this).css('padding-left').replace('px', '')) == 0) {
                    if ($(this).find('.masterTab').hasClass('fixedTabTabletNone')) {
                        $(this).find('.masterTab').addClass('open fixedTab').removeClass('fixedTabTabletNone');
                    } else {
                        if ($(this).find('.masterTab.fixedTab').length > 0) {
                            $(this).find('.masterTab.fixedTab').addClass('open');
                        }
                    }
                } else {
                    //Si est� fuera en resoluci�n grande
                    if ($(this).find('.masterTab').hasClass('fixedTab')) {
                        $(this).find('.masterTab').removeClass('open fixedTab').addClass('fixedTabTabletNone');
                    } else {
                        $(this).find('.masterTab').removeClass('open');
                    }
                }

            }
        });
    }
}

// Ajusta las Pesta�as al 100% del UL
function ajustaTabs() {
    if ($('ul.ajustaTabs > li').length > 0) {
        var uls = $('ul.ajustaTabs');

        uls.each(function () {
            //Si son los LI de cajas
            $(this).children().next().css('border-left', '1px dotted #64AFDC');
            var widthLIpx = parseFloat(parseFloat($(this).outerWidth(true) - parseFloat($(this).children().length - 1)) / $(this).children().length);
            var widthLItpc = parseFloat(parseFloat(widthLIpx * 100) / $(this).outerWidth(true));
            $(this).children().css('width', widthLItpc + '%').css('margin', 0);
            mismaAltura($(this).children().find('a'));
        });
    }
}


// *************** Funci�n Igualar altura ************** //

function mismaAltura(grupo) {
    masAlto = 0;

    //Reset de la altura m�nima
    grupo.css({ "min-height": 'inherit' });

    grupo.each(function () {
        elementoAltura = $(this).height();
        if(elementoAltura > masAlto) {
            masAlto = elementoAltura;
        }
    });
    //Se aplica la nueva altura
    grupo.css({"min-height": masAlto});	
}

function mismoAncho(grupo) {
    masLargo = 0;

    //Reset del ancho m�nimo
    grupo.css({ "min-width": 'inherit' });

    grupo.each(function () {
        elementoAncho = $(this).width();
        if (elementoAncho > masLargo) {
            masLargo = elementoAncho;
        }
    });
    //Se aplica el nuevo ancho
    grupo.css({ "min-width": masLargo });
}


// *************** Se comprueba si un elemento est� dentro de otro con class 'desactivado' ************** //
function compruebaEstado(event, obj) {
    if ($(obj).parents('.desactivado').length > 0) {
        event.preventDefault();
        return false;
    }
}

// *************** A�adir clase ultimo elemento ************** //
function ultimo(elemento, clase) {
    $(elemento+":last-child").addClass(clase);
};


// *************** A�adir clase primer elemento ************** //
function primero(elemento, clase) {
    $(elemento+":first-child").addClass(clase);
};

// *************** Pinta clase para los elementos pares ************** //
function pintarpares(elemento, clase) {
    $(elemento+":nth-child(2n+1)").addClass(clase);
};

// *************** Pinta clase para los elementos Impares ************** //
function pintarimpares(elemento, clase) {
    $(elemento+":nth-child(2n)").addClass(clase);
};