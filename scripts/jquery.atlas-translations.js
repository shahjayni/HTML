(function(d, w, jQuery) {

    var loc = document.location.toString(),
        hash = window.location.hash,
        userAgent = (navigator.userAgent || navigator.vendor || window.opera),
        // http://detectmobilebrowser.com
        isMobile = /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(userAgent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(userAgent.substr(0, 4)),
        isMac = navigator.platform.toUpperCase().indexOf('MAC') !== -1,
        browser = {},
        // Window
        win = $(w),
        winLoaded = false,
        // Elements
        htmlElem = $('html'),
        bodyElem = $('body'),
        siteContainer = $('.st-cont'),
        siteHeader = $('.st-hd'),
        siteNavigation = $('.st-nav'),
        siteFooter = $('.st-ft'),
        pageMain = $('#main'),
        siteHeaderMaxHeight = parseFloat(siteHeader.css('max-height')),
        siteHeaderMinHeight = parseFloat(siteHeader.css('min-height')),
        // Scrolling
        winScrollTop = win.scrollTop(),
        winScrollTopPrev = 0,
        winScrollFuncs = [],
        winScrollingTimeout,
        winScrolling = false,
        winScrollStoppedAt = -1,
        siteHeaderPreventAdjust = false,
        // Modal
        isModalOpen = false,
        modalElem = bodyElem.children('.mdl-bkd'),
        modalAbort = false,
        modalIsClosing = false,
        // Ajax
        ajaxTimeout = 12000,
        // Debug
        debug = true,
        debugSetTimeout = 1000;


    function is_touch_device() {

        var prefixes = ' -webkit- -moz- -o- -ms- '.split(' ');
        var mq = function(query) {
            return window.matchMedia(query).matches;
        }

        if (('ontouchstart' in window) || window.DocumentTouch && document instanceof DocumentTouch) {
            return true;
        }

        // include the 'heartz' as a way to have a non matching MQ to help terminate the join
        // https://git.io/vznFH
        var query = ['(', prefixes.join('touch-enabled),('), 'heartz', ')'].join('');
        return mq(query);
    }


    var decodeEntities = (function() {

        // this prevents any overhead from creating the object each time
        var element = document.createElement('div');

        function decodeHTMLEntities(str) {

            if (str && typeof str === 'string') {
                // strip script/html tags
                str = str.replace(/<script[^>]*>([\S\s]*?)<\/script>/gmi, '');
                str = str.replace(/<\/?\w(?:[^"'>]|"[^"]*"|'[^']*')*>/gmi, '');
                element.innerHTML = str;
                str = element.textContent;
                element.textContent = '';
            }

            return str;
        }

        return decodeHTMLEntities;

    })();

    function randombetween(min, max) {

        return Math.floor(Math.random() * (max - min + 1) + min);
    }

    function generateRandomNumbers(max, thecount) {

        var r = [],
            currsum = 0;

        for (var i = 0; i < thecount - 1; i++) {

            r[i] = randombetween(1, max - (thecount - i - 1) - currsum);
            currsum += r[i];
        }

        r[thecount - 1] = max - currsum;
        return r;
    }

    function isExternalLink(elem) {

        if (!elem.hostname.length) {
            return false;
        }

        var elemHostname = (elem.hostname.substr(0, 4) == 'www.') ?
            elem.hostname.substr(5) :
            elem.hostname;

        var match = location.hostname.slice(-elemHostname.length) == elemHostname;

        return (!match && elem.protocol.substr(0, 4) == 'http');
    }


    function ga_track_event(elem, action, category, label, value, callback) {

        // gtag.js
        if (typeof gtag === 'function') {

            var eventParameters = {
                'event_category': category,
                'event_label': label,
                'event_value': value
            }

            if (typeof callback === 'function') {

                eventParameters['event_callback'] = callback;
            }

            gtag('event', action, eventParameters);

            console.log('track gtag', action, eventParameters);

            // ga.js
            // or Google Analytics Dashboard for WP (__gaTracker)
        } else if (typeof ga === 'function' || typeof __gaTracker === 'function') {

            // in my tests I was not able to make 'event_value' work as 6th variable
            // + GA universal (primarily with gtag.js support) didn't accept any params when 6th variable was available
            var args = [
                'send',
                'event',
                category,
                action,
                label
            ];

            var fieldsObject = {};

            if (typeof callback === 'function') {

                fieldsObject['hitCallback'] = callback;
            }

            args.push(fieldsObject);

            var funcname;

            if (typeof ga === 'function') {
                funcname = 'ga';
                ga.apply(this, args);
            } else {
                funcname = '__gaTracker';
                __gaTracker.apply(this, args);
            }

            console.log('track ' + funcname, args);
        }
    }


    // https://developers.facebook.com/docs/ads-for-websites/pixel-events/v2.11

    function fbq_track_event(elem, data) {

        if (typeof fbq === 'function') {

            var event = data.event || 'Lead';

            var args = [
                'track',
                event
            ];

            delete data.event;

            args.push(data);

            fbq.apply(this, args);

            console.log('track fbq', args);
        }
    }

    jQuery.prototype.extend({

        contextualize: function() {

            return this.each(function() {

                var s = $(this);

                // loading
                $('a.load[href]', s).load_in();

                // xhtml placeholders
                $('input, textarea', s).labelPlaceholder();

                // jQuery UI Selectmenu

                if (jQuery().selectmenu && !isMobile) {

                    $("select.cst", s).mySelectMenu({
                        // add attribute data-selectmenu-{instance-name} to your select element to incorporate custom settings
                        'selectmenuA': {
                            change: function(event, ui) {

                                var option = $(ui.item.element.context),
                                    select = option.closest('select'),
                                    form = select.closest('form'),
                                    selected_value = ui.item.value;

                            }
                        },
                        'selectmenuB': {
                            position: {
                                my: "right top",
                                at: "right bottom"
                            }
                        }
                    }, s);
                }

                // Form Validate

                if (jQuery().validate) {

                    $('form.f-vldt', s).myValidate({
                        focusInvalid: false // Focus the last active or first invalid element on submit. If error labels are on top of inputs, use false
                    });
                }

                // Add class to external links

                $('a', s).each(function() {

                    if (isExternalLink(this)) {

                        $(this).addClass('external');
                    }
                });

                // Event tracking for common elements

                $('a[href^="mailto:"],.buy-now,a[href$=".pdf"],a[href$=".docx"],.download-link,.event-track,.external', s).click(function(e) {

                    $(this).eventTrack();
                });

                // Style Responsive

                $('[data-style-responsive]', s).styleResponsive();

                // Site Header Resize on Scroll

                siteHeader.siteHeaderResizeOnScroll({
                    updateSiteContainer: false // whether to update padding on site container
                });

                // Story Read More

                $('.s .open-more', s).storyMore();

                // Site Navigation

                $('.st-nav', s).siteNavigation();

                if (jQuery().fitVids) {

                    $('.s', s).fitVids();
                }
                // Modal

                $("[data-modal],.mdl-lnk", s).modalNavigation();


                if (jQuery().slick) {

                    $(".sldr-A", s).slick({
                        dots: false, // pagination
                        arrows: true, // navigation
                        infinite: true,
                        slidesToShow: 6,
                        slidesToScroll: 1,
                        slidesToScroll: true,
                        autoplay: false,
                        autoplaySpeed: 7000,
                        variableWidth: false,
                        pauseOnFocus: true,
                        responsive: [{
                                breakpoint: 1170,
                                settings: {
                                    slidesToShow: 5,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 1000,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 750,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 570,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 400,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                            // You can unslick at a given breakpoint now by adding:
                            // settings: "unslick"
                            // instead of a settings object
                        ]
                    });

                    $(".sldr-B", s).slick({
						dots: true, // pagination
						arrows: false, // navigation
						infinite: true,
						slidesToShow: 1,
						fade: true,
						slidesToScroll: 1,
						slidesToScroll: true,
						autoplay: true,
						autoplaySpeed: 7000,
						variableWidth: false,
						pauseOnFocus: true,
					});

                    $(".sldr-C", s).slick({
                        dots: false, // pagination
                        arrows: true, // navigation
                        infinite: true,
                        slidesToShow: 4,
                        slidesToScroll: 1,
                        slidesToScroll: true,
                        autoplay: false,
                        autoplaySpeed: 7000,
                        variableWidth: false,
                        pauseOnFocus: true,
                        responsive: [

                            {
                                breakpoint: 1300,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },

                            {
                                breakpoint: 1000,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },

                            {
                                breakpoint: 700,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                            // You can unslick at a given breakpoint now by adding:
                            // settings: "unslick"
                            // instead of a settings object
                        ]
                    });

                    $(".sldr-D", s).slick({
                        dots: false, // pagination
                        arrows: false, // navigation
                        infinite: true,
                        slidesToShow: 8,
                        slidesToScroll: 1,
                        slidesToScroll: true,
                        autoplay: true,
                        autoplaySpeed: 7000,
                        variableWidth: false,
                        pauseOnFocus: true,
                        responsive: [{
                                breakpoint: 1170,
                                settings: {
                                    slidesToShow: 5,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 1000,
                                settings: {
                                    slidesToShow: 4,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 750,
                                settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 570,
                                settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 1
                                }
                            },
                            {
                                breakpoint: 400,
                                settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                }
                            }
                            // You can unslick at a given breakpoint now by adding:
                            // settings: "unslick"
                            // instead of a settings object
                        ]
                    });

                }


            });

        },

        // Modal Navigation

        modalNavigation: function() {

            return this.each(function() {

                var s = $(this),
                    url = s.attr("href") || s.attr("data-modal-url");

                if (typeof url === 'undefined') {

                    $.debugConsole("Modal navigation URL has not been provided");
                    return;
                }

                s.bind("click.modalNavigation", function(e) {

                    e.preventDefault();

                    var props = {
                        'url': url
                    };

                    props.trigger = $.extend({}, s);

                    var modal_name = s.attr('data-modal');

                    if (modal_name != '') {

                        props.name = modal_name;
                    }

                    if (s.is('a') && s.hasAttr('data-modal-url')) {
                        props.url = s.attr('data-modal-url');
                    }

                    if (s.hasAttr('data-modal-title')) {
                        props.title = s.attr('data-modal-title');
                    }

                    if (s.hasAttr('data-modal-scrl')) {
                        props.scroll = s.attr('data-modal-scrl');
                    }

                    var modal_overlay = s.closest('[data-modal-overlay]');

                    if (modal_overlay.length) {

                        props.overlay = $.extend({}, modal_overlay);
                    }

                    if (s.hasAttr('data-modal-footer')) {
                        props.footer = (s.attr('data-modal-footer') === 'true') ? true : false;
                    }

                    if (s.hasAttr('data-modal-footer-url') && s.hasAttr('data-modal-footer-title')) {

                        props.footer_url = s.attr('data-modal-footer-url');
                        props.footer_title = s.attr('data-modal-footer-title');

                        if (s.hasAttr('data-modal-footer-class')) {

                            props.footer_class = s.attr('data-modal-footer-class');
                        }
                    }

                    $.modal(props);

                });

            });
        },


        // Story Read More

        storyMore: function() {

            return this.each(function() {

                var s = $(this),
                    story = s.closest('.s');

                if (story.hasAttr('data-read-more-text') && story.hasAttr('data-read-less-text')) {

                    var readMoreText = story.attr('data-read-more-text'),
                        readLessText = story.attr('data-read-less-text'),
                        readMoreButton = $('<span class="more-lnk">' + readMoreText + '</span>').appendTo(s),
                        winOn;

                    readMoreButton.click(function() {

                        // close
                        if (s.hasClass('open')) {
                            s.removeClass('open');
                            readMoreButton.text(readMoreText);
                            window.scrollTo(0, winOn);
                            // open
                        } else {
                            s.addClass('open');
                            readMoreButton.text(readLessText);
                            winOn = winScrollTop;
                        }

                    });

                }

            });
        },


        // Site navigation

        siteNavigation: function() {

            return this.each(function() {

                var s = $(this),
                    list = s.find('.st-nav-li'),
                    togglerController = s.find('.tgr-ctrl'),
                    togglerTrigger = s.find('.tgr-trg'),
                    togglerTarget = s.find('.tgr-tgt'),
                    isDropdown = list.hasClass('dd'),
                    isBurger = (togglerTarget.css('position') == 'fixed');

                if (isDropdown && !isBurger) {

                    var liDir = list.find('li:has(> ul)');

                    liDir.dropdown(true);
                }

                var burgerClose = function() {

                    togglerController.prop('checked', false);
                    bodyElem.removeClass('has-st-nav-on');
                    $.restartScrolling();
                }

                togglerTarget.click(function(e) {

                    if ($(e.target).is(togglerTarget)) {

                        burgerClose();
                    }
                });

                if (togglerTrigger.length) {

                    var ref = togglerTrigger.attr('for'),
                        input = $('#' + ref);

                    if (input.length) {

                        input.change(function() {

                            if (input.is(':checked')) {

                                bodyElem.addClass('has-st-nav-on');
                                $.stopScrolling();

                            } else {

                                bodyElem.removeClass('has-st-nav-on');
                                $.restartScrolling();
                            }
                        });
                    }
                }

                list.find('a').click(function() {

                    if (isBurger) {

                        burgerClose();
                    }

                });

                $(d).click(function(e) {

                    var clickedElem = $(e.target);

                    if (!clickedElem.is(s) && !clickedElem.closest(s).length) {

                        burgerClose();
                    }

                });

            });
        },

        // Site Header Resize on Scroll

        siteHeaderResizeOnScroll: function(opts) {

            var defaults = {
                updateSiteContainer: true
            };

            var o = $.extend(defaults, opts);

            return this.each(function() {

                var s = $(this),
                    body = s.find('.st-hd-bd'),
                    distance = (siteHeaderMaxHeight - siteHeaderMinHeight);

                function adjust() {

                    var new_height = Math.max(siteHeaderMinHeight, (siteHeaderMaxHeight - winScrollTop)),
                        distance_travelled = Math.min(winScrollTop, distance),
                        distance_travelled_pct = (distance_travelled * 100 / distance);

                    if (new_height >= siteHeaderMinHeight) {

                        s.add(body).css('max-height', new_height + 'px');

                        if (o.updateSiteContainer) {
                            siteContainer.css('padding-top', new_height + 'px');
                        }

                        /* custom speed
                        var diff = ( max - min ),
                        	value = (distance_travelled_pct * diff / 100); */
                    }
                }

                adjust();

                win.on('scroll', function() {

                    if (!siteHeaderPreventAdjust) {

                        adjust();

                        // make sure it's adjusted after a super quick scroll
                        setTimeout(function() {
                            adjust();
                        }, 100);

                    }

                });

            });

        },

        // Style Responsive

        styleResponsive: function() {

            return this.each(function() {

                var s = $(this);

                if (window.matchMedia("(max-width: 767px)").matches) {

                    s.attr('style', s.attr('data-style-responsive'));
                }

            });

        },

        // Event tracking

        eventTrack: function(callback) {

            return this.each(function() {

                var s = $(this),
                    positionOnPage = $.getPositionOnPage(s),
                    eventCategory = 'Link Click',
                    eventLabel = positionOnPage,
                    eventValue = s.text();

                // forms
                if (s.is('form')) {

                    var eventCategory = 'Form Submit',
                        eventAction = s.attr('name') || 'Generic Form',
                        eventValue = s.attr('action');

                    // GA
                    ga_track_event(this, eventAction, eventCategory, eventLabel, eventValue);

                    // Facebook pixel
                    s.fbqTrack();
                }

                // mailto links
                if (s.is('a[href^="mailto:"]')) {

                    var eventAction = this.href.substr(7);

                    // GA
                    ga_track_event(this, eventAction, eventCategory, eventLabel, eventValue);

                    // Facebook pixel
                    s.fbqTrack();
                }

                // external links
                if (s.is('a.external')) {

                    var eventCategory = 'External Link Click',
                        eventAction = s.attr("href");

                    // GA
                    ga_track_event(this, eventAction, eventCategory, eventLabel, eventValue);

                    // Facebook pixel
                    s.fbqTrack();
                }

                // buy now
                if (s.hasClass('buy-now')) {

                    var eventCategory = 'Buy Now',
                        eventAction = s.attr('data-payment-method') || 'Generic Payment Method';

                    // GA
                    ga_track_event(this, eventAction, eventCategory, eventLabel, eventValue);

                    // Facebook pixel
                    s.fbqTrack();
                }

                // downloads
                if (s.is('a[href$=".pdf"],a[href$=".docx"],.download-link')) {

                    var eventCategory = 'Download Link Click',
                        eventAction = s.attr('href');

                    // GA
                    ga_track_event(this, eventAction, eventCategory, eventLabel, eventValue);

                    // Facebook pixel
                    s.fbqTrack();
                }

                if (s.hasClass('event-track')) {

                    var eventCategory = 'Generic Click',
                        eventAction = this.tagName + " " + s.text();

                    // GA
                    ga_track_event(this, eventAction, eventCategory, eventLabel, eventValue);

                    // Facebook pixel
                    s.fbqTrack();
                }

            });

        },

        fbqTrack: function(data) {

            var data = data || {};

            return this.each(function() {

                var s = $(this),
                    params = s.attributes('data-fbq');

                if (params.length > 0) {

                    delete params.length;

                    data = $.extend({}, data, params);
                }

                fbq_track_event(this, data);

            });

        },

        // Form Validate

        myValidate: function(opts) {

            var defaults = {
                onsuccess: function() {}
            };

            var o = $.extend(defaults, opts);

            return this.each(function() {

                var form = $(this),
                    validator,
                    opts = {
                        onfocusout: false, // Validate elements (except checkboxes/radio buttons) on blur
                        onkeyup: false, // Validate elements on keyup (don't use 'true', because the default value is a function)
                        rules: {},
                        messages: {},
                        errorClass: 'err',
                        validClass: 'scc'
                    };

                opts = $.extend({}, opts, defaults);

                $(':input[name]', form).each(function() {

                    var elem = $(this),
                        name = elem.attr('name');

                    if (typeof name !== 'undefined') {

                        var type = this.type,
                            inputLabel = $.getInputLabel(elem);

                        if (type !== 'submit' && typeof name === 'undefined') {

                            $.debugConsole('Name is not defined', this);
                            return;
                        }

                        if (typeof opts.rules[name] === 'undefined') {
                            opts.rules[name] = {};
                        }

                        if ($.isRequired(elem)) {

                            opts.rules[name].required = true;

                            if (typeof opts.messages[name] === 'undefined') {

                                var requiredMessage = $.getRequiredMessage(elem);

                                if (requiredMessage) {

                                    opts.messages[name] = {
                                        required: requiredMessage,
                                    };
                                }
                            }
                        }

                        if (elem.hasAttr('data-validate-equalto')) {
                            opts.rules[name].equalTo = '#' + elem.attr('data-validate-equalto');
                        }

                        if (elem.hasAttr('data-validate-remote')) {
                            opts.rules[name].remote = elem.attr('data-validate-remote');
                        }
                    }

                });

                opts.errorContainer = $(".f-msg", form);

                opts.invalidHandler = function(event, validator) {

                    $.debugConsole('invalidHandler');

                    $('.fl.err', form).removeClass('err');

                    if (opts.errorContainer) {

                        opts.errorContainer.find(".nt-req").removeClass('on');
                    }
                }

                // ~ Fires even on success
                opts.showErrors = function(errorMap, errorList) {

                    $.debugConsole(errorList);

                    if (errorList.length > 0) {

                        this.defaultShowErrors();

                        var errorListIndex = {};

                        for (var i in errorList) {

                            var error_object = errorList[i],
                                e = $(error_object.element),
                                field = e.closest(".fl");

                            field.removeClass(function(index, className) {
                                return (className.match(/(^|\s)fl-err-\S+/g) || []).join(' ');
                            });

                            field.addClass("err fl-err-" + error_object.method);

                            if (errorListIndex.hasOwnProperty(error_object.method)) {
                                errorListIndex[error_object.method]++;
                            } else {
                                errorListIndex[error_object.method] = 1;
                            }
                        }

                        if (errorListIndex.hasOwnProperty("required")) {

                            opts.errorContainer.find(".nt-req").addClass("on");
                        }
                    }
                };

                opts.errorPlacement = function(error, element) {

                    var field = element.closest('.fl'),
                        form = field.closest('form'),
                        form_message_list_container = form.find('.f-msg .msg-bd .msg-vldt-li');

                    if (form_message_list_container.length) {

                        if (!form_message_list_container.children('ul').length) {
                            form_message_list = $('<ul></ul>').appendTo(form_message_list_container);
                        } else {
                            form_message_list = form_message_list_container.children('ul').first();
                        }
                    }

                    field.addClass('fl-err');

                    var errorInserted = false;

                    if (element.is(':checkbox,:radio')) {

                        var fieldset = element.closest('.fls');

                        if (fieldset.length) {

                            var notification = fieldset.find('.fls-nt');

                            if (notification.length) {

                                notification.show();

                            } else {

                                var fieldset_message = fieldset.find('.fls-msg');

                                if (fieldset_message.length) {
                                    error.prependTo(fieldset_message);
                                } else {
                                    error.prependTo(fieldset);
                                }
                            }

                        } else {

                            error.appendTo(field);
                        }

                        errorInserted = true;
                    }

                    if (!errorInserted) {

                        if (form_message_list_container.length) {

                            var li = $('<li></li>').appendTo(form_message_list),
                                error_elem = error.appendTo(li);

                        } else {

                            var error_elem = error.insertAfter(element);
                        }
                    }

                    return true;
                };

                opts.submitHandler = function(form) {

                    var s = $(form);

                    if (s.hasClass('f-ajax')) {

                        s.formSend(null, function() {
                            s.eventTrack();
                        });

                        return false;

                    } else if (s.hasClass('f-ajax-sbmt')) {

                        // jQuery Form method
                        s.ajaxSubmit({
                            'success': function() {
                                s.eventTrack();
                            }
                        });

                        return false;
                    }

                    s.eventTrack();

                    // - will submit, when true is returned
                    return true;

                };

                validator = form.validate(opts);

                // remove error labels on mouseenter
                form.delegate('.fl label.err, .fl .sbt.err', 'mouseenter', function(e) {

                    var el = $(this);

                    if (el.css("position") == "absolute") {

                        el.fadeOut();
                    }
                });

                var elem_check = function() {

                    var elem = $(this);

                    if (elem.hasAttr('id')) {

                        $('label[for="' + elem.attr('id') + '"].err').each(function() {

                            var label = $(this);

                            if (label.css("position") == "absolute") {

                                label.fadeOut();
                            }
                        });
                    }
                }

                // remove corresponding error labels on input focus
                $(':input', form).not(':submit').focus(elem_check);
                $('select', form).change(elem_check);

            });

        },

        // jQuery UI Selectmenu

        mySelectMenu: function(instances, context) {

            // for more: http://api.jqueryui.com/selectmenu/
            var defaults = {
                change: function(event, ui) {

                },
                create: function(event, ui) {

                }
            };

            var hideCSS = {
                'overflow': 'hidden',
                'position': 'absolute',
                'width': '0',
                'height': '0',
                'opacity': '0',
                'z-index': '-1'
            };

            return this.each(function() {

                var select = $(this),
                    attrs = select.attributes('data-selectmenu'),
                    opts = {},
                    selectMenuName;

                // default options
                opts = $.extend({}, opts, defaults);

                if ('name' in attrs && attrs['name'] in instances) {

                    selectMenuName = attrs['name'];

                    // instance options
                    opts = $.extend({}, opts, instances[selectMenuName]);
                }

                if (attrs.length > 0) {

                    // attribute options
                    opts = $.extend({}, opts, attrs);
                }

                // Menu
                $.widget("custom.iconselectmenu", $.ui.selectmenu, {

                    _renderMenu: function(ul, items) {

                        var that = this,
                            currentOptgroup = "";

                        $.debugConsole(items);

                        $.each(items, function(index, item) {

                            if (item.optgroup !== currentOptgroup && item.optgroup !== '') {

                                $("<li>", {
                                        "class": "ui-selectmenu-optgroup ui-menu-divider" +
                                            (item.element.parent("optgroup").prop("disabled") ?
                                                " ui-state-disabled" :
                                                ""),
                                        text: item.optgroup
                                    })
                                    .appendTo(ul);
                            }

                            currentOptgroup = item.optgroup;

                            that._renderItemData(ul, item);
                        });

                        var dropdown = ul.parent();

                        dropdown.addClass('cst');

                        if (typeof selectMenuName !== 'undefined') {
                            dropdown.addClass(selectMenuName);
                        }

                        if ('class' in attrs) {
                            dropdown.addClass(attrs['class']);
                        }

                        if (select.hasAttr('class')) {
                            dropdown.addClass(select.attr('class'));
                        }
                    }
                });

                // Button
                select.iconselectmenu(opts).css(hideCSS).show().each(function() {

                    var widget = select.iconselectmenu("widget");

                    widget.addClass('cst');

                    if (typeof selectMenuName !== 'undefined') {
                        widget.addClass(selectMenuName);
                    }

                    if ('class' in attrs) {
                        widget.addClass(attrs['class']);
                    }

                    if (select.hasAttr('class')) {
                        widget.addClass(select.attr('class'));
                    }

                    // port the 'title' attribute
                    if (select.hasAttr('title') && select.attr('title') != '') {
                        widget.attr('title', original.attr('title'));
                    }

                }).bind('selectmenuchange iconselectmenuchange', function(e, ui) {

                    select.trigger('change');

                }).bind('selectmenuclose iconselectmenuclose', function(e, ui) {

                    var widget = select.iconselectmenu("menuWidget"),
                        wrapper = widget.parent();

                    wrapper.css('transform', '');
                    wrapper.removeData('ui-selectmenu-scroll-top-prev');

                });

            });
        },

        hasAttr: function(name) {

            for (var i = 0, l = this.length; i < l; i++) {
                if (!!(this.attr(name) !== undefined)) {
                    return true;
                }
            }
            return false;
        },

        attributes: function(prefix, str) {

            var s = $(this),
                // uo: get attributes for the first element only
                resource = this[0];

            if (typeof resource === "undefined") {
                return null;
            }

            var attributes_fetch = resource.attributes,
                attributes = {},
                size = 0,
                attrs_str = '',
                str = str || false;

            for (var i = 0; i < attributes_fetch.length; i++) {

                // ~ it can either be .nodeName or .name
                var name = attributes_fetch[i].nodeName,
                    key = null,
                    val = null;

                // uo: ordering of the clauses
                // put the keys & values into a string
                if (str === true) {

                    if (typeof prefix !== "undefined") {
                        attrs_str += ' ' + prefix + '-';
                    }

                    attrs_str += name + '="' + s.attr(name) + '"';

                } else {

                    if (typeof prefix !== "undefined") {

                        if (name.indexOf(prefix + "-") == 0) {
                            var key = name.replace(prefix + "-", ""),
                                val = s.attr(name);
                        }

                    } else {
                        var key = name,
                            val = s.attr(name);
                    }

                    if (key && val) {

                        var k = key.replace("-", "");
                        attributes[k] = ($.isNumeric(val)) ? parseFloat(val) : val;
                        size++;
                    }
                }
            }

            attributes.length = size;

            if (str === true && attrs_str != '') {
                return attrs_str;
            }

            return attributes;
        },

        labelPlaceholder: function() {

            return this.each(function() {

                var s = $(this),
                    type = this.type,
                    simulateOldStandard = false,
                    val = s.val(),
                    has_id = (s.hasAttr('id') && $.trim(s.attr("id")) != "") ? s.attr("id") : false,
                    is_lt_ie10 = (browser.name == 'msie' && browser.version < 10) ? true : false,
                    is_placeholder_legacy = (is_lt_ie10 && s.is('[placeholder]') || simulateOldStandard || !s.is('[placeholder]')),
                    labels = false;

                if (has_id) {
                    labels = $('label[for="' + has_id + '"]');
                }

                if (type == 'checkbox' || s.parent('label').length || (typeof labels !== 'undefined' && labels.length && !labels.filter('.in-plh').length)) {
                    return;
                }

                if (simulateOldStandard) {
                    s.removeAttr('placeholder');
                }

                if (is_placeholder_legacy) {

                    s.addClass('placeholder');

                } else {

                    if (labels) {
                        labels.filter('.in-plh').hide();
                    }
                }

                if (has_id) {

                    var placeholders = labels.filter('.in-plh');

                    if (placeholders.length && val != "") {
                        placeholders.hide();
                    }
                }

                s.bind({

                    'focus': function() {

                        s.addClass("focus");

                        if (labels) {
                            labels.addClass('blur');
                        }
                    },

                    'keyup': function() {

                        if (typeof placeholders !== 'undefined' && is_placeholder_legacy) {

                            placeholders.not('.hide').hide();

                            if (s.val() == "") {
                                placeholders.show();
                            }
                        }
                    },

                    'blur': function() {

                        s.removeClass("focus");

                        if ((has_id && s.val() == "") && is_placeholder_legacy) {
                            $('label[for="' + s.attr("id") + '"].in-plh').removeClass('blur').show();
                        }
                    }
                });

            });

        },

        load_in: function() {

            return this.each(function() {

                var self = $(this),
                    is_link = self.prop("tagName").toLowerCase() == "a",
                    url = (is_link) ? self.attr("href") : self.attr("data-url"),
                    format = (self.hasAttr('data-format')) ? self.attr('data-format') : 'html',
                    datatype = (format == 'string') ? 'text' : format;

                if (typeof url !== 'undefined') {

                    var settings = {
                        type: "GET",
                        data: {
                            format: format
                        },
                        dataType: datatype,
                        url: url,
                        success: function(response) {

                            var data = (typeof response === 'object') ? response.data : response;

                            if (is_link) {
                                self.after(data).remove();
                            } else {
                                self.removeClass("loading").html(data);
                            }
                        },
                        complete: function(jqXHR, textStatus) {

                            if (textStatus == 'parsererror') {

                                console.log('Response text: ' + jqXHR.responseText);
                            }
                        }
                    };

                    if (format == 'jsonp') {
                        settings.jsonp = 'jsonp_callback';
                    }

                    $.ajax(settings);
                }

            });

        },

        enter: function(val) {

            return this.each(function() {

                var s = $(this);

                if (s.is(':input:not(button)')) {

                    // - if starts with 'select-'
                    if (this.type.lastIndexOf('select-', 0) === 0) {

                        var found = false;

                        for (var i = 0; i < this.options.length; i++) {

                            if (this.options[i].value == val) {
                                found = true;
                                break;
                            }
                        }

                        if (!found) {

                            var new_index = this.childElementCount,
                                new_option = $('<option value="' + val + '">' + val + '</option>').appendTo(s);

                            s.selectUpdateIndex(new_index);

                        } else {

                            s.val(val);
                        }

                    } else if (this.type == 'checkbox' || this.type == 'radio') {

                        this.checked = Boolean(Number(val));

                    } else {

                        s.val(val).refresh();
                    }

                } else {

                    var content = s.find('.content');

                    if (content.length) {
                        content.text(val);
                    } else {
                        s.text(val);
                    }
                }

            });

        },

        clear: function() {

            return this.each(function() {

                var self = jQuery(this),
                    type = this.type,
                    tag = this.tagName.toLowerCase();

                $(".input-placeholder", this).not(".hidden").removeClass("blur").show();

                if (tag == 'form')
                    return $(':input', this).clear();

                if (type == 'checkbox' || type == 'radio') {

                    this.checked = false;

                } else if (tag == 'select') {

                    var default_index;

                    for (var i = 0; i < this.options.length; i++) {

                        if (this.options[i].attributes.hasOwnProperty('selected')) {
                            default_index = i;
                            break;
                        }
                    }

                    this.selectedIndex = (default_index) ? default_index : 0;

                    if (self.next().hasClass('ui-selectmenu-button')) {
                        self.iconselectmenu('refresh');
                    }

                } else if (self.is(':input') && tag != 'button' && type != 'submit') {

                    this.value = '';

                } else {

                    this.innerHTML = '';
                }

            });

        },

        selectUpdateIndex: function(index) {

            return this.each(function() {

                var s = $(this);

                // - 'index' is zero-based
                if (index >= this.childElementCount) {

                    this.selectedIndex = index;

                    s.refresh();
                }

            });

        },

        refresh: function() {

            return this.each(function() {

                var s = $(this);

                // - if starts with 'select-'
                if (typeof this.type !== 'undefined' && this.type.lastIndexOf('select-', 0) === 0) {

                    var next = s.next();

                    // - jQuery UI selectmenu
                    if (next.hasClass('ui-selectmenu-button')) {

                        if (s.iconselectmenu()) {
                            s.iconselectmenu('refresh');
                        } else if (elem.selectmenu()) {
                            s.selectmenu('refresh');
                        }
                    }
                }

            });

        }

    });

    jQuery.extend(jQuery, {

        coords: function(obj, selector) {

            var isJQuery = obj instanceof jQuery;

            if (isJQuery) {
                obj.clientX = obj.offset().left;
                obj.clientY = obj.offset().top;
            }

            var result = {};
            var win = $(window);

            result.top = obj.clientY;
            result.left = obj.clientX;

            var bias = { x: 0, y: 0 }

            if (isJQuery) {
                bias.y = obj.outerHeight();
                bias.x = obj.outerWidth();
            }

            if (typeof selector != "undefined") {

                var ancestor = (isJQuery) ? obj.closest(selector) : $(document).find(selector);

                if (ancestor.length) {

                    var ancestorX = ancestor.offset().left;
                    var ancestorY = ancestor.offset().top;

                    result.top = Math.ceil(obj.clientY - ancestorY);
                    result.left = Math.ceil(obj.clientX - ancestorX);

                    result.bottom = Math.ceil(ancestor.outerHeight() - (result.top + bias.y));
                    result.right = Math.ceil(ancestor.outerWidth() - (result.left + bias.x));
                }

            } else {

                result.bottom = Math.ceil(win.height() - (result.top + bias.y));
                result.right = Math.ceil(win.width() - (result.left + bias.x));
            }

            return result;

        },

        preload_imgs: function(data, imgs, callback) {

            var s = this;

            if (imgs === null) {

                var imgs = [];

                $("<div/>").append(data).find("img").each(function(e) {
                    imgs.push($(this).attr("src") + '?' + (new Date()).getTime());
                });
            }

            var t = imgs.length;

            if (t == 0) return callback.call(this, data);

            var c = function(length) {

                if (length == t && $.isFunction(callback)) {
                    callback.call(this, data);
                }
            }

            var pre = function(i) {
                s.preload_img(imgs[i], function(w, h) {
                    var n = (i + 1);
                    c.call(this, n);
                    if (t != n) pre.call(this, n);
                });
            }

            pre.call(this, 0);

        },

        preload_img: function(imgpath, callback) {

            var img = new Image();

            img.onload = function() {
                callback.call(this, this.width, this.height);
                img.onload = function() {};
            }

            img.onerror = function() {
                callback.call(this);
            }

            img.src = imgpath;

        },

        uniqueId: function() {

            var newDate = new Date,
                partOne = newDate.getTime(),
                partTwo = 1 + Math.floor((Math.random() * 32767)),
                partThree = 1 + Math.floor((Math.random() * 32767)),
                id = partOne + '-' + partTwo + '-' + partThree;

            return id;

        },

        getRandomInt: function(min, max) {

            return Math.floor(Math.random() * (max - min + 1)) + min;

        },

        hasCSSProperty: function(p) {

            var b = document.body || document.documentElement,
                s = b.style;

            // No css support detected
            if (typeof s === 'undefined') return false;

            // Tests for standard prop
            if (typeof s[p] === 'string') return true;

            // Tests for vendor specific prop
            var v = ['Moz', 'Webkit', 'Khtml', 'O', 'ms', 'Icab'],
                p = p.charAt(0).toUpperCase() + p.substr(1);

            for (var i = 0; i < v.length; i++) {
                if (typeof s[v[i] + p] == 'string') return true;
            }

            return false;

        },

        browser: function() {

            var ua = navigator.userAgent.toLowerCase(),
                match = /(chrome)[ \/]([\w.]+)/.exec(ua) ||
                /(webkit)[ \/]([\w.]+)/.exec(ua) ||
                /(opera)(?:.*version|)[ \/]([\w.]+)/.exec(ua) ||
                /(msie) ([\w.]+)/.exec(ua) ||
                ua.indexOf("compatible") < 0 && /(mozilla)(?:.*? rv:([\w.]+)|)/.exec(ua) || [];

            return {
                name: match[1] || "",
                version: match[2] || "0"
            };
        },

        // Fetch Input Elem's Label

        getInputLabel: function(input) {

            var label,
                labelElem;

            if (typeof input.attr('id') !== 'undefined') {

                var id = input.attr('id');

                if (input.is('select') && input.next('.ui-selectmenu-button').length) {
                    findLabel = $('label[for="' + id + '-button"]');
                } else {
                    findLabel = $('label[for="' + id + '"]');
                }
            }

            if (typeof findLabel !== 'undefined' && findLabel.length) {
                label = findLabel.first().text();
            } else if (input.prev('label').length) {
                label = input.prev("label").text();
            } else if (typeof input.prop("title") !== 'undefined') {
                label = input.prop("title");
            } else {
                label = input.attr('name');
            }

            return label;

        },

        // Is input element required

        isRequired: function(elem) {

            return elem.is('[required],[aria-required="true"],.in-req');

        },

        // Get input required message

        getRequiredMessage: function(elem) {

            if (!elem.hasAttr("data-msg-required")) {

                var str = $.translateString('is_required', '{field} is required'),
                    inputLabel = $.getInputLabel(elem),
                    requiredMessage = str.replace('{field}', $.trim(inputLabel.replace(/\*|:/g, '')));

                return requiredMessage;
            }

            return false;
        },

        // Get position on page

        getPositionOnPage: function(elem) {

            var header = elem.closest('#header');

            if (header.length) {
                return 'Header';
            }

            var footer = elem.closest('#footer');

            if (footer.length) {
                return 'Footer';
            }

            var main = elem.closest('#main');

            if (main.length) {
                return 'Main';
            }

            return '(unknown)';

        },

        translateString: function(key_name, fallback) {

            if (typeof translateStrings === 'object' && translateStrings.hasOwnProperty(key_name)) {

                return translateStrings[key_name];
            }

            if (typeof fallback !== 'undefined') {

                return fallback;
            }

            return '§' + key_name;

        },

        debugConsole: function() {

            if (debug) {

                console.log.apply(this, arguments);
            }
        },

        stopScrolling: function() {

            siteHeaderPreventAdjust = true;

            winScrollStoppedAt = winScrollTop;

            bodyElem.addClass('no-scrl');

            $('html,body').scrollTop(winScrollStoppedAt);

            setTimeout(function() {
                siteHeaderPreventAdjust = false;
            }, 10);
        },

        restartScrolling: function() {

            bodyElem.removeClass('no-scrl');

            if (winScrollStoppedAt >= 0) {

                $('html,body').scrollTop(winScrollStoppedAt);
                winScrollStoppedAt - 1;
            }

        },

        // Modal

        // modalCreateBase: function() {

        //     if (!modalElem.length) {

        //         var controller,
        //             modal_window;

        //         bodyElem.prepend(
        //             controller = $('<input type="checkbox" id="mdl-ctrl" class="mdl-ctrl" autocomplete="off">')
        //         );

        //         controller.after(
        //             modalElem = $('<div class="mdl-bkd"></div>').prepend(
        //                 modal_window = $('<div class="mdl-win"></div>')
        //             )
        //         );

        //         if ($.modalWindowHasTransition()) {

        //             modal_window.bind('transitionend webkitTransitionEnd oTransitionEnd', function(e) {

        //                 if (modalIsClosing) {

        //                     if (e.originalEvent.propertyName == 'transform') {
        //                         $.modalUnsetContent();
        //                     }
        //                 }
        //             });
        //         }
        //     }
        // },

        modalCreate: function(modalName, modalTitle, modalScroll, modalFooter, modalFooterUrl, modalFooterTitle, modalFooterClass) {

            var controller,
                modal_window,
                modal_header,
                modal_title,
                modal_close,
                modal_content,
                modal_scrollbar,
                modal_inner_content,
                modal_footer,
                modal_footer_close,
                modal_switching = false;

            if (!modalElem.length || !modalElem.find('.mdl-win').length || !modalElem.find('.mdl-c').length) {

                if (!bodyElem.children('.mdl-ctrl').length) {

                    bodyElem.prepend(
                        controller = $('<input type="checkbox" id="mdl-ctrl" class="mdl-ctrl" autocomplete="off" checked="checked">')
                    );

                } else {

                    controller = $('#mdl-ctrl');
                }

                if (!controller.next('.mdl-bkd').length) {

                    controller.after(
                        modalElem = $('<div class="mdl-bkd"></div>')
                    );

                }

                if (!modalElem.children('.mdl-win').length) {

                    modalElem.prepend(
                        modal_window = $('<div class="mdl-win"></div>')
                    );

                } else {

                    modal_window = modalElem.children('.mdl-win');
                }

                modal_window.prepend(

                    modal_header = $('<header class="mdl-hd"></header>').prepend(

                        modal_close = $('<label for="mdl-ctrl" class="mdl-cls">' + $.translateString('close') + '</label>')
                    )
                );

                modal_header.after(

                    modal_content = $('<div class="mdl-c"></div>').prepend(

                        modal_scrollbar = $('<div' + ((modalScroll == 'yes') ? ' class="scrl"' : '') + '></div>').prepend(

                            modal_inner_content = $('<div class="mdl-c-inn"></div>')
                        )
                    )
                );

            } else {

                // switched between different modal types
                if ((typeof modalName === 'undefined' && !modalElem.attr('class').match(/mdl-[A-Z]{1}($|\s)/g)) || (typeof modalName !== 'undefined' && modalElem.hasClass('mdl-' + modalName))) {
                    modal_switching = true;
                }

                modalElem.removeAttr("class").addClass("mdl-bkd");

                controller = $('#mdl-ctrl');
                modal_window = modalElem.find('.mdl-win');
                modal_close = modal_window.find('.mdl-cls');
                modal_content = modal_window.find('.mdl-c');
                modal_header = modal_window.find('.mdl-hd');
                modal_footer = modal_window.find('.mdl-ft');
                modal_footer_close = modal_footer.find('.mdl-cls');

                if (modal_footer.length && !modalFooter) {
                    modal_footer.remove();
                } else {
                    modal_footer.empty();
                }
            }

            modal_title = modal_header.find('.mdl-h');

            if (typeof modalTitle !== 'undefined') {

                if (!modal_title.length) {

                    modal_header.prepend(

                        modal_title = $('<h2 class="h mdl-h">' + modalTitle + '</h2>')
                    )

                } else {

                    modal_title.text(modalTitle);
                }

            } else if (modal_title.length) {

                modal_title.remove();
            }

            if (modalFooter === true) {

                if (typeof modal_footer === 'undefined' || !modal_footer.length) {

                    modal_window.append(

                        modal_footer = $('<footer class="mdl-ft"></footer>')
                    );
                }

                var footer_html = (modalFooterUrl) ?
                    '<a href="' + modalFooterUrl + '" class="mdl-cls ' + modalFooterClass + '">' + modalFooterTitle + '</a>' :
                    '<button type="button" class="mdl-cls">' + $.translateString('close') + '</button>'

                modal_footer.prepend(
                    modal_footer_close = $(footer_html)
                ).contextualize();
            }

            controller.prop('checked', true);

            // switch between different modal types
            if (modal_switching) {
                modalElem.addClass('mdl-switch');
            } else {
                modalElem.removeClass('mdl-switch');
            }

            modalElem.addClass('wait');

            if (typeof modalName !== 'undefined') {

                modalElem.addClass('mdl-' + modalName);
            }

            isModalOpen = true;
            $.stopScrolling();

            modalElem.bind("click.modalCloseBackdrop", function(e) {

                if ($(e.target).is(modalElem)) {

                    $.modalClose(true);
                }

            });

            modal_close.bind('click.modalClose', function(e) {

                $.modalClose();
            });

            modal_window.bind('scroll', function() {

                var openSelectButtons = modal_window.find('.ui-selectmenu-button[aria-expanded="true"]'),
                    scrollTop = $(this).scrollTop();

                if (openSelectButtons.length > 0) {

                    openSelectButtons.each(function() {

                        var selectElem = $(this).prev('select'),
                            widget = selectElem.iconselectmenu("menuWidget"),
                            menu = widget.parent(),
                            prev = menu.data('ui-selectmenu-scroll-top-prev');

                        if (typeof prev === 'undefined') {
                            prev = scrollTop;
                            menu.data('ui-selectmenu-scroll-top-prev', scrollTop);
                        }

                        var off = (prev - scrollTop - 1);
                        menu.css('transform', 'translateY(' + off + 'px)');

                    });

                }

            });

            if (typeof modal_footer_close !== 'undefined') {

                modal_footer_close.bind('click.modalFooterClose', function(e) {
                    var $target = $(e.currentTarget)
                    if ($target.hasClass('removeAddress')) {
                        document.location.href = $target.attr('href')
                    } else {
                        $.modalClose(true);
                    }
                });
            }
        },

        modalWindowHasTransition: function() {

            var modalWin = modalElem.find('.mdl-win').first(),
                modalWinTransition = modalWin.css('transition-property');

            return (modalWinTransition && modalWinTransition != '' && modalWinTransition.indexOf('transform') != -1);
        },

        modalClose: function(force, skipProgressBar) {

            modalAbort = true;
            modalIsClosing = true;

            var controller = modalElem.prev(),
                modal_props = modalElem.data('modal_props');

            htmlElem.removeClass('has-mdl');

            if (force === true) {
                controller.prop('checked', false);
            }

            if (!$.modalWindowHasTransition()) {
                $.modalUnsetContent();
            }

            isModalOpen = false;
            $.restartScrolling();

            if (!skipProgressBar && pageProgressBar.attr('data-name') == 'modal') {

                $.pageProgressBarStop(true);
            }

            if (modal_props.hasOwnProperty('overlay')) {

                modal_props.overlay.removeClass('o-fcs').children('.o').remove();
            }
        },

        modal: function(opts) {

            var o = {
                scroll: 'no',
                footer: false,
                footer_url: false,
                footer_title: false,
                footer_class: ''
            };

            o = $.extend({}, o, opts);

            if (!o.hasOwnProperty('url') && !o.hasOwnProperty('html')) {

                $.debugConsole("Error: neither modal URL nor modal HTML has been provided");
                return;
            }

            if (isModalOpen) {
                $.modalClose(true, true);
                modalIsClosing = false; // when switching modals
            }

            modalAbort = false;

            if (!o.hasOwnProperty('html')) {

                $.pageProgressBarStart('modal');
            }

            if (!isModalOpen) {

                $.modalCreate(o.name, o.title, o.scroll, o.footer, o.footer_url, o.footer_title, o.footer_class);
            }

            modalElem.data('modal_props', o);

            if (o.hasOwnProperty('overlay')) {

                o.overlay.addClass('o-fcs');

                $('<div class="o"></div>').appendTo(o.overlay);
            }

            var onEnd = function() {

                htmlElem.addClass('has-mdl');

                if (!o.hasOwnProperty('html')) {

                    $.pageProgressBarEnd();
                }
            }

            var modal_sleep = ((debug) ? debugSetTimeout : 0);

            if (o.hasOwnProperty('html')) {

                modal_sleep = 0;
            }

            setTimeout(function() {

                if (o.hasOwnProperty('url')) {

                    var internal = (o.url.slice(0, 1) == "#"),
                        url_hash = (!internal && o.url.split('#')[1]);

                    if (o.url.match(/\.(jpeg|jpg|gif|png)$/) != null) {

                        $.preload_img(o.url, function() {

                            var html = $('<img src="' + o.url + '" alt="' + $.translateString('picture') + '">');

                            $.modalPopulateContents(html, onEnd);

                        });

                    } else {

                        $.ajax({
                            url: o.url,
                            cache: false,
                            success: function(data) {

                                if (modalAbort) return;

                                var target_name = (typeof url_hash !== 'undefined') ? url_hash : 'content',
                                    contain = $(data),
                                    contain = contain.find("#" + target_name),
                                    html = contain.html();

                                $.modalPopulateContents(html, onEnd);

                            }
                        });
                    }

                } else if (o.hasOwnProperty('html')) {

                    $.modalPopulateContents(o.html, onEnd);

                }

            }, modal_sleep);

        },

        modalPopulateContents: function(html, callback) {

            var modal_contents = modalElem.find('.mdl-c'),
                modal_contents_inner = modalElem.find('.mdl-c-inn');

            modal_contents_inner.html(html);
            modal_contents.contextualize();
            modalElem.removeClass('wait');

            modal_contents_inner.find('[href="#back"], .mdl-cls').click(function(e) {

                e.preventDefault();

                $.modalClose(true);

            });

            if ($.isFunction(callback)) {
                callback.call(this);
            }

        },

        modalUnsetContent: function() {

            var modal_contents = modalElem.find('.mdl-c'),
                modal_contents_inner = modalElem.find('.mdl-c-inn');

            modal_contents_inner.empty();
            modalIsClosing = false;
        },

        init: function() {

            if (loc.match('#')) {
                hash = loc.split('#')[1];
            }

            var browser_info = $.browser();

            if (browser_info) {
                browser.name = browser_info.name;
                browser.version = parseFloat(browser_info.version);
            }

            $(d).contextualize();

        }

    });

    var adjustSiteHeader = function() {

        if (window.matchMedia("(max-width: 1350px)").matches) {

            scrollHeight = 1;

        } else {

            scrollHeight = siteHeaderMinHeight;
        }

        if (winScrollTop > scrollHeight) {

            siteHeader.addClass('st-hd-alt');
            bodyElem.addClass('has-st-hd-alt');

            winScrollTop = win.scrollTop();
            winScrollTopPrev = (winScrollTop - 1);

        } else if (winScrollStoppedAt > 0 && bodyElem.hasClass('has-st-nav-on')) {

            siteHeader.addClass('st-hd-alt');
            bodyElem.addClass('has-st-hd-alt');
        } else if (winScrollTopPrev > winScrollTop) {

            siteHeader.removeClass('st-hd-alt');
            bodyElem.removeClass('has-st-hd-alt');
        }
    }

    win.on('scroll', function() {

        clearTimeout(winScrollingTimeout);
        winScrolling = true;

        winScrollTop = win.scrollTop();
        adjustSiteHeader.call(this);

        winScrollingTimeout = setTimeout(function() {
            winScrolling = false;
        }, 250);

        if (winScrollFuncs.length) {

            for (var i = 0; i < winScrollFuncs.length; i++) {
                winScrollFuncs[i].call(this);
            }
        }

        winScrollTopPrev = winScrollTop;

    }).on("load", function() {

        winLoaded = true;

    }).on('popstate', function(e) {


    });

    $(d).ready(function() {

        var s = $(this);

        winScrollTop = win.scrollTop();

        var cf7Callback = function(event) {

            var target = jQuery(event.target),
                form = target.find('.wpcf7-form'),
                redirectUrlElem;

            if (event.type == 'mailsent') {

                form.eventTrack();
                redirectUrlElem = form.find('[name="on_sent_success"]');

            } else if (event.type == 'mailfailed') {

                redirectUrlElem = form.find('[name="on_sent_failed"]');
            }

            if (typeof redirectUrlElem !== 'undefined') {

                location.href = redirectUrlElem.attr('value');
            }

        };

        s.on('mailsent.wpcf7', cf7Callback);

        // $.modalCreateBase();

        $.init();

    });

})(document, window, jQuery);