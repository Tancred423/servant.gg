/* Console */
$(document).ready(function () {
    console.log('%cSERVANT ', 'color: #7289da; font-size: 50px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log('%cYour multifunctional Discord bot ', 'color: #fff; font-size: 25px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log('%cDM Servant with "I found your console!" to receive a hidden achievement.', 'color: #fff; font-size: 10px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log('%c   ', 'font-size:110px; background:url(https://i.imgur.com/gSEFj8Q.png) no-repeat;');
    console.log('%cHold up!', 'color: #f04747; font-size: 35px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log("%cIf someone told you to copy/paste something here you have an 11/10 chance you're being scammed.", 'color: #fff; font-size: 20px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
});

/* Mobile navigation menu */
$(".burger-icon").on("click", function () {
    if ($(".main-nav").hasClass("mobile-hide")) {
        $(".main-nav").removeClass("mobile-hide");
        $(".main-nav").addClass("mobile-show");
    } else {
        $(".main-nav").addClass("mobile-hide");
        $(".main-nav").removeClass("mobile-show");
    }
});

/* User logout menu */
$(".user-logged-in").on("click", function () {
    if ($(".user-dropdown").hasClass("show")) {
        $(".user-dropdown").removeClass("show");
        $(".user-dropdown").addClass("hide");

        if ($(".user-arrow").hasClass("fa-caret-up")) {
            $(".user-arrow").removeClass("fa-caret-up");
            $(".user-arrow").addClass("fa-caret-down");
        }
    } else {
        $(".user-dropdown").addClass("show");
        $(".user-dropdown").removeClass("hide");

        if ($(".user-arrow").hasClass("fa-caret-down")) {
            $(".user-arrow").removeClass("fa-caret-down");
            $(".user-arrow").addClass("fa-caret-up");
        }
    }
});

/* Submit guild settings without redirect nor refresh */
$('#send_gs').click(function () {
    event.preventDefault();

    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/guild',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            prefix: $('#prefix').val(),
            language: $('#language').val(),
            mod_role: $('#mod').val(),
            achievements: $('#achievements').is(':checked'),
            cmddeletion: $('#cmddeletion').is(':checked'),
            eastereggs: $('#eastereggs').is(':checked'),
            leveling: $('#leveling').is(':checked')
        },
        success: function () {
            // alert("Settings were saved!");
            $('#dismissable-success').addClass('dismiss');
        },
        error: function () {
            // alert("Unexpected Error: Settings were not saved.");
            $('#dismissable-error').addClass('dismiss');
        }
    });
});

/* Mod role selection to color 'no mod role' gray */
$("#mod").change(function () {
    if ($(this).val() == "0") $(this).addClass("empty-option");
    else $(this).removeClass("empty-option")
});
$("#mod").change();


/* Input fields required to make the visuals of the labels work */
function setRequired(arg) {
    if (!arg.value) arg.removeAttribute("required", "");
    else arg.setAttribute("required", "");
}

/* Collapsibles */
(function () {
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

$(document).ready(function () {
    $('.collapsible').collapsible();
});

/* Dismissables */
(function (window) {
    let dismissibleItem = function (el, type, value) {
        let html = '<span>' + value + ' <button type="button" class="close2">X</button></span>';

        el.removeAttribute('data-component');
        el.removeAttribute('data-value');
        el.removeAttribute('data-type');

        el.classList.add('dismissible', 'dismissible-' + type);

        el.innerHTML = html;

        el.querySelector('.close2').addEventListener('click', function (event) {
            if (type == 'info') {
                setCookie("disclaimer", "disclaimer to clarify wip", 1);
            }

            let height = el.offsetHeight,
                opacity = 1,
                timeout = null;
            function reduceHeight() {
                height -= 2;
                el.setAttribute('style', 'height: ' + height + 'px; opacity: ' + opacity);
                if (height <= 0) {
                    window.clearInterval(timeout);
                    timeout = null;
                    el.remove();
                }
            }
            function fade() {
                opacity -= .1;
                el.setAttribute('style', 'opacity: ' + opacity);
                if (opacity <= 0) {
                    window.clearInterval(timeout);
                    timeout = window.setInterval(reduceHeight, 1);
                }
            }
            timeout = window.setInterval(fade, 25);

            // window.location.href = window.location.href.split("?")[0];
        });

    };

    let dismissibles = Array.prototype.slice.call(document.querySelectorAll('[data-component="dismissible-item"]'));
    if (dismissibles.length) {
        for (let i = 0; i < dismissibles.length; i++) {
            let type = dismissibles[i].getAttribute('data-type'),
                value = dismissibles[i].getAttribute('data-value');
            new dismissibleItem(dismissibles[i], type, value)
        }
    }

})(window);

function refreshDismissibles(window) {
    let dismissibleItem = function (el, type, value) {
        let html = '<span>' + value + ' <button type="button" class="close2">X</button></span>';

        el.removeAttribute('data-component');
        el.removeAttribute('data-value');
        el.removeAttribute('data-type');

        el.classList.add('dismissible', 'dismissible-' + type);

        el.innerHTML = html;

        el.querySelector('.close2').addEventListener('click', function (event) {
            if (type == 'info') {
                setCookie("disclaimer", "disclaimer to clarify wip", 1);
            }

            let height = el.offsetHeight,
                opacity = 1,
                timeout = null;
            function reduceHeight() {
                height -= 2;
                el.setAttribute('style', 'height: ' + height + 'px; opacity: ' + opacity);
                if (height <= 0) {
                    window.clearInterval(timeout);
                    timeout = null;
                    el.remove();
                }
            }
            function fade() {
                opacity -= .1;
                el.setAttribute('style', 'opacity: ' + opacity);
                if (opacity <= 0) {
                    window.clearInterval(timeout);
                    timeout = window.setInterval(reduceHeight, 1);
                }
            }
            timeout = window.setInterval(fade, 25);

            // window.location.href = window.location.href.split("?")[0];
        });

    };

    let dismissibles = Array.prototype.slice.call(document.querySelectorAll('[data-component="dismissible-item"]'));
    if (dismissibles.length) {
        for (let i = 0; i < dismissibles.length; i++) {
            let type = dismissibles[i].getAttribute('data-type'),
                value = dismissibles[i].getAttribute('data-value');
            new dismissibleItem(dismissibles[i], type, value)
        }
    }
}

/* Cookies */
function setCookie(cname, cvalue, exdays) {
    let d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    let expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for (let i = 0; i < ca.length; i++) {
        let c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// Login
function login(redirect) {
    setCookie('redirect', redirect, 1);
    console.log(window.location.origin + '/auth')
    window.location.href = window.location.origin + '/auth'
}

/* Tabs */
function openComm(evt, commName) {
    evt.preventDefault();

    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(commName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Get the element with id="defaultOpen" and click on it
if (document.getElementById("defaultOpen") !== null)
    document.getElementById("defaultOpen").click();


/* Dashboard > Guild > Cats */
function submit_categories(checkbox, category) {
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/category',
        dataType: 'html',
        data: {
            guild_id: checkbox.getAttribute('name'),
            category: category,
            checked: checkbox.checked
        },
        success: function () {
            // maybe some kind of indicator?
        },
        error: function () {
            $('#dismissible-item').addClass('dismiss');
        }
    });
}

// Commands
function submit_commands(checkbox, command) {
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/command',
        dataType: 'html',
        data: {
            guild_id: checkbox.getAttribute('name'),
            command: command,
            checked: checkbox.checked
        },
        success: function () {
            // maybe some kind of indicator?
        },
        error: function () {
            $('#dismissible-item-com').addClass('dismiss');
        }
    });
}

// Plugins
function submit_plugins(checkbox, plugin) {
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/plugin',
        dataType: 'html',
        data: {
            guild_id: checkbox.getAttribute('name'),
            plugin: plugin,
            checked: checkbox.checked
        },
        success: function () {
            // maybe some kind of indicator?
        },
        error: function () {
            $('#dismissible-item-plugin').addClass('dismiss');
        }
    });
}

function submit_us() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user',
        dataType: 'html',
        data: {
            prefix: $('#prefix_us').val(),
            language: $('#language_us').val(),
            bio: $('#bio').val(),
            birthday: $('#birthday').val(),
            bday_guilds: $('#bday-guilds').val().join('|'),
            color: $('#embedcolor').val(),
            bg_1: $('#bg_1').is(':checked'),
            bg_2: $('#bg_2').is(':checked'),
            bg_3: $('#bg_3').is(':checked'),
            bg_4: $('#bg_4').is(':checked'),
            bg_5: $('#bg_5').is(':checked'),
            bg_6: $('#bg_6').is(':checked'),
            bg_7: $('#bg_7').is(':checked'),
            bg_8: $('#bg_8').is(':checked'),
            bg_9: $('#bg_9').is(':checked')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function submit_us_bdayclear() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user',
        dataType: 'html',
        data: {
            prefix: $('#prefix_us').val(),
            language: $('#language_us').val(),
            bio: $('#bio').val(),
            birthday: '0000-00-00',
            bday_guilds: $('#bday-guilds').val().join('|'),
            color: $('#embedcolor').val(),
            bg_1: $('#bg_1').is(':checked'),
            bg_2: $('#bg_2').is(':checked'),
            bg_3: $('#bg_3').is(':checked'),
            bg_4: $('#bg_4').is(':checked'),
            bg_5: $('#bg_5').is(':checked'),
            bg_6: $('#bg_6').is(':checked'),
            bg_7: $('#bg_7').is(':checked'),
            bg_8: $('#bg_8').is(':checked'),
            bg_9: $('#bg_9').is(':checked')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
                setTimeout(function () {
                    circle_saved();
                    location.reload();
                }, 200);
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function submit_us_colorclear() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user',
        dataType: 'html',
        data: {
            prefix: $('#prefix_us').val(),
            language: $('#language_us').val(),
            bio: $('#bio').val(),
            birthday: $('#birthday').val(),
            bday_guilds: $('#bday-guilds').val().join('|'),
            color: '#7289da',
            bg_1: $('#bg_1').is(':checked'),
            bg_2: $('#bg_2').is(':checked'),
            bg_3: $('#bg_3').is(':checked'),
            bg_4: $('#bg_4').is(':checked'),
            bg_5: $('#bg_5').is(':checked'),
            bg_6: $('#bg_6').is(':checked'),
            bg_7: $('#bg_7').is(':checked'),
            bg_8: $('#bg_8').is(':checked'),
            bg_9: $('#bg_9').is(':checked')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
                setTimeout(function () {
                    circle_saved();
                    location.reload();
                }, 200);
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function submit_us_bgclear() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user',
        dataType: 'html',
        data: {
            prefix: $('#prefix_us').val(),
            language: $('#language_us').val(),
            bio: $('#bio').val(),
            birthday: $('#birthday').val(),
            bday_guilds: $('#bday-guilds').val().join('|'),
            color: $('#embedcolor').val(),
            bg_1: true,
            bg_2: false,
            bg_3: false,
            bg_4: false,
            bg_5: false,
            bg_6: false,
            bg_7: false,
            bg_8: false,
            bg_9: false
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
                setTimeout(function () {
                    circle_saved();
                    location.reload();
                }, 200);
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function submit_gs() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/guild',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            prefix: $('#prefix_gs').val(),
            language: $('#language_gs').val(),
            timezone: $('#timezone').val(),
            mod_roles: $('#mod_roles').val().join('|'),
            achievements: $('#achievements').is(':checked'),
            cmddeletion: $('#cmddeletion').is(':checked'),
            eastereggs: $('#eastereggs').is(':checked')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function submit_autorole() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/autorole',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            ar_1_val: $('#role_1').find(":selected").val(),
            ar_1_delay: $('#delay_1').val(),
            ar_2_val: $('#role_2').find(":selected").val(),
            ar_2_delay: $('#delay_2').val(),
            ar_3_val: $('#role_3').find(":selected").val(),
            ar_3_delay: $('#delay_3').val(),
            ar_4_val: $('#role_4').find(":selected").val(),
            ar_4_delay: $('#delay_4').val(),
            ar_5_val: $('#role_5').find(":selected").val(),
            ar_5_delay: $('#delay_5').val(),
            ar_6_val: $('#role_6').find(":selected").val(),
            ar_6_delay: $('#delay_6').val(),
            ar_7_val: $('#role_7').find(":selected").val(),
            ar_7_delay: $('#delay_7').val(),
            ar_8_val: $('#role_8').find(":selected").val(),
            ar_8_delay: $('#delay_8').val(),
            ar_9_val: $('#role_9').find(":selected").val(),
            ar_9_delay: $('#delay_9').val(),
            ar_10_val: $('#role_10').find(":selected").val(),
            ar_10_delay: $('#delay_10').val(),
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function (xhr, status, text) {
            if (xhr.status === 403) {
                $('#dismissible-item').addClass('dismiss');
            }

            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function circle_saved() {
    $('.circle-loader').addClass('load-complete');
    $('.checkmark').css("display", "block");
    $('.circle-label').text("Saved");
}

function circle_error() {
    $('.circle-loader').addClass('load-error');
    $('.errormark').css("display", "block");
    $('.errormark2').css("display", "block");
    $('.circle-label').text("Error");
}

function circle_loading() {
    $('.circle-loader').removeClass('load-complete');
    $('.circle-loader').removeClass('load-error');
    $('.checkmark').css("display", "none");
    $('.errormark').css("display", "none");
    $('.errormark2').css("display", "none");
    $('.circle-label').html("Saving...");
}

/* Check when user is done typing in input field */
var typingTimer;
var interval1s = 1000;
var interval2s = 2000;

$('#prefix_us').keyup(function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingUs, interval1s);
});

$('#bio').keyup(function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingUs, interval1s);
});

$('#birthday').keyup(function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingUs, interval1s);
});

function submit_bday() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingUs, interval1s);
}

function submit_bday_clear() {
    submit_us_bdayclear();
}

function submit_color_clear() {
    submit_us_colorclear();
}

function submit_bg_clear() {
    submit_us_bgclear();
}

function submit_bday_guilds() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingUs, interval2s);
}

$('#prefix_gs').keyup(function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingGs, interval1s);
});

function submit_mod_roles() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingGs, interval2s);
}


function handle_delay(input) {
    input.value = input.value > 60 ? 60 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingAutoRole, interval1s);
}

function submit_auto_roles() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingAutoRole, interval2s);
}

function doneTypingUs() {
    submit_us();
}

function doneTypingGs() {
    submit_gs();
}

function doneTypingAutoRole() {
    submit_autorole();
}

$(document).ready(function () {
    circle_saved();

    $('#language_us').on('change', function () {
        submit_us();
    });

    $('#embedcolor').on('change', function () {
        submit_us();
    });

    $('#language_gs').on('change', function () {
        submit_gs();
    });

    $('#timezone').on('change', function () {
        submit_gs();
    });
});

// Level
function handle_level_speed() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submit_level, interval1s);
}

function handle_level(input) {
    input.value = input.value > 9999 ? 9999 : input.value < 1 ? 1 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submit_level, interval2s);
}

function handle_level_select() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submit_level, interval2s);
}

function submit_level() {
    let levels = [];
    let role_ids = [];

    $('.roles').each(function () {
        let level_value = $(this).find('[id^="level_"]').val();
        levels.push(level_value == "" ? "0" : level_value);
        let role_id_value = $(this).find('[id^="level_roles_"]').val().join("|");
        role_ids.push(role_id_value == "" ? "0" : role_id_value);
    });

    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/level',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            notification: $('#level-up-msg').is(':checked'),
            modifier: $('#level_speed').val(),
            levels: levels.join("$€%¥"),
            role_ids: role_ids.join("$€%¥")
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function (xhr, status, text) {
            if (xhr.status === 403) {
                $('#dismissible-item').addClass('dismiss');
            }

            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

function level_scale(input) {
    document.getElementById("scale_display").innerHTML = parseFloat(input.value).toFixed(2) + "x" + (input.value == 1 ? " (recommended)" : "");
}

var lr_max = 100;
var lr_ai = 1;
var lr_i = 1;

$(document).ready(function () {
    if (window.location.href.endsWith('level')) {
        lr_ai = $('.chosen-container').length;;
        lr_i = $('.chosen-container').length;;
    }
});

function add_level_role(thisdiv) {
    if (lr_ai >= lr_max) {
        alert('You have reached the limits!');
    } else {
        let html =
            '<div class="roles level">                                                                                                                         ' +
            '	<span class="delete-level-role" onclick="delete_level_role(this)"><i class="fas fa-times-circle"></i></span>                                                                                ' +
            '                                                                                                                                                  ' +
            '	<input type="number" id="level_' + lr_i + '" name="level_' + lr_i + '" placeholder="Level" min="1" max="9999" onkeyup="handle_level(this)" value="">                 ' +
            '                                                                                                                                                  ' +
            '	<select onchange="handle_level_select();" id="level_roles_' + lr_i + '" name="level_roles_' + lr_i + '" data-placeholder="Select roles..." multiple class="chosen-select">';

        botRoles.forEach(role => {
            if (role.name !== "@everyone") {
                html +=
                    '		<option style="color: #' + role.color.toString(16) + '" value="' + role.id + '">' + role.name + '</option>                                    ';
            }
        });

        html +=
            '	</select>                                                                                                                                      ' +
            '</div>                                                                                                                                            ';

        $("#level-roles").append(html);

        add_chosen();
        lr_ai++;
        lr_i++;
    }
}

function delete_level_role(thisspan) {
    thisspan.closest(".roles").remove();
    lr_ai--;
    submit_level();
}

// Livestream
function handle_livestream_select() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submit_livestream, interval2s);
}

function submit_livestream() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/livestream',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            public_mode: $('#livestream-public').is(':checked'),
            streamer_roles: $('#livestream-roles').val().join('|'),
            live_role: $('#livestream-role').val(),
            livestream_ping_role: $('#livestream_ping_role').val(),
            tc: $('#tc').val()
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Bday Select Icons
$(".chosen-select").chosen();

// Multiselect
$(".chosen-select").chosen({
    no_results_text: "Oops, nothing found!"
})

/* Autorole */
$(document).ready(function () {
    var max_fields = 10;
    var wrapper = $(".container1");
    var add_button = $(".add_form_field");

    var x = 1;

    $(add_button).click(function (e) {
        e.preventDefault();

        if ($('#role_10').length != 0) x = 11;
        else if ($('#role_9').length != 0) x = 10;
        else if ($('#role_8').length != 0) x = 9;
        else if ($('#role_7').length != 0) x = 8;
        else if ($('#role_6').length != 0) x = 7;
        else if ($('#role_5').length != 0) x = 6;
        else if ($('#role_4').length != 0) x = 5;
        else if ($('#role_3').length != 0) x = 4;
        else if ($('#role_2').length != 0) x = 3;
        else if ($('#role_1').length != 0) x = 2;

        if (x <= max_fields) {
            var roles_select = [];
            roles_select.push('<div class="roles">');
            roles_select.push('<a href="#" class="delete"><i class="fas fa-times-circle"></i></a>');
            roles_select.push('<select onchange="submit_auto_roles();" id="role_' + x + '" name="role_' + x + '" style="margin-left: 17px; margin-right:10px;">');
            roles_select.push('<option value="0" disabled selected>Select a role</option>');

            botRoles.forEach(role => {
                let colorcode = role.color === 0 ? "FFFFFF" : role.color.toString(16);

                if (role.name !== "@everyone") {
                    roles_select.push('<option value="' + role.id + '" style="color: #' + colorcode + '">')
                    roles_select.push(role.name)
                    roles_select.push('</option>')
                }
            });

            roles_select.push('</select>');
            roles_select.push('<input type="number" id="delay_' + x + '" name="delay_' + x + '" placeholder="delay (min)" onkeyup="handle_delay(this)" style="margin-left:5px;">');
            roles_select.push('</div>');
            $(wrapper).append(roles_select.join("")); //add input box
            x++;
        } else {
            alert('You reached the limits!')
        }
    });

    $(wrapper).on("click", ".delete", function (e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
        submit_autorole();
    });
});

/* Auto Role */
$(document).ready(function () {
    for (let i = 1; i <= 10; i++) {
        setColor(i);
    }

    $('select.role_1').change(function () {
        setColor(1);
    });
    $('select.role_2').change(function () {
        setColor(2);
    });
    $('select.role_3').change(function () {
        setColor(3);
    });
    $('select.role_4').change(function () {
        setColor(4);
    });
    $('select.role_5').change(function () {
        setColor(5);
    });
    $('select.role_6').change(function () {
        setColor(6);
    });
    $('select.role_7').change(function () {
        setColor(7);
    });
    $('select.role_8').change(function () {
        setColor(8);
    });
    $('select.role_9').change(function () {
        setColor(9);
    });
    $('select.role_10').change(function () {
        setColor(10);
    });
});

function setColor(pos) {
    var style = $('select.role_' + pos).find('option:selected').attr('style');
    if (style === undefined) return;
    var color = "#" + style.split("#")[1];
    color = color.substring(0, color.length - 1);
    $('select.role_' + pos).css('color', color);
}

/* Leaderboard Danger Area */
$(function () {
    $('#danger_mode').change(function () {
        var checked = $('#danger_mode').prop("checked");

        $('.delete-user-fake').toggle(checked);
        $('.delete-user').toggle(checked);
        $('#danger-area').toggle(checked);

        setCookie("danger-mode", checked, 1);
    });
});

$(document).ready(function () {
    if (typeof varIsAuthorized !== 'undefined') {
        var toggle = getCookie("danger-mode") === "true" ? true : false;
        if (!varIsAuthorized) toggle = false;
        $('#danger_mode').prop("checked", toggle);
        $('.delete-user-fake').toggle(toggle);
        $('.delete-user').toggle(toggle);
        $('#danger-area').toggle(toggle);
    }
});

function submit_reset_member(button) {
    if (confirm('Are you sure to reset this member?')) {
        let name_split = button.name.split("|");
        let guild_id = name_split[0];
        let user_id = name_split[1];

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/reset_member',
            dataType: 'html',
            data: {
                guild_id: guild_id,
                user_id: user_id
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, text) {
                if (xhr.status === 403)
                    $('#dismissible-item-forbidden').addClass('dismiss');
                else
                    $('#dismissible-item').addClass('dismiss');
            }
        });
    } else return;
}

function submit_reset_members(button) {
    if (confirm('Are you sure to reset ALL members?')) {
        let guild_id = button.name;

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/reset_members',
            dataType: 'html',
            data: {
                guild_id: guild_id
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, text) {
                if (xhr.status === 403)
                    $('#dismissible-item-forbidden').addClass('dismiss');
                else
                    $('#dismissible-item').addClass('dismiss');
            }
        });
    } else return;
}

function submit_prune_members(button) {
    if (confirm('Are you sure to reset gone members?')) {
        let guild_id = button.name;

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/prune_members',
            dataType: 'html',
            data: {
                guild_id: guild_id
            },
            success: function () {
                location.reload();
            },
            error: function (xhr, status, text) {
                if (xhr.status === 403)
                    $('#dismissible-item-forbidden').addClass('dismiss');
                else
                    $('#dismissible-item').addClass('dismiss');
            }
        });
    } else return;
}


// Text Channel
$(document).ready(function () {
    if ($('#tc').val() == 0 || $('#tc').val() == null) {
        $('#tc').css("color", "#858585");
    }

    if ($('#tc_list').val() == 0 || $('#tc_list').val() == null) {
        $('#tc_list').css("color", "#858585");
    }

    if ($('#livestream_ping_role').val() == 0 || $('#livestream_ping_role').val() == null) {
        $('#livestream_ping_role').css("color", "#858585");
    }
});

function changeTcSel(sel) {
    if (sel.value != '0') {
        sel.style.color = "#fff";
    } else {
        sel.style.color = "#858585";
    }
}

// Best of Image/Quote
// Best of Image/Quote - Emoji
var target = document.getElementById("emoji");
var emojiCount = emoji.length;
var default_emoji = '⭐';
var location_split = window.location.href.split('/');

// Best of Image
// Best of Image - Emoji
if (location_split[location_split.length - 1] == 'bestofimage') {
    if (bois.length > 0) default_emoji = bois[0].emoji;
}

// Best of Image - Submit
function handle_percentage_boi(input) {
    input.value = input.value > 100 ? 100 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfImage, interval1s);
}

function handle_flat_boi(input) {
    input.value = input.value > 500000 ? 500000 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfImage, interval1s);
}

function doneTypingBestOfImage() {
    submit_bestofimage();
}

function submit_bestofimage() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/bestofimage',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            percentage: $('#percentage').val(),
            flat: $('#flat').val(),
            tc_id: $('#tc').val(),
            emoji: $('#picker_0').find('.emoji').attr('alt')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Best of Quote
// Best of Quote - Emoji
if (location_split[location_split.length - 1] == 'bestofquote') {
    if (boqs.length > 0) default_emoji = boqs[0].emoji;
}

// Best of Quote - Submit
function handle_percentage_boq(input) {
    input.value = input.value > 100 ? 100 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfQuote, interval1s);
}

function handle_flat_boq(input) {
    input.value = input.value > 500000 ? 500000 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfQuote, interval1s);
}

function doneTypingBestOfQuote() {
    submit_bestofquote();
}
function submit_bestofquote() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/bestofquote',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            percentage: $('#percentage').val(),
            flat: $('#flat').val(),
            tc_id: $('#tc').val(),
            emoji: $('#picker_0').find('.emoji').attr('alt')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Best of Image/Quote - Emoji
let plugin_name = location_split[location_split.length - 1];
if (plugin_name == 'bestofquote'
    || plugin_name == 'bestofimage'
    || plugin_name == 'reactionrole') {
    for (var index = 0; index < emojiCount; index++) {
        // addEmoji(emoji[index], default_emoji, plugin_name);
    }
}

function addEmoji(i_emoji, default_emoji, plugin_name) {
    var option = document.createElement('option');
    option.innerHTML = i_emoji;

    if (default_emoji === i_emoji && plugin_name != 'reactionrole') {
        option.selected = true;
    }

    target.appendChild(option);
}

// Join
function handle_join_msg(input) {
    input.value = input.value > 2048 ? 2048 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingJoin, interval1s);
}

function doneTypingJoin() {
    submit_join();
}

function submit_join() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/join',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            join_msg: $('#join_msg').val(),
            tc_id: $('#tc').val()
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Leave
function handle_leave_msg(input) {
    input.value = input.value > 2048 ? 2048 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingLeave, interval1s);
}

function doneTypingLeave() {
    submit_leave();
}

function submit_leave() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/leave',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            leave_msg: $('#leave_msg').val(),
            tc_id: $('#tc').val()
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Embed
$('#form_embed').submit(function (e) {
    e.preventDefault();

    let field_titles = [];
    let field_descriptions = [];
    let field_inlines = [];

    $('.embed-field-i').each(function () {
        field_titles.push($(this).find('[id^="embed-field-title-create"]').val());
        field_descriptions.push($(this).find('[id^="embed-field-description-create"]').val());
        field_inlines.push($(this).attr('class').split(/\s+/)[1]);
    });

    console.log(field_titles)

    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/embed',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            tc_id: $('#tc').val(),
            color: $('#color-picker-create').val(),
            author_icon: $('#embed-author-icon-create').attr('src'),
            author_name: $('#embed-author-name-create').val(),
            author_link: $('#embed-author-link-create').val(),
            thumbnail: $('#embed-thumbnail-create').attr('src'),
            title: $('#embed-title-create').val(),
            title_link: $('#embed-title-link-create').val(),
            description: $('#embed-description-create').val(),

            field_titles: field_titles.join("$€%¥"),
            field_descriptions: field_descriptions.join("$€%¥"),
            field_inlines: field_inlines.join("$€%¥"),

            image: $('#embed-image-create').attr('src'),
            footer_icon: $('#embed-footer-icon-create').attr('src'),
            footer_text: $('#embed-footer-text-create').val(),
            timestamp: $('#embed-timestamp-create').val()
        },
        success: function () {
            $('#dismissible-item-success').addClass('dismiss');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 406:
                    $('#dismissible-item-error-permission').addClass('dismiss');
                    break;

                case 403:
                    $('#dismissible-item-error-tc').addClass('dismiss');
                    break;

                case 500:
                    $('#dismissible-item-error').addClass('dismiss');
                    break;
            }
        }
    });
});

// Logs
function handle_log_checks() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingLog, interval1s);
}

function doneTypingLog() {
    submit_log();
}

function submit_log() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/log',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            tc_id: $('#tc').val(),
            msg_update: $('#msg_update').is(':checked'),
            msg_delete: $('#msg_delete').is(':checked'),
            category_create: $('#category_create').is(':checked'),
            category_delete: $('#category_delete').is(':checked'),
            vc_create: $('#vc_create').is(':checked'),
            vc_delete: $('#vc_delete').is(':checked'),
            vc_join: $('#vc_join').is(':checked'),
            vc_move: $('#vc_move').is(':checked'),
            vc_leave: $('#vc_leave').is(':checked'),
            tc_create: $('#tc_create').is(':checked'),
            tc_delete: $('#tc_delete').is(':checked'),
            user_ban: $('#user_ban').is(':checked'),
            user_unban: $('#user_unban').is(':checked'),
            invite_create: $('#invite_create').is(':checked'),
            invite_delete: $('#invite_delete').is(':checked'),
            user_join: $('#user_join').is(':checked'),
            user_leave: $('#user_leave').is(':checked'),
            role_add: $('#role_add').is(':checked'),
            role_remove: $('#role_remove').is(':checked'),
            role_create: $('#role_create').is(':checked'),
            role_delete: $('#role_delete').is(':checked'),
            emote_add: $('#emote_add').is(':checked'),
            emote_remove: $('#emote_remove').is(':checked'),
            boost_count: $('#boost_count').is(':checked'),
            boost_tier: $('#boost_tier').is(':checked')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Media-only Channels
function submit_mediaonlychannel() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/mediaonlychannel',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            moc_warning: $('#moc_warning').is(':checked'),
            moc: $('#moc_channels').val().join('|')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Reaction roles

// Voice Lobbies
function submit_voicelobby() {
    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/voicelobby',
        dataType: 'html',
        data: {
            guild_id: $('#guild_id').val(),
            lobbies: $('#lobby_channels').val().join('|')
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

/* URLs */
function isValidHttpUrl(string) {
    let url;

    try {
        url = new URL(string);
    } catch (_) {
        return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
}

function isValidDirectLink(url) {
    let lastQm = url.lastIndexOf("?");
    if (lastQm > 0) url = url.substring(0, lastQm);
    return (url.match(/\.(jpeg|jpg|gif|png)$/) != null);
}

// Global Embed & RR Variables
var max_fields = 25;
var fields;
var field_ai;

/* Embed */
function getDirektLink() {
    let url = prompt('Enter image URL (direkt link!)');

    if (url && isValidHttpUrl(url) && isValidDirectLink(url)) return url;
    else return null;
}

$(document).ready(function () {
    if (window.location.href.endsWith('embed')) {
        var color_picker = document.getElementById("color-picker-create");
        var color_picker_wrapper = document.getElementById("color-picker-wrapper-create");
        color_picker.onchange = function () {
            color_picker_wrapper.style.backgroundColor = color_picker.value;
        }
        color_picker_wrapper.style.backgroundColor = color_picker.value;

        fields = 1;
        field_ai = 1;
    }
});

// Embed & RR
function add_field_inline_create() {
    if (fields <= max_fields) {
        let html = '<div class="embed-field-i inline">' +
            '<div class="embed-inline-field-title">' +
            '<input type="text" name="embed-inline-field-title" id="embed-field-title-create-' + field_ai + '" placeholder="Inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-inline-field-description">' +
            '<textarea name="embed-inline-field-description" id="embed-field-description-create-' + field_ai + '" placeholder="Inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-create" type="button" id="delete-field-create-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_create(this);" />' +
            '</div>';

        $("#embed-fields-create").append(html);

        fields++;
        field_ai++;
    } else {
        alert('You reached the limits!')
    }
}

function add_field_non_inline_create() {
    if (fields <= max_fields) {
        let html = '<div class="embed-field-i non-inline">' +
            '<div class="embed-non-inline-field-title">' +
            '<input type="text" name="embed-non-inline-field-title" id="embed-field-title-create-' + field_ai + '" placeholder="Non-inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-non-inline-field-description">' +
            '<textarea name="embed-non-inline-field-description" id="embed-field-description-create-' + field_ai + '" placeholder="Non-inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-create" type="button" id="delete-field-create-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_create(this);" />' +
            '</div>';

        $("#embed-fields-create").append(html);

        fields++;
        field_ai++;
    } else {
        alert('You reached the limits!')
    }
}

function delete_field_create(delete_button) {
    delete_button.closest('.embed-field-i').remove();
    fields--;
}

function add_thumb_create(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-thumbnail').remove();

        let html = '<div class="embed-thumbnail">' +
            '<a onclick="add_thumb(this);" class="thumb">' +
            '<img src="' + url + '" id="embed-thumbnail-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-thumbnail-create" name="delete-thumbnail" value="x" onclick="delete_thumb_create(this);" />' +
            '</div>';

        $('.embed-thumbnail-wrapper-create').append(html);
    }
}

function delete_thumb_create(delete_button) {
    delete_button.closest('.embed-thumbnail').remove();

    let html = '<div class="embed-thumbnail">' +
        '<input class="btn-redirect empty" type="button" id="add-thumbnail-create" name="add-thumbnail" value="+ Thumbnail" onclick="add_thumb_create(this);" />' +
        '</div>';

    $('.embed-thumbnail-wrapper-create').append(html);
};

function add_img_create(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-image').remove();

        let html = '<div class="embed-image">' +
            '<a onclick="add_img(this);" class="img">' +
            '<img src="' + url + '" id="embed-image-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-img-create" name="delete-img" value="x" onclick="delete_img_create(this);" />' +
            '</div>';

        $('.embed-image-wrapper-create').append(html);
    }
}

function delete_img_create(delete_button) {
    delete_button.closest('.embed-image').remove();

    let html = '<div class="embed-image">' +
        '<input class="btn-redirect empty" type="button" id="add-img-create" name="add-img" value="+ Image" onclick="add_img_create(this);" />' +
        '</div>';

    $('.embed-image-wrapper-create').append(html);
};

function add_author_icon_create(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-author-icon').remove();

        let html = '<div class="embed-author-icon">' +
            '<a onclick="add_author_icon(this);">' +
            '<img src="' + url + '" id="embed-author-icon-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-author-icon-create" name="delete-author-icon" value="x" onclick="delete_author_icon_create(this);" />' +
            '</div>';

        $('.embed-author-icon-wrapper-create').append(html);
    }
}

function delete_author_icon_create(delete_button) {
    delete_button.closest('.embed-author-icon').remove();

    let html = '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-create" name="add-author-icon" value="+" onclick="add_author_icon_create(this);" />' +
        '</div>';

    $('.embed-author-icon-wrapper-create').append(html);
};

function add_author_create(add_button) {
    add_button.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<div class="embed-author-left">' +
        '<div class="embed-author-icon-wrapper-create">' +
        '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-create" name="add-author-icon" value="+" onclick="add_author_icon_create(this);" />' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="embed-author-right">' +
        '<span class="embed-author-name">' +
        '<input type="text" name="embed-author-name" id="embed-author-name-create" placeholder="Author Name" maxlength="256" required />' +
        '</span>' +

        '<div class="embed-author-link">' +
        '<input type="url" name="embed-author-link" id="embed-author-link-create" placeholder="Author Name URL" maxlength="5000" />' +
        '</div>' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-author-create" name="delete-author" value="x" onclick="delete_author_create(this);" />' +
        '</div>';

    $('.embed-author-wrapper-create').append(html);
}

function delete_author_create(delete_button) {
    delete_button.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-author-create" name="add-embed-author" value="+ Author" onclick="add_author_create(this);" />' +
        '</div>';

    $('.embed-author-wrapper-create').append(html);
};

function add_title_create(add_button) {
    add_button.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input type="text" name="embed-title" id="embed-title-create" placeholder="Title" maxlength="256" required />' +

        '<div class="embed-title-link">' +
        '<input type="url" name="embed-title-link" id="embed-title-link-create" placeholder="Title URL" />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-title-create" name="delete-title" value="x" onclick="delete_title_create(this);" />' +
        '</div>';

    $('.embed-title-wrapper-create').append(html);
}

function delete_title_create(delete_button) {
    delete_button.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-title-create" name="add-embed-title" value="+ Title" onclick="add_title_create(this);" />' +
        '</div>';

    $('.embed-title-wrapper-create').append(html);
};

function add_description_create(add_button) {
    add_button.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<textarea name="embed-description" id="embed-description-create" placeholder="Description" maxlength="2048" required></textarea>' +
        '<input class="btn-redirect empty" type="button" id="delete-description-create" name="delete-description" value="x" onclick="delete_description_create(this);" />' +
        '</div>';

    $('.embed-description-wrapper-create').append(html);
}

function delete_description_create(delete_button) {
    delete_button.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-description-create" name="add-embed-description" value="+ Description" onclick="add_description_create(this);" />' +
        '</div>';

    $('.embed-description-wrapper-create').append(html);
};

function add_footer_create(add_button) {
    add_button.closest('.embed-footer').remove();

    let html = '<div class="embed-footer-used">' +
        '<div class="embed-footer-icon-wrapper-create">' +
        '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-create" name="add-footer-icon" value="+" onclick="add_footer_icon_create(this);" />' +
        '</div>' +
        '</div>' +

        '<div class="embed-footer-text">' +
        '<input type="text" name="embed-footer-text" id="embed-footer-text-create" placeholder="Footer" maxlength="2048" required />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-footer-create" name="delete-footer" value="x" onclick="delete_footer_create(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-create').append(html);
}

function delete_footer_create(delete_button) {
    delete_button.closest('.embed-footer-used').remove();

    let html = ' <div class="embed-footer">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-footer-create" name="add-embed-footer" value="+ Footer" onclick="add_footer_create(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-create').append(html);
};

function add_footer_icon_create(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-footer-icon').remove();

        let html = '<div class="embed-footer-icon">' +
            '<a onclick="add_footer_icon(this);">' +
            '<img src="' + url + '" id="embed-footer-icon-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-create" name="delete-footer-icon" value="x" onclick="delete_footer_icon_create(this);" />' +
            '</div>';

        $('.embed-footer-icon-wrapper-create').append(html);
    }
}

function delete_footer_icon_create(delete_button) {
    delete_button.closest('.embed-footer-icon').remove();

    let html = '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-create" name="add-footer-icon" value="+" onclick="add_footer_icon_create(this);" />' +
        '</div>';

    $('.embed-footer-icon-wrapper-create').append(html);
};

function add_timestamp_create(add_button) {
    add_button.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input type="datetime-local" name="embed-timestamp" id="embed-timestamp-create" />' +
        '<input class="btn-redirect empty" type="button" id="delete-timestamp-create" name="delete-timestamp" value="x" onclick="delete_timestamp_create(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-create').append(html);
}

function delete_timestamp_create(delete_button) {
    delete_button.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-timestamp-create" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_create(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-create').append(html);
};

// RR Create
function open_modal_create() {
    if (varRrAmount < 20) {
        rr = 0;
        rr_ai = 0;
        curr_ai = 0;

        fields = 1;
        field_ai = 1;

        let html =
            '<div id="reactionrole-modal-create" class="modal">                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ' +
            '    <!-- Modal content -->                                                                                                                                                                                 ' +
            '    <div class="modal-content">                                                                                                                                                                            ' +
            '        <span id="close_create" class="close" onclick="close_modal(this);">&times;</span>                                                                                                                                             ' +
            '                                                                                                                                                                                                           ' +
            '        <form action="/submit/reactionrole_create" method="POST" id="form_reactionroles_create">                                                                                                                  ' +
            '            <div id="dismissible-item-error-create" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>                                                          ' +
            '            <div id="dismissible-item-error-permission" data-component="dismissible-item" data-type="error" data-value="I cannot write in that text channel."></div>                                                        ' +
            '            <div id="dismissible-item-error-tc" data-component="dismissible-item" data-type="error" data-value="I cannot find that text channel."></div>' +
            '                                                                                                                                                                                                           ' +
            '            <div class="embed-warning">                                                                                                                                                                    ' +
            '                If you refresh or quit the page, your progress will be lost!                                                                                                                               ' +
            '            </div>                                                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ' +
            '            <div class="container small dark">                                                                                                                                                             ' +
            '                <div class="padding-top padding-bottom padding-left padding-right">                                                                                                                        ' +
            '                    <div class="settings-disclaimer embed tc">                                                                                                                                             ' +
            '                        <div>This is the text channel the embed message will be posted in.</div>                                                                                                           ' +
            '                        <br />                                                                                                                                                                             ' +
            '                        <div class="form-group embed">                                                                                                                                                     ' +
            '                            <select id="tc-create" name="tc" onchange="changeTcSel(this);" required>                                                                                                       ' +
            '                                <option value="" selected disabled>Please select a text channel</option>                                                                                                   ';


        var_channels.forEach(channel => {
            if ((channel.type === 'text' || channel.type === 'news') && channel.viewable) {
                html +=
                    '                                <option value="' + channel.id + '">#' + channel.name + (channel.parent_name ? ' (' + channel.parent_name + ')' : '') + '</option>                                                                               ';
            }
        });

        html +=
            '                            </select>                                                                                                                                                                      ' +
            '                            <label for="tc" class="control-label">Text Channel</label><i class="bar"></i>                                                                                                  ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                </div>                                                                                                                                                                                     ' +
            '            </div>                                                                                                                                                                                         ';

        let disabled = var_is_supporter ? '' : 'disabled';

        html +=
            '            <div class="embed-field">                                                                                                                                                                      ';

        if (!var_is_supporter) {
            html +=
                '                <div class="supporter-tooltip">                                                                                                                                                           ' +
                '                    <a href="/donate">                                                                                                                                                                     ' +
                '                        <span class="supporter-tooltip-wrapper">                                                                                                                                           ' +
                '                            <span class="supporter-tooltiptext">                                                                                                                                           ' +
                '                                <h3>Embed Colours</h3>                                                                                                                                                     ' +
                '                                <h3>Become a supporter</h3>                                                                                                                                                ' +
                '                                <img src="/images/become_supporter.png" alt="Supporter">                                                                                                                   ' +
                '                            </span>                                                                                                                                                                        ' +
                '                        </span>                                                                                                                                                                            ' +
                '                    </a>                                                                                                                                                                                   ';
        }

        html +=
            '                    <div id="color-picker-wrapper-create">                                                                                                                                                 ';

        let color = var_color_code.length > 0 ? (var_color_code[0] ? var_color_code[0].color_code : '#7289da') : '#7289da';

        html +=
            '                        <input name="color-picker" type="color" value="' + color + '" id="color-picker-create" ' + disabled + '>                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ';

        if (!var_is_supporter) {
            html +=
                '                </div>                                                                                                                                                                                     ';
        }

        html +=
            '                                                                                                                                                                                                           ' +
            '                <div class="embed-content">                                                                                                                                                                ' +
            '                    <div class="embed-author-wrapper-create">                                                                                                                                              ' +
            '                        <div class="embed-author">                                                                                                                                                         ' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-author-create" name="add-embed-author" value="+ Author" onclick="add_author_create(this);" />                    ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-thumbnail-wrapper-create">                                                                                                                                           ' +
            '                        <div class="embed-thumbnail">                                                                                                                                                      ' +
            '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-create" name="add-thumbnail" value="+ Thumbnail" onclick="add_thumb_create(this);" />                        ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-title-wrapper-create">                                                                                                                                               ' +
            '                        <div class="embed-title">                                                                                                                                                          ' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-title-create" name="add-embed-title" value="+ Title" onclick="add_title_create(this);" />                        ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-description-wrapper-create">                                                                                                                                         ' +
            '                        <div class="embed-description">                                                                                                                                                    ' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-description-create" name="add-embed-description" value="+ Description" onclick="add_description_create(this);" />' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="add-buttons">                                                                                                                                                              ' +
            '                        <div class="btn-redirect empty rr" id="add-inline-field-create" name ="add-inline-field" onclick="add_field_inline_create();">+ Inline Field</div>                                 ' +
            '                        <div class="btn-redirect empty rr" id="add-non-inline-field-create" name ="add-non-inline-field" onclick="add_field_non_inline_create();">+ Non-inline Field</div>                 ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                    <div id="embed-fields-create"></div>                                                                                                                                                   ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-image-wrapper-create">                                                                                                                                               ' +
            '                        <div class="embed-image">                                                                                                                                                          ' +
            '                            <input class="btn-redirect empty" type="button" id="add-image-create" name="add-image" value="+ Image" onclick="add_img_create(this);" />                                      ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-complete-footer-wrapper-create">                                                                                                                                     ' +
            '                        <div class="embed-footer-wrapper-create">                                                                                                                                          ' +
            '                            <div class="embed-footer">                                                                                                                                                     ' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-create" name="add-embed-footer" value="+ Footer" onclick="add_footer_create(this);" />                ' +
            '                            </div>                                                                                                                                                                         ' +
            '                        </div>                                                                                                                                                                             ' +
            '                                                                                                                                                                                                           ' +
            '                        <div class="embed-divider">|</div>                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                        <div class="embed-timestamp-wrapper-create">                                                                                                                                       ' +
            '                            <div class="embed-timestamp">                                                                                                                                                  ' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-create" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_create(this);" />    ' +
            '                            </div>                                                                                                                                                                         ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                </div>                                                                                                                                                                                     ' +
            '            </div>                                                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ' +
            '            <div class="container small dark">                                                                                                                                                             ' +
            '                <div class="padding-top padding-bottom padding-left padding-right">                                                                                                                        ' +
            '                    <div class="reaction-role">                                                                                                                                                            ' +
            '                        <div>Set up at least one emoji that will provide at least one role.</div>                                                                                                          ' +
            '                        <br />                                                                                                                                                                             ' +
            '                        <div class="btn-redirect empty center-button" onclick="add_reaction_role();">+ Add</div>                                                                                           ' +
            '                        <!-- Here, we will paste in emoji + role -->                                                                                                                                       ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                </div>                                                                                                                                                                                     ' +
            '            </div>                                                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ' +
            '            <!-- to include it in url params -->                                                                                                                                                           ' +
            '            <input type="hidden" id="guild_id-create" name="guild_id" value="' + var_guild.id + '" />                                                                                                           ' +
            '                                                                                                                                                                                                           ' +
            '            <div class="center-button">                                                                                                                                                                    ' +
            '                <button type="submit" class="btn-redirect center-button margin-top">Create Message</button>                                                                                                ' +
            '            </div>                                                                                                                                                                                         ' +
            '        </form>                                                                                                                                                                                            ' +
            '    </div>                                                                                                                                                                                                 ' +
            '</div>                                                                                                                                                                                                     ';

        $('#modals-wrapper').append(html);

        refreshDismissibles(window);

        // Add script for color picker
        var color_picker = document.getElementById("color-picker-create");
        var color_picker_wrapper = document.getElementById("color-picker-wrapper-create");
        color_picker.onchange = function () {
            color_picker_wrapper.style.backgroundColor = color_picker.value;
        }
        color_picker_wrapper.style.backgroundColor = color_picker.value;

        $('#form_reactionroles_create').on("submit", function (e) {
            e.preventDefault();

            let field_titles = [];
            let field_descriptions = [];
            let field_inlines = [];

            $('.embed-field-i').each(function () {
                field_titles.push($(this).find('[id^="embed-field-title-create"]').val());
                field_descriptions.push($(this).find('[id^="embed-field-description-create"]').val());
                field_inlines.push($(this).attr('class').split(/\s+/)[1]);
            });

            let emojis = [];
            let roles = [];

            $('.settings-disclaimer').each(function () {
                if (!$(this).attr('class').includes('tc')) {
                    emojis.push($(this).find('.emoji').attr('alt'));
                    roles.push($(this).find('.chosen-select').val().join("|"));
                }
            });

            $.ajax({
                global: false,
                type: 'POST',
                url: '/submit/reactionrole_create',
                dataType: 'html',
                data: {
                    guild_id: $('#guild_id-create').val(),

                    tc_id: $('#tc-create').val(),

                    color: $('#color-picker-create').val(),
                    author_icon: $('#embed-author-icon-create').attr('src'),
                    author_name: $('#embed-author-name-create').val(),
                    author_link: $('#embed-author-link-create').val(),
                    thumbnail: $('#embed-thumbnail-create').attr('src'),
                    title: $('#embed-title-create').val(),
                    title_link: $('#embed-title-link-create').val(),
                    description: $('#embed-description-create').val(),

                    field_titles: field_titles.join("$€%¥"),
                    field_descriptions: field_descriptions.join("$€%¥"),
                    field_inlines: field_inlines.join("$€%¥"),

                    image: $('#embed-image-create').attr('src'),
                    footer_icon: $('#embed-footer-icon-create').attr('src'),
                    footer_text: $('#embed-footer-text-create').val(),
                    timestamp: $('#embed-timestamp-create').val(),

                    emojis: emojis.join("$€%¥"),
                    roles: roles.join("$€%¥")
                },
                success: function () {
                    location.reload();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    switch (xhr.status) {
                        case 406:
                            $('#dismissible-item-error-permission').addClass('dismiss');
                            break;

                        case 403:
                            $('#dismissible-item-error-tc').addClass('dismiss');
                            break;

                        case 500:
                            $('#dismissible-item-error-create').addClass('dismiss');
                            break;
                    }
                }
            });
        });
    } else {
        alert("You have reached the limits of 20 reaction role messages!");
    }
}

// Close modal
function close_modal(element) {
    element.closest('.modal').remove();
}

/* Twemoji */
$(document).ready(function () {
    twemoji.parse(document.body);

    let plugin_name = location_split[location_split.length - 1];
    if (plugin_name == 'bestofimage') {
        add_picker_listener_boi();
    } else if (plugin_name == 'bestofquote') {
        add_picker_listener_boq();
    }
});

function add_picker_listener_boi() {
    $("#picker_0").lsxEmojiPicker({
        closeOnSelect: true,
        twemoji: true,
        onSelect: function (emoji) {
            $("#picker_0").html(emoji.value);
            twemoji.parse(document.getElementById("picker_0"));
            add_picker_listener_boi();
            submit_bestofimage();
        }
    })
}

function add_picker_listener_boq() {
    $("#picker_0").lsxEmojiPicker({
        closeOnSelect: true,
        twemoji: true,
        onSelect: function (emoji) {
            $("#picker_0").html(emoji.value);
            twemoji.parse(document.getElementById("picker_0"));
            add_picker_listener_boi();
            submit_bestofquote();
        }
    })
}

function add_picker_listener(id) {
    $("#" + id).lsxEmojiPicker({
        closeOnSelect: true,
        twemoji: true,
        onSelect: function (emoji) {
            $("#" + curr_id).html(emoji.value);
            twemoji.parse(document.getElementById(curr_id));
            add_picker_listener(curr_id);
        }
    })
}

function add_chosen() {
    $(".chosen-select").chosen();
    $(".chosen-select").chosen({
        no_results_text: "Oops, nothing found!"
    })
}

function add_on_click() {
    $('.picker').on('click', function () {
        curr_id = $(this).attr('id');
    })
}

/* Reaction Role */
var max_rr = 20;
var rr = 0;
var rr_ai = 0;
var curr_id;

function add_reaction_role() {
    if (rr >= max_rr) {
        alert("You've reached the limits of 20 reactions!")
    } else {
        let options = [];
        botRoles.forEach(role => {
            if (role.name !== '@everyone') {
                let colorcode = role.color === 0 ? "FFFFFF" : role.color.toString(16);
                options.push('<option value="' + role.id + '" style="color: #' + colorcode + '">' + role.name + '</option>')
            }
        });
        let id = 'picker_' + rr_ai;
        let html =
            '<div class="settings-disclaimer">' +
            '<br />' +
            '<div class="reaction-role-groups">' +
            '<div class="form-group">' +
            '<div class="picker" id="' + id + '">&#x1f44d</div>' +
            '<div class="picker-label">Emoji</div>' +
            '</div>' +

            '<div class="form-group embed">' +
            '<select name="rr_roles"  data-placeholder="Select roles..." multiple class="chosen-select">' + options.join("") + '</select>' +
            '<label for="tc" class="control-label">Role(s)</label><i class="bar"></i>' +
            '</div>' +

            '<div class="remove-rr" onclick="remove_rr(this);">' +
            '<img src="/images/close.png" alt="Remove">' +
            '</div>' +
            '</div>' +
            '</div>';

        $('.reaction-role').append(html);
        let element = document.getElementById(id);
        twemoji.parse(element);
        add_picker_listener(id);
        add_chosen();
        add_on_click();

        rr++;
        rr_ai++;
    }
}

function remove_rr(dis) {
    dis.closest('.settings-disclaimer').remove();
    rr--;
}

function delete_rr(button) {
    if (confirm('Are you sure to delete this reaction role message?')) {
        let name_split = button.name.split("|");
        let guild_id = name_split[0];
        let tc_id = name_split[1];
        let msg_id = name_split[2];

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/delete_reactionrole',
            dataType: 'html',
            data: {
                guild_id: guild_id,
                tc_id: tc_id,
                msg_id: msg_id
            },
            success: function () {
                location.reload();
            },
            error: function () {
                $('#dismissible-item').addClass('dismiss');
            }
        });
    } else return;
}

// RR Edit
function open_modal_edit(button) {
    var tc_id;
    var msg_id;

    var colorcode;
    var author_name;
    var author_url;
    var author_icon_url;
    var title;
    var title_url;
    var thumbnail_url;
    var description;
    var image_url;
    var footer;
    var footer_icon_url;

    var l_fields = [];

    var rr_map = new Map();

    if (var_rr_msgs.length > 0) {
        var_rr_msgs.forEach(rr_msg => {
            if (rr_msg.msg_id == button.name) {
                tc_id = rr_msg.tc_id;
                msg_id = rr_msg.msg_id;
                colorcode = rr_msg.colorcode;
                author_name = rr_msg.author_name;
                author_url = rr_msg.author_url;
                author_icon_url = rr_msg.author_icon_url;
                title = rr_msg.title;
                title_url = rr_msg.title_url;
                thumbnail_url = rr_msg.thumbnail_url;
                description = rr_msg.description;
                image_url = rr_msg.image_url;
                footer = rr_msg.footer;
                footer_icon_url = rr_msg.footer_icon_url;

                rr = 0;
                rr_ai = 0;
                curr_ai = 0;

                fields = 1;
                field_ai = 1;

                if (var_rr_fields.length > 0) {
                    let i = 0;
                    var_rr_fields.forEach(rr_field => {
                        if (i < 25 && rr_field.msg_id == rr_msg.msg_id) {
                            l_fields.push({
                                title: rr_field.title,
                                description: rr_field.description,
                                inline: rr_field.inline
                            });

                            i++;
                        }
                    });
                }

                if (var_rr_roles_emojis.length > 0) {
                    var_rr_roles_emojis.forEach(rr_roles_emoji => {
                        if (rr_map.size < 20 && rr_roles_emoji.msg_id == rr_msg.msg_id) {
                            const emoji = rr_roles_emoji.emoji;
                            const role = rr_roles_emoji.role_id;

                            if (rr_map.has(emoji)) {
                                rr_map.set(emoji, rr_map.get(emoji) + '|' + role);
                            } else {
                                rr_map.set(emoji, role);
                            }
                        }
                    })
                }

                // Start of modal
                let html =
                    '<div id="reactionrole-modal-edit" class="modal">                                                                                                                                                       ' +
                    '                                                                                                                                                                                                       ' +
                    '    <!-- Modal content -->                                                                                                                                                                             ' +
                    '    <div class="modal-content">                                                                                                                                                                        ' +
                    '        <span id="close_edit" class="close" onclick="close_modal(this);">&times;</span>                                                                                                                                             ' +
                    '                                                                                                                                                                                                       ' +
                    '        <form action="/submit/reactionrole_edit" method="POST" id="form_reactionroles_edit">                                                                                                                ' +
                    '            <div id="dismissible-item-error-edit" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>                                                        ' +
                    '            <div id="dismissible-item-error-permission" data-component="dismissible-item" data-type="error" data-value="I cannot write in that text channel."></div>                                                        ' +
                    '            <div id="dismissible-item-error-tc" data-component="dismissible-item" data-type="error" data-value="I cannot find that text channel."></div>' +
                    '                                                                                                                                                                                                       ' +
                    '            <div class="embed-warning">                                                                                                                                                                ' +
                    '                If you refresh or quit the page, your progress will be lost!                                                                                                                           ' +
                    '            </div>                                                                                                                                                                                     ' +
                    '                                                                                                                                                                                                       ' +
                    '            <div class="container small dark">                                                                                                                                                         ' +
                    '                <div class="padding-top padding-bottom padding-left padding-right">                                                                                                                    ' +
                    '                    <div class="settings-disclaimer embed tc">                                                                                                                                         ' +
                    '                        <div>It is not possible to change the text channel of an already posted message.</div>                                                                                                       ' +
                    '                        <br />                                                                                                                                                                         ' +
                    '                        <div class="form-group embed">                                                                                                                                                 ' +

                    '                            <select id="tc-edit" name="tc" onchange="changeTcSel(this);" required disabled>                                                                                                     ' +
                    '                                <option value="" disabled>Please select a text channel</option>                                                                                   ';

                // Text channel options
                var_channels.forEach(channel => {
                    if ((channel.type === 'text' || channel.type === 'news') && channel.viewable) {
                        html +=
                            '                                <option value="' + channel.id + '">#' + channel.name + (channel.parent_name ? ' (' + channel.parent_name + ')' : '') + '</option>                                                                               ';
                    }
                });

                html +=
                    '                            </select>                                                                                                                                                                  ' +
                    '                            <label for="tc" class="control-label">Text Channel</label><i class="bar"></i>                                                                                              ' +
                    '                        </div>                                                                                                                                                                         ' +
                    '                    </div>                                                                                                                                                                             ' +
                    '                </div>                                                                                                                                                                                 ' +
                    '            </div>                                                                                                                                                                                     ' +
                    '                                                                                                                                                                                                       ' +
                    '            <div class="embed-field">                                                                                                                                                                  ';

                // Non-supporter tooltip
                let disabled = var_is_supporter ? "" : "disabled";

                if (!var_is_supporter) {
                    html +=
                        '                <div class=" supporter-tooltip">                                                                                                                                                       ' +
                        '                    <a href="/donate">                                                                                                                                                                 ' +
                        '                        <span class="supporter-tooltip-wrapper">                                                                                                                                       ' +
                        '                            <span class="supporter-tooltiptext">                                                                                                                                       ' +
                        '                                <h3>Embed Colours</h3>                                                                                                                                                 ' +
                        '                                <h3>Become a supporter</h3>                                                                                                                                            ' +
                        '                                <img src="/images/become_supporter.png" alt="Supporter">                                                                                                               ' +
                        '                            </span>                                                                                                                                                                    ' +
                        '                        </span>                                                                                                                                                                        ' +
                        '                    </a>                                                                                                                                                                               ';

                }

                // Color picker
                html +=
                    '                    <div id="color-picker-wrapper-edit">                                                                                                                                               ' +
                    '                        <input name="color-picker" type="color" value="' + colorcode + '" id="color-picker-edit" ' + disabled + '>                                                                           ' +
                    '                    </div>                                                                                                                                                                             ' +
                    '                                                                                                                                                                                                       ';

                // Closing non-supporter tooltip
                if (!var_is_supporter) {
                    html +=
                        '                </div>                                                                                                                                                                                 ';
                }

                // Embed content
                html +=
                    '                                                                                                                                                                                                       ' +
                    '                <div class="embed-content">                                                                                                                                                            ';


                // Author
                html +=
                    '                    <div class="embed-author-wrapper-edit">                                                                                                                                            ';

                if (author_name) {
                    html +=
                        '<div class="embed-author">' +
                        '<div class="embed-author-left">' +
                        '<div class="embed-author-icon-wrapper-edit">';

                    // Author Icon
                    if (author_icon_url) {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<a onclick="add_author_icon(this);">' +
                            '<img src="' + author_icon_url + '" id="embed-author-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-author-icon-edit" name="delete-author-icon" value="x" onclick="delete_author_icon_edit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="add_author_icon_edit(this);" />' +
                            '</div>';
                    }

                    // Author Name & Url
                    html +=
                        '</div>' +
                        '</div>' +

                        '<div class="embed-author-right">' +
                        '<span class="embed-author-name">' +
                        '<input value="' + author_name + '" type="text" name="embed-author-name" id="embed-author-name-edit" placeholder="Author Name" maxlength="256" required />' +
                        '</span>' +

                        '<div class="embed-author-link">' +
                        '<input value="' + author_url + '" type="url" name="embed-author-link" id="embed-author-link-edit" placeholder="Author Name URL" maxlength="5000" />' +
                        '</div>' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-author-edit" name="delete-author" value="x" onclick="delete_author_edit(this);" />' +
                        '</div>';
                } else {
                    // Author add button
                    html +=

                        '                        <div class="embed-author">                                                                                                                                                     ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-author-edit" name="add-embed-author" value="+ Author" onclick="add_author_edit(this);" />                    ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Thumbnail
                html +=
                    '                    <div class="embed-thumbnail-wrapper-edit">                                                                                                                                         ';

                if (thumbnail_url) {
                    html +=
                        '<div class="embed-thumbnail">' +
                        '<a onclick="add_thumb(this);" class="thumb">' +
                        '<img src="' + thumbnail_url + '" id="embed-thumbnail-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-thumbnail-edit" name="delete-thumbnail" value="x" onclick="delete_thumb_edit(this);" />' +
                        '</div>';
                } else {
                    html +=

                        '                        <div class="embed-thumbnail">                                                                                                                                                  ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-edit" name="add-thumbnail" value="+ Thumbnail" onclick="add_thumb_edit(this);" />                        ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Title
                html +=
                    '                    <div class="embed-title-wrapper-edit">                                                                                                                                             ';

                if (title) {
                    html +=
                        '<div class="embed-title">' +
                        '<input value="' + title + '" type="text" name="embed-title" id="embed-title-edit" placeholder="Title" maxlength="256" required />' +

                        '<div class="embed-title-link">' +
                        '<input value="' + title_url + '" type="url" name="embed-title-link" id="embed-title-link-edit" placeholder="Title URL" />' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-title-edit" name="delete-title" value="x" onclick="delete_title_edit(this);" />' +
                        '</div>';
                } else {
                    html +=

                        '                        <div class="embed-title">                                                                                                                                                      ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-title-edit" name="add-embed-title" value="+ Title" onclick="add_title_edit(this);" />                        ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Description
                html +=
                    '                    <div class="embed-description-wrapper-edit">                                                                                                                                       ';

                if (description) {
                    html +=
                        '<div class="embed-description">' +
                        '<textarea name="embed-description" id="embed-description-edit" placeholder="Description" maxlength="2048" required>' + description + '</textarea>' +
                        '<input class="btn-redirect empty" type="button" id="delete-description-edit" name="delete-description" value="x" onclick="delete_description_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-description">                                                                                                                                                ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-description-edit" name="add-embed-description" value="+ Description" onclick="add_description_edit(this);" />' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Field add buttons
                html +=
                    '                    <div class="add-buttons">                                                                                                                                                          ' +
                    '                        <div class="btn-redirect empty rr" id="add-inline-field-edit" name ="add-inline-field" onclick="add_field_inline_edit();">+ Inline Field</div>                                    ' +
                    '                        <div class="btn-redirect empty rr" id="add-non-inline-field-edit" name ="add-non-inline-field" onclick="add_field_non_inline_edit();">+ Non-inline Field</div>                    ' +
                    '                    </div>                                                                                                                                                                             ';

                // Fields
                html +=
                    '                    <div id="embed-fields-edit">                                                                                                                                                       ';

                if (l_fields.length > 0) {
                    l_fields.forEach(field => {
                        if (field.inline) {
                            html +=
                                '<div class="embed-field-i inline">' +
                                '<div class="embed-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-inline-field-title" id="embed-field-title-edit-' + field_ai + '" placeholder="Inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-inline-field-description">' +
                                '<textarea name="embed-inline-field-description" id="embed-field-description-edit-' + field_ai + '" placeholder="Inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_edit(this);" />' +
                                '</div>';
                        } else {
                            html +=
                                '<div class="embed-field-i non-inline">' +
                                '<div class="embed-non-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-non-inline-field-title" id="embed-field-title-edit-' + field_ai + '" placeholder="Non-inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-non-inline-field-description">' +
                                '<textarea name="embed-non-inline-field-description" id="embed-field-description-edit-' + field_ai + '" placeholder="Non-inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_edit(this);" />' +
                                '</div>';
                        }

                        fields++;
                        field_ai++;
                    });
                }

                html +=
                    '</div>';

                // Image
                html +=
                    '                    <div class="embed-image-wrapper-edit">                                                                                                                                             ';

                if (image_url) {
                    html +=
                        '<div class="embed-image">' +
                        '<a onclick="add_img(this);" class="img">' +
                        '<img src="' + image_url + '" id="embed-image-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-img-edit" name="delete-img" value="x" onclick="delete_img_edit(this);" />' +
                        '</div>';;
                } else {
                    html +=
                        '                        <div class="embed-image">                                                                                                                                                      ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-image-edit" name="add-image" value="+ Image" onclick="add_img_edit(this);" />                                      ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Footer Complete
                html +=
                    '                    <div class="embed-complete-footer-wrapper-edit">                                                                                                                                   ';

                // Footer
                html +=
                    '                        <div class="embed-footer-wrapper-edit">                                                                                                                                        ';

                if (footer) {
                    html +=
                        '<div class="embed-footer-used">';

                    // Footer Icon
                    html +=
                        '<div class="embed-footer-icon-wrapper-edit">';

                    if (footer_icon_url) {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<a onclick="add_footer_icon(this);">' +
                            '<img src="' + footer_icon_url + '" id="embed-footer-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-edit" name="delete-footer-icon" value="x" onclick="delete_footer_icon_edit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="add_footer_icon_edit(this);" />' +
                            '</div>';
                    }

                    html +=
                        '</div>';

                    // Footer Text
                    html +=
                        '<div class="embed-footer-text">' +
                        '<input value="' + footer + '" type="text" name="embed-footer-text" id="embed-footer-text-edit" placeholder="Footer" maxlength="2048" required />' +
                        '</div>' +

                        '<input class="btn-redirect empty" type="button" id="delete-footer-edit" name="delete-footer" value="x" onclick="delete_footer_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                            <div class="embed-footer">                                                                                                                                                 ' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-edit" name="add-embed-footer" value="+ Footer" onclick="add_footer_edit(this);" />                ' +
                        '                            </div>                                                                                                                                                                     ';
                }

                html +=
                    '                        </div>                                                                                                                                                                         ';

                // Divider
                html +=
                    '                        <div class="embed-divider">|</div>                                                                                                                                             ';

                // Timestamp 
                html +=
                    '                        <div class="embed-timestamp-wrapper-edit">                                                                                                                                     ';

                if (var_timestamp_tzs) {
                    var_timestamp_tzs.forEach(var_timestamp_tz => {
                        if (var_timestamp_tz.msg_id == rr_msg.msg_id) {
                            let timestamp_tz = var_timestamp_tz.tz.substring(0, 16);
                            if (timestamp_tz == 'Invalid date') {
                                html +=
                                    '                            <div class="embed-timestamp">                                                                                                                                              ' +
                                    '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_edit(this);" />    ' +
                                    '                            </div>                                                                                                                                                                     ';
                            } else {
                                html +=
                                    '<div class="embed-timestamp">' +
                                    '<input value="' + timestamp_tz + '" type="datetime-local" name="embed-timestamp" id="embed-timestamp-edit" />' +
                                    '<input class="btn-redirect empty" type="button" id="delete-timestamp-edit" name="delete-timestamp" value="x" onclick="delete_timestamp_edit(this);" />' +
                                    '</div>';
                            }
                        }
                    });
                } else {
                    html +=
                        '                            <div class="embed-timestamp">                                                                                                                                              ' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_edit(this);" />    ' +
                        '                            </div>                                                                                                                                                                     ';
                }

                html +=
                    '                        </div>                                                                                                                                                                         ';


                // Closing ealier stuff
                html +=
                    '                    </div>                                                                                                                                                                             ' +
                    '                </div>                                                                                                                                                                                 ' +
                    '            </div>                                                                                                                                                                                     ';

                // Reaction Roles
                html +=
                    '            <div class="container small dark">                                                                                                                                                         ' +
                    '                <div class="padding-top padding-bottom padding-left padding-right">                                                                                                                    ' +
                    '                    <div class="reaction-role">                                                                                                                                                        ' +
                    '                        <div>You can change this but keep in mind, if you add or remove a role from a reaction, it will not update all the users automatically. Only those who again click on the reaction.</div>                                                                                                      ' +
                    '                        <br />                                                                                                                                                                         ' +
                    '                        <div class="btn-redirect empty center-button" onclick="add_reaction_role();">+ Add</div>                                                                                       ' +
                    '                        <!-- Here, we will paste in emoji + role -->                                                                                                                                   ';

                for (let [k, v] of rr_map) {
                    let options = [];
                    botRoles.forEach(role => {
                        if (role.name !== '@everyone') {
                            let selected = v.includes(role.id) ? 'selected' : '';
                            let colorcode = role.color === 0 ? "FFFFFF" : role.color.toString(16);
                            options.push('<option ' + selected + ' value="' + role.id + '" style="color: #' + colorcode + '">' + role.name + '</option>')
                        }
                    });

                    let id = 'picker_' + rr_ai;
                    html +=
                        '<div class="settings-disclaimer">' +
                        '<br />' +
                        '<div class="reaction-role-groups">' +
                        '<div class="form-group">' +
                        '<div class="picker" id="' + id + '">' + k + '</div>' +
                        '<div class="picker-label">Emoji</div>' +
                        '</div>' +

                        '<div class="form-group embed">' +
                        '<select name="rr_roles"  data-placeholder="Select roles..." multiple class="chosen-select">' + options.join("") + '</select>' +
                        '<label for="tc" class="control-label">Role(s)</label><i class="bar"></i>' +
                        '</div>' +

                        '<div class="remove-rr" onclick="remove_rr(this);">' +
                        '<img src="/images/close.png" alt="Remove">' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    rr++;
                    rr_ai++;
                }

                html +=
                    '                    </div>                                                                                                                                                                             ' +
                    '                </div>                                                                                                                                                                                 ' +
                    '            </div>                                                                                                                                                                                     ';

                // Guild ID and Message ID
                html +=
                    '            <!-- to include it in url params -->                                                                                                                                                       ' +
                    '            <input type="hidden" id="guild_msg_id-edit" name="guild_msg_id" value="' + var_guild.id + '|' + msg_id + '" />                                                                                                         ';

                // Submit
                html +=
                    '            <div class="center-button">                                                                                                                                                                ' +
                    '                <button type="submit" class="btn-redirect center-button margin-top">Update Message</button>                                                                                            ' +
                    '            </div>                                                                                                                                                                                     ';

                // Closing everything
                html +=
                    '        </form>                                                                                                                                                                                        ' +
                    '    </div>                                                                                                                                                                                             ' +
                    '</div>                                                                                                                                                                                                 ';


                $('#modals-wrapper').append(html);

                refreshDismissibles(window);

                // Add script for color picker
                var color_picker = document.getElementById("color-picker-edit");
                var color_picker_wrapper = document.getElementById("color-picker-wrapper-edit");
                color_picker.onchange = function () {
                    color_picker_wrapper.style.backgroundColor = color_picker.value;
                }
                color_picker_wrapper.style.backgroundColor = color_picker.value;

                $('.picker').each(function (i) {
                    let id = $(this).attr('id');
                    twemoji.parse(document.getElementById(id));
                    add_picker_listener(id);
                    add_chosen();
                    add_on_click();
                });

                $('#form_reactionroles_edit').on("submit", function (e) {
                    e.preventDefault();

                    let field_titles = [];
                    let field_descriptions = [];
                    let field_inlines = [];

                    $('.embed-field-i').each(function () {
                        field_titles.push($(this).find('[id^="embed-field-title-edit"]').val());
                        field_descriptions.push($(this).find('[id^="embed-field-description-edit"]').val());
                        field_inlines.push($(this).attr('class').split(/\s+/)[1]);
                    });

                    let emojis = [];
                    let roles = [];

                    $('.settings-disclaimer').each(function () {
                        if (!$(this).attr('class').includes('tc')) {
                            emojis.push($(this).find('.emoji').attr('alt'));
                            roles.push($(this).find('.chosen-select').val().join("|"));
                        }
                    });

                    $.ajax({
                        global: false,
                        type: 'POST',
                        url: '/submit/reactionrole_edit',
                        dataType: 'html',
                        data: {
                            guild_id: $('#guild_msg_id-edit').val().split('|')[0],
                            tc_id: $('#tc-edit').val(),
                            msg_id: $('#guild_msg_id-edit').val().split('|')[1],

                            color: $('#color-picker-edit').val(),
                            author_icon: $('#embed-author-icon-edit').attr('src'),
                            author_name: $('#embed-author-name-edit').val(),
                            author_link: $('#embed-author-link-edit').val(),
                            thumbnail: $('#embed-thumbnail-edit').attr('src'),
                            title: $('#embed-title-edit').val(),
                            title_link: $('#embed-title-link-edit').val(),
                            description: $('#embed-description-edit').val(),

                            field_titles: field_titles.join("$€%¥"),
                            field_descriptions: field_descriptions.join("$€%¥"),
                            field_inlines: field_inlines.join("$€%¥"),

                            image: $('#embed-image-edit').attr('src'),
                            footer_icon: $('#embed-footer-icon-edit').attr('src'),
                            footer_text: $('#embed-footer-text-edit').val(),
                            timestamp: $('#embed-timestamp-edit').val(),

                            emojis: emojis.join("$€%¥"),
                            roles: roles.join("$€%¥")
                        },
                        success: function () {
                            location.reload();
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            switch (xhr.status) {
                                case 406:
                                    $('#dismissible-item-error-permission').addClass('dismiss');
                                    break;

                                case 403:
                                    $('#dismissible-item-error-tc').addClass('dismiss');
                                    break;

                                case 500:
                                    $('#dismissible-item-error-edit').addClass('dismiss');
                                    break;
                            }
                        }
                    });
                });
            }
        });
    }
}

// Author
function add_author_edit(add_button) {
    add_button.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<div class="embed-author-left">' +
        '<div class="embed-author-icon-wrapper-edit">' +
        '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="add_author_icon_edit(this);" />' +
        '</div>' +
        '</div>' +
        '</div>' +

        '<div class="embed-author-right">' +
        '<span class="embed-author-name">' +
        '<input type="text" name="embed-author-name" id="embed-author-name-edit" placeholder="Author Name" maxlength="256" required />' +
        '</span>' +

        '<div class="embed-author-link">' +
        '<input type="url" name="embed-author-link" id="embed-author-link-edit" placeholder="Author Name URL" maxlength="5000" />' +
        '</div>' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-author-edit" name="delete-author" value="x" onclick="delete_author_edit(this);" />' +
        '</div>';

    $('.embed-author-wrapper-edit').append(html);
}

function delete_author_edit(delete_button) {
    delete_button.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-author-edit" name="add-embed-author" value="+ Author" onclick="add_author_edit(this);" />' +
        '</div>';

    $('.embed-author-wrapper-edit').append(html);
};

// Author Icon
function add_author_icon_edit(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-author-icon').remove();

        let html = '<div class="embed-author-icon">' +
            '<a onclick="add_author_icon(this);">' +
            '<img src="' + url + '" id="embed-author-icon-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-author-icon-edit" name="delete-author-icon" value="x" onclick="delete_author_icon_edit(this);" />' +
            '</div>';

        $('.embed-author-icon-wrapper-edit').append(html);
    }
}

function delete_author_icon_edit(delete_button) {
    delete_button.closest('.embed-author-icon').remove();

    let html = '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="add_author_icon_edit(this);" />' +
        '</div>';

    $('.embed-author-icon-wrapper-edit').append(html);
};

// Thumbnail
function add_thumb_edit(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-thumbnail').remove();

        let html = '<div class="embed-thumbnail">' +
            '<a onclick="add_thumb(this);" class="thumb">' +
            '<img src="' + url + '" id="embed-thumbnail-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-thumbnail-edit" name="delete-thumbnail" value="x" onclick="delete_thumb_edit(this);" />' +
            '</div>';

        $('.embed-thumbnail-wrapper-edit').append(html);
    }
}

function delete_thumb_edit(delete_button) {
    delete_button.closest('.embed-thumbnail').remove();

    let html = '<div class="embed-thumbnail">' +
        '<input class="btn-redirect empty" type="button" id="add-thumbnail-edit" name="add-thumbnail" value="+ Thumbnail" onclick="add_thumb_edit(this);" />' +
        '</div>';

    $('.embed-thumbnail-wrapper-edit').append(html);
};

// Title
function add_title_edit(add_button) {
    add_button.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input type="text" name="embed-title" id="embed-title-edit" placeholder="Title" maxlength="256" required />' +

        '<div class="embed-title-link">' +
        '<input type="url" name="embed-title-link" id="embed-title-link-edit" placeholder="Title URL" />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-title-edit" name="delete-title" value="x" onclick="delete_title_edit(this);" />' +
        '</div>';

    $('.embed-title-wrapper-edit').append(html);
}

function delete_title_edit(delete_button) {
    delete_button.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-title-edit" name="add-embed-title" value="+ Title" onclick="add_title_edit(this);" />' +
        '</div>';

    $('.embed-title-wrapper-edit').append(html);
};

// Description
function add_description_edit(add_button) {
    add_button.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<textarea name="embed-description" id="embed-description-edit" placeholder="Description" maxlength="2048" required></textarea>' +
        '<input class="btn-redirect empty" type="button" id="delete-description-edit" name="delete-description" value="x" onclick="delete_description_edit(this);" />' +
        '</div>';

    $('.embed-description-wrapper-edit').append(html);
}

function delete_description_edit(delete_button) {
    delete_button.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-description-edit" name="add-embed-description" value="+ Description" onclick="add_description_edit(this);" />' +
        '</div>';

    $('.embed-description-wrapper-edit').append(html);
};

// Fields
function add_field_inline_edit() {
    if (fields <= max_fields) {
        let html = '<div class="embed-field-i inline">' +
            '<div class="embed-inline-field-title">' +
            '<input type="text" name="embed-inline-field-title" id="embed-field-title-edit-' + field_ai + '" placeholder="Inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-inline-field-description">' +
            '<textarea name="embed-inline-field-description" id="embed-field-description-edit-' + field_ai + '" placeholder="Inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_edit(this);" />' +
            '</div>';

        $("#embed-fields-edit").append(html);

        fields++;
        field_ai++;
    } else {
        alert('You reached the limits!')
    }
}

function add_field_non_inline_edit() {
    if (fields <= max_fields) {
        let html = '<div class="embed-field-i non-inline">' +
            '<div class="embed-non-inline-field-title">' +
            '<input type="text" name="embed-non-inline-field-title" id="embed-field-title-edit-' + field_ai + '" placeholder="Non-inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-non-inline-field-description">' +
            '<textarea name="embed-non-inline-field-description" id="embed-field-description-edit-' + field_ai + '" placeholder="Non-inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_edit(this);" />' +
            '</div>';

        $("#embed-fields-edit").append(html);

        fields++;
        field_ai++;
    } else {
        alert('You reached the limits!')
    }
}

function delete_field_edit(delete_button) {
    delete_button.closest('.embed-field-i').remove();
    fields--;
}

// Image
function add_img_edit(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-image').remove();

        let html = '<div class="embed-image">' +
            '<a onclick="add_img(this);" class="img">' +
            '<img src="' + url + '" id="embed-image-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-img-edit" name="delete-img" value="x" onclick="delete_img_edit(this);" />' +
            '</div>';

        $('.embed-image-wrapper-edit').append(html);
    }
}

function delete_img_edit(delete_button) {
    delete_button.closest('.embed-image').remove();

    let html = '<div class="embed-image">' +
        '<input class="btn-redirect empty" type="button" id="add-img-edit" name="add-img" value="+ Image" onclick="add_img_edit(this);" />' +
        '</div>';

    $('.embed-image-wrapper-edit').append(html);
};

// Footer
function add_footer_edit(add_button) {
    add_button.closest('.embed-footer').remove();

    let html = '<div class="embed-footer-used">' +
        '<div class="embed-footer-icon-wrapper-edit">' +
        '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="add_footer_icon_edit(this);" />' +
        '</div>' +
        '</div>' +

        '<div class="embed-footer-text">' +
        '<input type="text" name="embed-footer-text" id="embed-footer-text-edit" placeholder="Footer" maxlength="2048" required />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-footer-edit" name="delete-footer" value="x" onclick="delete_footer_edit(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-edit').append(html);
}

function delete_footer_edit(delete_button) {
    delete_button.closest('.embed-footer-used').remove();

    let html = ' <div class="embed-footer">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-footer-edit" name="add-embed-footer" value="+ Footer" onclick="add_footer_edit(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-edit').append(html);
};

// Footer Icon
function add_footer_icon_edit(add_button) {
    let url = getDirektLink();

    if (url != null) {
        add_button.closest('.embed-footer-icon').remove();

        let html = '<div class="embed-footer-icon">' +
            '<a onclick="add_footer_icon(this);">' +
            '<img src="' + url + '" id="embed-footer-icon-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-edit" name="delete-footer-icon" value="x" onclick="delete_footer_icon_edit(this);" />' +
            '</div>';

        $('.embed-footer-icon-wrapper-edit').append(html);
    }
}

function delete_footer_icon_edit(delete_button) {
    delete_button.closest('.embed-footer-icon').remove();

    let html = '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="add_footer_icon_edit(this);" />' +
        '</div>';

    $('.embed-footer-icon-wrapper-edit').append(html);
};

// Timestamp
function add_timestamp_edit(add_button) {
    add_button.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input type="datetime-local" name="embed-timestamp" id="embed-timestamp-edit" />' +
        '<input class="btn-redirect empty" type="button" id="delete-timestamp-edit" name="delete-timestamp" value="x" onclick="delete_timestamp_edit(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-edit').append(html);
}

function delete_timestamp_edit(delete_button) {
    delete_button.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_edit(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-edit').append(html);
};

// Birthday
function submit_birthday() {
    let guild_user = $('#guild_user_id').val();
    let guild_id = guild_user.split("|")[0];
    let user_id = guild_user.split("|")[1];

    circle_loading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/birthday',
        dataType: 'html',
        data: {
            guild_id: guild_id,
            servant_bday: $('#birthday-servant').is(':checked'),
            announcement_tc_id: $('#tc').val(),
            list_tc_id: $('#tc_list').val(),
            user_id: user_id
        },
        success: function () {
            setTimeout(function () {
                circle_saved();
            }, 1000);
        },
        error: function () {
            setTimeout(function () {
                circle_error();
            }, 1000);
        }
    });
}

// Custom Commands
function showNormalMsg() {
    $('#normal_msg_desc').prop('required', true);

    // Tabs
    $('#tab_embed').removeClass('active_cc');
    $('#tab_normal').addClass('active_cc');

    // Content
    $('#embed_msg').css('display', 'none')
    $('#normal_msg').css('display', 'block');
}

function showEmbedMsg() {
    $('#normal_msg_desc').prop('required', false);

    // Tabs
    $('#tab_normal').removeClass('active_cc');
    $('#tab_embed').addClass('active_cc');

    // Content
    $('#normal_msg').css('display', 'none')
    $('#embed_msg').css('display', 'block');
}

function open_modal_create_cc() {
    if (varCommandsAmount < 100) {
        rr = 0;
        rr_ai = 0;
        curr_ai = 0;

        fields = 1;
        field_ai = 1;

        let html =
            '<div id="reactionrole-modal-create" class="modal">                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ' +
            '    <!-- Modal content -->                                                                                                                                                                                 ' +
            '    <div class="modal-content cc-content">                                                                                                                                                                 ' +
            '        <span id="close_create" class="close" onclick="close_modal(this);">&times;</span>                                                                                                                  ' +
            '                                                                                                                                                                                                           ' +
            '        <form action="/submit/customcommands" method="POST" id="form_customcommands">                                                                                                                      ' +
            '            <div id="dismissible-item-error-create" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>                                                          ' +
            '            <div id="dismissible-item-error-invoke" data-component="dismissible-item" data-type="error" data-value="This invoke has already been used."></div>                                             ' +
            '            <div id="dismissible-item-error-commands" data-component="dismissible-item" data-type="error" data-value="You already have 100 custom commands."></div>                                        ' +
            '                                                                                                                                                                                                           ' +
            '            <div class="embed-warning">                                                                                                                                                                    ' +
            '                If you refresh or quit the page, your progress will be lost!                                                                                                                               ' +
            '            </div>                                                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ' +
            '            <div class="container small dark">                                                                                                                                                             ' +
            '                <div class="padding-top padding-bottom padding-left padding-right">                                                                                                                        ' +
            '                    <div class="settings-disclaimer embed tc">                                                                                                                                             ' +
            '                        <div>This is how the command will be used.</div>                                                                                                                                 ' +
            '                        <br />                                                                                                                                                                             ' +
            '                        <div class="invoke-wrapper">                                                                                                                                                       ' +
            '                           <div class="prefix">' + var_prefix + '</div>                                                                                                                                    ' +
            '                           <div class="form-group embed invoke-div">                                                                                                                                       ' +
            '                               <input onkeyup="setRequired(this);" type="text" id="invoke" name="invoke" maxlength="100" required>                                                                                  ' +
            '                               <label for="invoke" class="control-label">Command Name (Invoke)</label><i class="bar"></i>                                                                                  ' +
            '                           </div>                                                                                                                                                                          ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                </div>                                                                                                                                                                                     ' +
            '            </div>                                                                                                                                                                                         ';

        // Normal or embed message?
        html +=
            '<div class="tab_cc">' +
            '   <div id="tab_normal" class="tablinks_cc grp-a active_cc" onclick="showNormalMsg();"><i class="far fa-envelope"></i> Normal Message</div>' +
            '   <div id="tab_embed" class="tablinks_cc grp-b" onclick="showEmbedMsg();"><i class="fas fa-envelope"></i> Embed Message</div>' +
            '</div>';


        // Normal
        html +=
            '<div id="normal_msg">' +
            '   <div id="normal_msg_wrapper">' +
            '       <textarea name="normal_msg_desc" id="normal_msg_desc" placeholder="Your message" maxlength="2000" required></textarea>' +
            '   </div>' +
            '</div>';

        // Embed
        html +=
            '<div id="embed_msg">';


        let disabled = var_is_supporter ? '' : 'disabled';

        html +=
            '            <div class="embed-field">                                                                                                                                                                      ';

        if (!var_is_supporter) {
            html +=
                '                <div class="supporter-tooltip">                                                                                                                                                           ' +
                '                    <a href="/donate">                                                                                                                                                                     ' +
                '                        <span class="supporter-tooltip-wrapper">                                                                                                                                           ' +
                '                            <span class="supporter-tooltiptext">                                                                                                                                           ' +
                '                                <h3>Embed Colours</h3>                                                                                                                                                     ' +
                '                                <h3>Become a supporter</h3>                                                                                                                                                ' +
                '                                <img src="/images/become_supporter.png" alt="Supporter">                                                                                                                   ' +
                '                            </span>                                                                                                                                                                        ' +
                '                        </span>                                                                                                                                                                            ' +
                '                    </a>                                                                                                                                                                                   ';
        }

        html +=
            '                    <div id="color-picker-wrapper-create">                                                                                                                                                 ';

        console.log(var_color_code)
        let color = var_color_code.length > 0 ? var_color_code[0].color_code : '#7289da';
        console.log(color)

        html +=
            '                        <input name="color-picker" type="color" value="' + color + '" id="color-picker-create" ' + disabled + '>                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ';

        if (!var_is_supporter) {
            html +=
                '                </div>                                                                                                                                                                                     ';
        }

        html +=
            '                                                                                                                                                                                                           ' +
            '                <div class="embed-content">                                                                                                                                                                ' +
            '                    <div class="embed-author-wrapper-create">                                                                                                                                              ' +
            '                        <div class="embed-author">                                                                                                                                                         ' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-author-create" name="add-embed-author" value="+ Author" onclick="add_author_create(this);" />                    ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-thumbnail-wrapper-create">                                                                                                                                           ' +
            '                        <div class="embed-thumbnail">                                                                                                                                                      ' +
            '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-create" name="add-thumbnail" value="+ Thumbnail" onclick="add_thumb_create(this);" />                        ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-title-wrapper-create">                                                                                                                                               ' +
            '                        <div class="embed-title">                                                                                                                                                          ' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-title-create" name="add-embed-title" value="+ Title" onclick="add_title_create(this);" />                        ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-description-wrapper-create">                                                                                                                                         ' +
            '                        <div class="embed-description">                                                                                                                                                    ' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-description-create" name="add-embed-description" value="+ Description" onclick="add_description_create(this);" />' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="add-buttons">                                                                                                                                                              ' +
            '                        <div class="btn-redirect empty rr" id="add-inline-field-create" name ="add-inline-field" onclick="add_field_inline_create();">+ Inline Field</div>                                 ' +
            '                        <div class="btn-redirect empty rr" id="add-non-inline-field-create" name ="add-non-inline-field" onclick="add_field_non_inline_create();">+ Non-inline Field</div>                 ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                    <div id="embed-fields-create"></div>                                                                                                                                                   ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-image-wrapper-create">                                                                                                                                               ' +
            '                        <div class="embed-image">                                                                                                                                                          ' +
            '                            <input class="btn-redirect empty" type="button" id="add-image-create" name="add-image" value="+ Image" onclick="add_img_create(this);" />                                      ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                    <div class="embed-complete-footer-wrapper-create">                                                                                                                                     ' +
            '                        <div class="embed-footer-wrapper-create">                                                                                                                                          ' +
            '                            <div class="embed-footer">                                                                                                                                                     ' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-create" name="add-embed-footer" value="+ Footer" onclick="add_footer_create(this);" />                ' +
            '                            </div>                                                                                                                                                                         ' +
            '                        </div>                                                                                                                                                                             ' +
            '                                                                                                                                                                                                           ' +
            '                        <div class="embed-divider">|</div>                                                                                                                                                 ' +
            '                                                                                                                                                                                                           ' +
            '                        <div class="embed-timestamp-wrapper-create">                                                                                                                                       ' +
            '                            <div class="embed-timestamp">                                                                                                                                                  ' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-create" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_create(this);" />    ' +
            '                            </div>                                                                                                                                                                         ' +
            '                        </div>                                                                                                                                                                             ' +
            '                    </div>                                                                                                                                                                                 ' +
            '                </div>                                                                                                                                                                                     ' +
            '            </div>                                                                                                                                                                                         ' +
            '                                                                                                                                                                                                           ';

        html +=
            '</div>';


        html +=
            '            <!-- to include it in url params -->                                                                                                                                                           ' +
            '            <input type="hidden" id="guild_id-create" name="guild_id" value="' + var_guild.id + '" />                                                                                                           ' +
            '                                                                                                                                                                                                           ' +
            '            <div class="center-button">                                                                                                                                                                    ' +
            '                <button type="submit" class="btn-redirect center-button margin-top">Save</button>                                                                                                ' +
            '            </div>                                                                                                                                                                                         ' +
            '        </form>                                                                                                                                                                                            ' +
            '    </div>                                                                                                                                                                                                 ' +
            '</div>                                                                                                                                                                                                     ';

        $('#modals-wrapper').append(html);

        refreshDismissibles(window);

        // Add script for color picker
        var color_picker = document.getElementById("color-picker-create");
        var color_picker_wrapper = document.getElementById("color-picker-wrapper-create");
        color_picker.onchange = function () {
            color_picker_wrapper.style.backgroundColor = color_picker.value;
        }
        color_picker_wrapper.style.backgroundColor = color_picker.value;

        $('#form_customcommands').on("submit", function (e) {
            e.preventDefault();

            if ($('#tab_normal').hasClass('active_cc')) {
                // Normal message
                $.ajax({
                    global: false,
                    type: 'POST',
                    url: '/submit/customcommands_normal',
                    dataType: 'html',
                    data: {
                        guild_id: $('#guild_id-create').val(),
                        invoke: $('#invoke').val(),
                        message: $('#normal_msg_desc').val()
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        switch (xhr.status) {
                            case 406:
                                $('#dismissible-item-error-invoke').addClass('dismiss');
                                break;

                            case 403:
                                $('#dismissible-item-error-commands').addClass('dismiss');
                                break;

                            case 500:
                                $('#dismissible-item-error-create').addClass('dismiss');
                                break;
                        }
                    }
                });
            } else {
                // Embed message
                let field_titles = [];
                let field_descriptions = [];
                let field_inlines = [];

                $('.embed-field-i').each(function () {
                    field_titles.push($(this).find('[id^="embed-field-title-create"]').val());
                    field_descriptions.push($(this).find('[id^="embed-field-description-create"]').val());
                    field_inlines.push($(this).attr('class').split(/\s+/)[1]);
                });

                $.ajax({
                    global: false,
                    type: 'POST',
                    url: '/submit/customcommands_embed',
                    dataType: 'html',
                    data: {
                        guild_id: $('#guild_id-create').val(),
                        invoke: $('#invoke').val(),

                        color: $('#color-picker-create').val(),
                        author_icon: $('#embed-author-icon-create').attr('src'),
                        author_name: $('#embed-author-name-create').val(),
                        author_link: $('#embed-author-link-create').val(),
                        thumbnail: $('#embed-thumbnail-create').attr('src'),
                        title: $('#embed-title-create').val(),
                        title_link: $('#embed-title-link-create').val(),
                        description: $('#embed-description-create').val(),

                        field_titles: field_titles.join("$€%¥"),
                        field_descriptions: field_descriptions.join("$€%¥"),
                        field_inlines: field_inlines.join("$€%¥"),

                        image: $('#embed-image-create').attr('src'),
                        footer_icon: $('#embed-footer-icon-create').attr('src'),
                        footer_text: $('#embed-footer-text-create').val(),
                        timestamp: $('#embed-timestamp-create').val()
                    },
                    success: function () {
                        location.reload();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        switch (xhr.status) {
                            case 406:
                                $('#dismissible-item-error-invoke').addClass('dismiss');
                                break;

                            case 403:
                                $('#dismissible-item-error-commands').addClass('dismiss');
                                break;

                            case 500:
                                $('#dismissible-item-error-create').addClass('dismiss');
                                break;
                        }
                    }
                });
            }
        });
    } else {
        alert("You have reached the limits of 100 custom commands!");
    }
}

function delete_cc(button) {
    if (confirm('Are you sure to delete this custom command?')) {
        let name_split = button.name.split("|");
        let guild_id = name_split[0];
        let invoke = name_split[1];

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/delete_customcommand',
            dataType: 'html',
            data: {
                guild_id: guild_id,
                invoke: invoke
            },
            success: function () {
                location.reload();
            },
            error: function () {
                $('#dismissible-item').addClass('dismiss');
            }
        });
    } else return;
}

function open_modal_edit_cc(button) {
    var isNormalMessage;

    var ccId;
    var invoke;

    var normalMsg;

    var colorcode;
    var author_name;
    var author_url;
    var author_icon_url;
    var title;
    var title_url;
    var thumbnail_url;
    var description;
    var image_url;
    var footer;
    var footer_icon_url;

    var l_fields = [];
    fields = 1;
    field_ai = 1;

    if (varCcs.length > 0) {
        varCcs.forEach(cc => {
            if (cc.invoke == button.name) {
                ccId = cc.id;
                invoke = cc.invoke;

                if (cc.normal_msg) {
                    // Normal message
                    isNormalMessage = true;

                    colorcode = var_color_code.length > 0 ? (var_color_code[0] ? var_color_code[0].color_code : '#7289da') : '#7289da';

                    normalMsg = cc.normal_msg;
                } else {
                    // Embed message
                    isNormalMessage = false;

                    varCcEmbeds.forEach(ccEmbed => {
                        if (ccEmbed.cc_id == ccId) {
                            colorcode = ccEmbed.colorcode;
                            author_name = ccEmbed.author_name;
                            author_url = ccEmbed.author_url;
                            author_icon_url = ccEmbed.author_icon_url;
                            title = ccEmbed.title;
                            title_url = ccEmbed.title_url;
                            thumbnail_url = ccEmbed.thumbnail_url;
                            description = ccEmbed.description;
                            image_url = ccEmbed.image_url;
                            footer = ccEmbed.footer;
                            footer_icon_url = ccEmbed.footer_icon_url;
                        }
                    });

                    if (varCcFields.length > 0) {
                        let i = 0;
                        varCcFields.forEach(ccField => {
                            if (i < 25 && ccField.cc_id == ccId) {
                                l_fields.push({
                                    title: ccField.title,
                                    description: ccField.description,
                                    inline: ccField.inline
                                });

                                i++;
                            }
                        });
                    }
                }

                // Start of modal
                let html =
                    '<div id="reactionrole-modal-edit" class="modal">                                                                                                                                                         ' +
                    '                                                                                                                                                                                                           ' +
                    '    <!-- Modal content -->                                                                                                                                                                                 ' +
                    '    <div class="modal-content cc-content">                                                                                                                                                                 ' +
                    '        <span id="close_edit" class="close" onclick="close_modal(this);">&times;</span>                                                                                                                  ' +
                    '                                                                                                                                                                                                           ' +
                    '        <form action="/submit/customcommands" method="POST" id="form_customcommands">                                                                                                                      ' +
                    '            <div id="dismissible-item-error-edit" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>                                                          ' +
                    '            <div id="dismissible-item-error-invoke" data-component="dismissible-item" data-type="error" data-value="This invoke has already been used."></div>                                             ' +
                    '            <div id="dismissible-item-error-commands" data-component="dismissible-item" data-type="error" data-value="You already have 100 custom commands."></div>                                        ' +
                    '                                                                                                                                                                                                           ' +
                    '            <div class="embed-warning">                                                                                                                                                                    ' +
                    '                If you refresh or quit the page, your progress will be lost!                                                                                                                               ' +
                    '            </div>                                                                                                                                                                                         ' +
                    '                                                                                                                                                                                                           ' +
                    '            <div class="container small dark">                                                                                                                                                             ' +
                    '                <div class="padding-top padding-bottom padding-left padding-right">                                                                                                                        ' +
                    '                    <div class="settings-disclaimer embed tc">                                                                                                                                             ' +
                    '                        <div>This is how the command will be used.</div>                                                                                                                                   ' +
                    '                        <br />                                                                                                                                                                             ' +
                    '                        <div class="invoke-wrapper">                                                                                                                                                       ' +
                    '                           <div class="prefix">' + var_prefix + '</div>                                                                                                                                    ' +
                    '                           <div class="form-group embed invoke-div">                                                                                                                                       ' +
                    '                               <input type="text" id="invoke" name="invoke" maxlength="100" required value="' + invoke + '">                                                                               ' +
                    '                               <label for="invoke" class="control-label">Command Name (Invoke)</label><i class="bar"></i>                                                                                  ' +
                    '                           </div>                                                                                                                                                                          ' +
                    '                        </div>                                                                                                                                                                             ' +
                    '                    </div>                                                                                                                                                                                 ' +
                    '                </div>                                                                                                                                                                                     ' +
                    '            </div>                                                                                                                                                                                         ';

                // Normal or embed message?
                html +=
                    '<div class="tab_cc">' +
                    '   <div id="tab_normal" class="tablinks_cc grp-a ' + (isNormalMessage ? 'active_cc' : '') + '" onclick="showNormalMsg();"><i class="far fa-envelope"></i> Normal Message</div>' +
                    '   <div id="tab_embed" class="tablinks_cc grp-b ' + (isNormalMessage ? '' : 'active_cc') + '" onclick="showEmbedMsg();"><i class="fas fa-envelope"></i> Embed Message</div>' +
                    '</div>';


                // Normal
                html +=
                    '<div id="normal_msg">' +
                    '   <div id="normal_msg_wrapper">' +
                    '       <textarea name="normal_msg_desc" id="normal_msg_desc" placeholder="Your message" maxlength="2000" required>' + (isNormalMessage ? normalMsg : '') + '</textarea>' +
                    '   </div>' +
                    '</div>';

                // Embed
                html +=
                    '<div id="embed_msg">';

                html +=
                    '            <div class="embed-field">                                                                                                                                                                      ';

                // Non-supporter tooltip
                let disabled = var_is_supporter ? "" : "disabled";

                if (!var_is_supporter) {
                    html +=
                        '                <div class="supporter-tooltip">                                                                                                                                                        ' +
                        '                    <a href="/donate">                                                                                                                                                                 ' +
                        '                        <span class="supporter-tooltip-wrapper">                                                                                                                                       ' +
                        '                            <span class="supporter-tooltiptext">                                                                                                                                       ' +
                        '                                <h3>Embed Colours</h3>                                                                                                                                                 ' +
                        '                                <h3>Become a supporter</h3>                                                                                                                                            ' +
                        '                                <img src="/images/become_supporter.png" alt="Supporter">                                                                                                               ' +
                        '                            </span>                                                                                                                                                                    ' +
                        '                        </span>                                                                                                                                                                        ' +
                        '                    </a>                                                                                                                                                                               ';

                }

                // Color picker
                html +=
                    '                    <div id="color-picker-wrapper-edit">                                                                                                                                               ' +
                    '                        <input name="color-picker" type="color" value="' + colorcode + '" id="color-picker-edit" ' + disabled + '>                                                                     ' +
                    '                    </div>                                                                                                                                                                             ';


                // Closing non-supporter tooltip
                if (!var_is_supporter) {
                    html +=
                        '                </div>                                                                                                                                                                                 ';
                }

                // Embed content
                html +=
                    '                <div class="embed-content">                                                                                                                                                            ';

                // Author
                html +=
                    '                    <div class="embed-author-wrapper-edit">                                                                                                                                            ';

                if (author_name) {
                    html +=
                        '<div class="embed-author">' +
                        '<div class="embed-author-left">' +
                        '<div class="embed-author-icon-wrapper-edit">';

                    // Author Icon
                    if (author_icon_url) {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<a onclick="add_author_icon(this);">' +
                            '<img src="' + author_icon_url + '" id="embed-author-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-author-icon-edit" name="delete-author-icon" value="x" onclick="delete_author_icon_edit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="add_author_icon_edit(this);" />' +
                            '</div>';
                    }

                    // Author Name & Url
                    html +=
                        '</div>' +
                        '</div>' +

                        '<div class="embed-author-right">' +
                        '<span class="embed-author-name">' +
                        '<input value="' + author_name + '" type="text" name="embed-author-name" id="embed-author-name-edit" placeholder="Author Name" maxlength="256" required />' +
                        '</span>' +

                        '<div class="embed-author-link">' +
                        '<input value="' + author_url + '" type="url" name="embed-author-link" id="embed-author-link-edit" placeholder="Author Name URL" maxlength="5000" />' +
                        '</div>' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-author-edit" name="delete-author" value="x" onclick="delete_author_edit(this);" />' +
                        '</div>';
                } else {
                    // Author add button
                    html +=

                        '                        <div class="embed-author">                                                                                                                                                     ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-author-edit" name="add-embed-author" value="+ Author" onclick="add_author_edit(this);" />                    ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Thumbnail
                html +=
                    '                    <div class="embed-thumbnail-wrapper-edit">                                                                                                                                         ';

                if (thumbnail_url) {
                    html +=
                        '<div class="embed-thumbnail">' +
                        '<a onclick="add_thumb(this);" class="thumb">' +
                        '<img src="' + thumbnail_url + '" id="embed-thumbnail-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-thumbnail-edit" name="delete-thumbnail" value="x" onclick="delete_thumb_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-thumbnail">                                                                                                                                                  ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-edit" name="add-thumbnail" value="+ Thumbnail" onclick="add_thumb_edit(this);" />                        ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Title
                html +=
                    '                    <div class="embed-title-wrapper-edit">                                                                                                                                             ';

                if (title) {
                    html +=
                        '<div class="embed-title">' +
                        '<input value="' + title + '" type="text" name="embed-title" id="embed-title-edit" placeholder="Title" maxlength="256" required />' +

                        '<div class="embed-title-link">' +
                        '<input value="' + title_url + '" type="url" name="embed-title-link" id="embed-title-link-edit" placeholder="Title URL" />' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-title-edit" name="delete-title" value="x" onclick="delete_title_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-title">                                                                                                                                                      ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-title-edit" name="add-embed-title" value="+ Title" onclick="add_title_edit(this);" />                        ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Description
                html +=
                    '                    <div class="embed-description-wrapper-edit">                                                                                                                                       ';

                if (description) {
                    html +=
                        '<div class="embed-description">' +
                        '<textarea name="embed-description" id="embed-description-edit" placeholder="Description" maxlength="2048" required>' + description + '</textarea>' +
                        '<input class="btn-redirect empty" type="button" id="delete-description-edit" name="delete-description" value="x" onclick="delete_description_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-description">                                                                                                                                                ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-description-edit" name="add-embed-description" value="+ Description" onclick="add_description_edit(this);" />' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Field add buttons
                html +=
                    '                    <div class="add-buttons">                                                                                                                                                          ' +
                    '                        <div class="btn-redirect empty rr" id="add-inline-field-edit" name ="add-inline-field" onclick="add_field_inline_edit();">+ Inline Field</div>                                    ' +
                    '                        <div class="btn-redirect empty rr" id="add-non-inline-field-edit" name ="add-non-inline-field" onclick="add_field_non_inline_edit();">+ Non-inline Field</div>                    ' +
                    '                    </div>                                                                                                                                                                             ';

                // Fields
                html +=
                    '                    <div id="embed-fields-edit">                                                                                                                                                       ';

                if (l_fields.length > 0) {
                    l_fields.forEach(field => {
                        if (field.inline) {
                            html +=
                                '<div class="embed-field-i inline">' +
                                '<div class="embed-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-inline-field-title" id="embed-field-title-edit-' + field_ai + '" placeholder="Inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-inline-field-description">' +
                                '<textarea name="embed-inline-field-description" id="embed-field-description-edit-' + field_ai + '" placeholder="Inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_edit(this);" />' +
                                '</div>';
                        } else {
                            html +=
                                '<div class="embed-field-i non-inline">' +
                                '<div class="embed-non-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-non-inline-field-title" id="embed-field-title-edit-' + field_ai + '" placeholder="Non-inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-non-inline-field-description">' +
                                '<textarea name="embed-non-inline-field-description" id="embed-field-description-edit-' + field_ai + '" placeholder="Non-inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + field_ai + '" name="delete-field" value="x" onclick="delete_field_edit(this);" />' +
                                '</div>';
                        }

                        fields++;
                        field_ai++;
                    });
                }

                html +=
                    '                   </div>';

                // Image
                html +=
                    '                    <div class="embed-image-wrapper-edit">                                                                                                                                             ';

                if (image_url) {
                    html +=
                        '<div class="embed-image">' +
                        '<a onclick="add_img(this);" class="img">' +
                        '<img src="' + image_url + '" id="embed-image-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-img-edit" name="delete-img" value="x" onclick="delete_img_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-image">                                                                                                                                                      ' +
                        '                            <input class="btn-redirect empty" type="button" id="add-image-edit" name="add-image" value="+ Image" onclick="add_img_edit(this);" />                                      ' +
                        '                        </div>                                                                                                                                                                         ';
                }

                html +=
                    '                    </div>                                                                                                                                                                             ';

                // Footer Complete
                html +=
                    '                    <div class="embed-complete-footer-wrapper-edit">                                                                                                                                   ';

                // Footer
                html +=
                    '                        <div class="embed-footer-wrapper-edit">                                                                                                                                        ';

                if (footer) {
                    html +=
                        '<div class="embed-footer-used">';

                    // Footer Icon
                    html +=
                        '<div class="embed-footer-icon-wrapper-edit">';

                    if (footer_icon_url) {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<a onclick="add_footer_icon(this);">' +
                            '<img src="' + footer_icon_url + '" id="embed-footer-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-edit" name="delete-footer-icon" value="x" onclick="delete_footer_icon_edit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="add_footer_icon_edit(this);" />' +
                            '</div>';
                    }

                    html +=
                        '</div>';

                    // Footer Text
                    html +=
                        '<div class="embed-footer-text">' +
                        '<input value="' + footer + '" type="text" name="embed-footer-text" id="embed-footer-text-edit" placeholder="Footer" maxlength="2048" required />' +
                        '</div>' +

                        '<input class="btn-redirect empty" type="button" id="delete-footer-edit" name="delete-footer" value="x" onclick="delete_footer_edit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                            <div class="embed-footer">                                                                                                                                                 ' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-edit" name="add-embed-footer" value="+ Footer" onclick="add_footer_edit(this);" />                ' +
                        '                            </div>                                                                                                                                                                     ';
                }

                html +=
                    '                        </div>                                                                                                                                                                         ';

                // Divider
                html +=
                    '                        <div class="embed-divider">|</div>                                                                                                                                             ';

                // Timestamp 
                html +=
                    '                        <div class="embed-timestamp-wrapper-edit">                                                                                                                                     ';


                let timestampWasSet = false;

                if (var_timestamp_tzs) {
                    var_timestamp_tzs.forEach(var_timestamp_tz => {
                        if (var_timestamp_tz.cc_id == ccId) {
                            timestampWasSet = true;
                            let timestamp_tz = var_timestamp_tz.tz.substring(0, 16);
                            if (timestamp_tz == 'Invalid date') {
                                html +=
                                    '                            <div class="embed-timestamp">                                                                                                                                              ' +
                                    '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_edit(this);" />    ' +
                                    '                            </div>                                                                                                                                                                     ';
                            } else {
                                html +=
                                    '<div class="embed-timestamp">' +
                                    '   <input value="' + timestamp_tz + '" type="datetime-local" name="embed-timestamp" id="embed-timestamp-edit" />' +
                                    '   <input class="btn-redirect empty" type="button" id="delete-timestamp-edit" name="delete-timestamp" value="x" onclick="delete_timestamp_edit(this);" />' +
                                    '</div>';
                            }
                        }
                    });
                }

                if (!timestampWasSet) {
                    html +=
                        '                            <div class="embed-timestamp">                                                                                                                                              ' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="add_timestamp_edit(this);" />    ' +
                        '                            </div>                                                                                                                                                                     ';
                }

                html +=
                    '                        </div>' +
                    '                  </div>' +
                    '           </div>';


                // Closing ealier stuff
                html +=
                    '                    </div>                                                                                                                                                                             ';

                html +=
                    '            </div>                                                                                                                                                                                         ';


                html +=
                    '            <!-- to include it in url params -->                                                                                                                                                           ' +
                    '            <input type="hidden" id="guild_id-edit" name="guild_id" value="' + var_guild.id + '" />' +
                    '            <input type="hidden" id="invoke_old" name="invoke_old" value="' + invoke + '" />' +
                    '                                                                                                                                                                                                           ' +
                    '            <div class="center-button">                                                                                                                                                                    ' +
                    '                <button type="submit" class="btn-redirect center-button margin-top">Update</button>                                                                                                ' +
                    '            </div>                                                                                                                                                                                         ' +
                    '        </form>                                                                                                                                                                                            ' +
                    '    </div>                                                                                                                                                                                                 ' +
                    '</div>                                                                                                                                                                                                     ';

                $('#modals-wrapper').append(html);

                if (!isNormalMessage) showEmbedMsg();
                refreshDismissibles(window);

                // Add script for color picker
                var color_picker = document.getElementById("color-picker-edit");
                var color_picker_wrapper = document.getElementById("color-picker-wrapper-edit");
                color_picker.onchange = function () {
                    color_picker_wrapper.style.backgroundColor = color_picker.value;
                }
                color_picker_wrapper.style.backgroundColor = color_picker.value;

                $('#form_customcommands').on("submit", function (e) {
                    e.preventDefault();

                    if ($('#tab_normal').hasClass('active_cc')) {
                        // Normal message
                        $.ajax({
                            global: false,
                            type: 'POST',
                            url: '/submit/customcommands_normal_edit',
                            dataType: 'html',
                            data: {
                                guild_id: $('#guild_id-edit').val(),
                                invoke_old: $('#invoke_old').val(),
                                invoke_new: $('#invoke').val(),
                                message: $('#normal_msg_desc').val()
                            },
                            success: function () {
                                location.reload();
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                switch (xhr.status) {
                                    case 406:
                                        $('#dismissible-item-error-invoke').addClass('dismiss');
                                        break;

                                    case 403:
                                        $('#dismissible-item-error-commands').addClass('dismiss');
                                        break;

                                    case 500:
                                        $('#dismissible-item-error-edit').addClass('dismiss');
                                        break;
                                }
                            }
                        });
                    } else {
                        // Embed message
                        let field_titles = [];
                        let field_descriptions = [];
                        let field_inlines = [];

                        $('.embed-field-i').each(function () {
                            field_titles.push($(this).find('[id^="embed-field-title-edit"]').val());
                            field_descriptions.push($(this).find('[id^="embed-field-description-edit"]').val());
                            field_inlines.push($(this).attr('class').split(/\s+/)[1]);
                        });

                        $.ajax({
                            global: false,
                            type: 'POST',
                            url: '/submit/customcommands_embed_edit',
                            dataType: 'html',
                            data: {
                                guild_id: $('#guild_id-edit').val(),
                                invoke_old: $('#invoke_old').val(),
                                invoke_new: $('#invoke').val(),

                                color: $('#color-picker-edit').val(),
                                author_icon: $('#embed-author-icon-edit').attr('src'),
                                author_name: $('#embed-author-name-edit').val(),
                                author_link: $('#embed-author-link-edit').val(),
                                thumbnail: $('#embed-thumbnail-edit').attr('src'),
                                title: $('#embed-title-edit').val(),
                                title_link: $('#embed-title-link-edit').val(),
                                description: $('#embed-description-edit').val(),

                                field_titles: field_titles.join("$€%¥"),
                                field_descriptions: field_descriptions.join("$€%¥"),
                                field_inlines: field_inlines.join("$€%¥"),

                                image: $('#embed-image-edit').attr('src'),
                                footer_icon: $('#embed-footer-icon-edit').attr('src'),
                                footer_text: $('#embed-footer-text-edit').val(),
                                timestamp: $('#embed-timestamp-edit').val()
                            },
                            success: function () {
                                location.reload();
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                switch (xhr.status) {
                                    case 406:
                                        $('#dismissible-item-error-invoke').addClass('dismiss');
                                        break;

                                    case 403:
                                        $('#dismissible-item-error-commands').addClass('dismiss');
                                        break;

                                    case 500:
                                        $('#dismissible-item-error-edit').addClass('dismiss');
                                        break;
                                }
                            }
                        });
                    }
                });
            }
        });
    }
}
