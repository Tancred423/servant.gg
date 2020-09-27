////////////////////////////////////////////
// General
////////////////////////////////////////////

// Startup
$(document).ready(() => {
    // Console
    console.log('%cSERVANT ', 'color: #7289da; font-size: 50px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log('%cYour multifunctional Discord bot ', 'color: #fff; font-size: 25px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log('%cDM Servant with "I found your console!" to receive a hidden achievement.', 'color: #fff; font-size: 10px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log('%c   ', 'font-size:110px; background:url(https://i.imgur.com/gSEFj8Q.png) no-repeat;');
    console.log('%cHold up!', 'color: #f04747; font-size: 35px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')
    console.log("%cIf someone told you to copy/paste something here you have an 11/10 chance you're being scammed.", 'color: #fff; font-size: 20px; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;')

    // Collapsibles
    $('.collapsible').collapsible();

    // Saving-Circle on "saved" per default
    circleSaved();

    // Twemoji
    twemoji.parse(document.body);
});

// Mobile navigation menu
$(".burger-icon").on("click", () => {
    if ($(".main-nav").hasClass("mobile-hide")) {
        $(".main-nav").removeClass("mobile-hide");
        $(".main-nav").addClass("mobile-show");
    } else {
        $(".main-nav").addClass("mobile-hide");
        $(".main-nav").removeClass("mobile-show");
    }
});

// User logout menu 
$(".user-logged-in").on("click", () => {
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

// Collapsibles
(() => {
    let requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
    window.requestAnimationFrame = requestAnimationFrame;
})();

// Dismissables
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

// Cookies
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
    setCookie('redirect', redirect, 7);
    window.location.href = window.location.origin + '/auth'
}

// Multiselect
$(".chosen-select").chosen({
    no_results_text: "Oops, nothing found!"
});

// Text channel dropdowns
$(document).ready(() => {
    if ($('#tc').val() == 0 || $('#tc').val() == null) {
        $('#tc').css("color", "#858585");
    }

    if ($('#tc-list').val() == 0 || $('#tc-list').val() == null) {
        $('#tc-list').css("color", "#858585");
    }

    if ($('#livestream-ping-role').val() == 0 || $('#livestream-ping-role').val() == null) {
        $('#livestream-ping-role').css("color", "#858585");
    }
});

function changeTcSel(sel) {
    if (sel.value != '0') {
        sel.style.color = "#fff";
    } else {
        sel.style.color = "#858585";
    }
}

// URL check
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

////////////////////////////////////////////
// HELP PAGE
////////////////////////////////////////////

// Tabs on help page (command categories)
function openComm(evt, commName) {
    evt.preventDefault();

    let i, tabcontent, tablinks;
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

if (document.getElementById("defaultOpen") !== null)
    document.getElementById("defaultOpen").click();

////////////////////////////////////////////
// DASHBOARD
////////////////////////////////////////////

// Setting input fields to required when there's a value is required to make the label stay at the top.
// This is not practical for actual required input fields.
function setRequired(arg) {
    if (!arg.value) arg.removeAttribute("required", "");
    else arg.setAttribute("required", "");
}

// Saving-Circle animations
function circleSaved() {
    $('.circle-loader').addClass('load-complete');
    $('.checkmark').css("display", "block");
    $('.circle-label').text("Saved");
}

function circleError() {
    $('.circle-loader').addClass('load-error');
    $('.errormark').css("display", "block");
    $('.errormark2').css("display", "block");
    $('.circle-label').text("Error");
}

function circleLoading() {
    $('.circle-loader').removeClass('load-complete');
    $('.circle-loader').removeClass('load-error');
    $('.checkmark').css("display", "none");
    $('.errormark').css("display", "none");
    $('.errormark2').css("display", "none");
    $('.circle-label').html("Saving...");
}

// Check when user is done typing in input field
/* Upon keyup a timeout function will be saved in "typingTimer"
 * If the user performs another key up before the timeout function is executed,
 * the "typingTimer" will be cleared and will receive a new timout function.
 * This way, the saving will be executed after the user stopped typing. */
var typingTimer;
var interval1s = 1000;
var interval2s = 2000;

////////////// USER SETTINGS //////////////

// Prefix in user settings
$('#prefix-us').on('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitUs, interval1s);
});

// Language in user settings
$('#language-us').on('change', () => {
    submitUs();
});

// Birthday in user settings
/* There is a keyup (typing) and direct function in case the user uses the date field selection.
 * submitBday() will be called from a onchange event. */
$('#birthday').keyup(() => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitUs, interval1s);
});

function submitBday() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitUs, interval1s);
}

// Submit for "Clear birthday" button in user settings
function submitUsBdayClear() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user-settings',
        dataType: 'html',
        data: {
            prefix: $('#prefix-us').val(),
            language: $('#language-us').val(),
            bio: $('#bio').val(),
            birthday: '0000-00-00',
            bdayGuilds: $('#bday-guilds').val().join('|'),
            color: $('#embedcolor').val(),
            bg1: $('#bg-1').is(':checked'),
            bg2: $('#bg-2').is(':checked'),
            bg3: $('#bg-3').is(':checked'),
            bg4: $('#bg-4').is(':checked'),
            bg5: $('#bg-5').is(':checked'),
            bg6: $('#bg-6').is(':checked'),
            bg7: $('#bg-7').is(':checked'),
            bg8: $('#bg-8').is(':checked'),
            bg9: $('#bg-9').is(':checked')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
                // Reload, so the date field is resetted
                setTimeout(() => {
                    location.reload();
                }, 200);
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Birthday guilds multi select in user settings
function submitBdayGuilds() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitUs, interval2s);
}

// Bio in user settings
$('#bio').on('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitUs, interval1s);
});

// Embed color in user settings
$('#embedcolor').on('change', () => {
    submitUs();
});

// Submit for "Reset color" button in user settings
function submitUsColorClear() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user-settings',
        dataType: 'html',
        data: {
            prefix: $('#prefix-us').val(),
            language: $('#language-us').val(),
            bio: $('#bio').val(),
            birthday: $('#birthday').val(),
            bdayGuilds: $('#bday-guilds').val().join('|'),
            color: '#7289da',
            bg1: $('#bg-1').is(':checked'),
            bg2: $('#bg-2').is(':checked'),
            bg3: $('#bg-3').is(':checked'),
            bg4: $('#bg-4').is(':checked'),
            bg5: $('#bg-5').is(':checked'),
            bg6: $('#bg-6').is(':checked'),
            bg7: $('#bg-7').is(':checked'),
            bg8: $('#bg-8').is(':checked'),
            bg9: $('#bg-9').is(':checked')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
                // Reload, so the date field is resetted
                setTimeout(() => {
                    location.reload();
                }, 200);
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}


// Submit for "Reset background" button in user settings
function submitUsBgClear() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user-settings',
        dataType: 'html',
        data: {
            prefix: $('#prefix-us').val(),
            language: $('#language-us').val(),
            bio: $('#bio').val(),
            birthday: $('#birthday').val(),
            bdayGuilds: $('#bday-guilds').val().join('|'),
            color: $('#embedcolor').val(),
            bg1: true,
            bg2: false,
            bg3: false,
            bg4: false,
            bg5: false,
            bg6: false,
            bg7: false,
            bg8: false,
            bg9: false
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
                // Reload, so the date field is resetted
                setTimeout(() => {
                    location.reload();
                }, 200);
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Submit user settings
function submitUs() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/user-settings',
        dataType: 'html',
        data: {
            prefix: $('#prefix-us').val(),
            language: $('#language-us').val(),
            bio: $('#bio').val(),
            birthday: $('#birthday').val(),
            bdayGuilds: $('#bday-guilds').val().join('|'),
            color: $('#embedcolor').val(),
            bg1: $('#bg-1').is(':checked'),
            bg2: $('#bg-2').is(':checked'),
            bg3: $('#bg-3').is(':checked'),
            bg4: $('#bg-4').is(':checked'),
            bg5: $('#bg-5').is(':checked'),
            bg6: $('#bg-6').is(':checked'),
            bg7: $('#bg-7').is(':checked'),
            bg8: $('#bg-8').is(':checked'),
            bg9: $('#bg-9').is(':checked')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

///////////// GUILD SETTINGS /////////////

// Prefix in guild settings
$('#prefix-gs').on('keyup', () => {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitGs, interval1s);
});

// Language in guild settings
$('#language-gs').on('change', () => {
    submitGs();
});

// Timezone in guild settings
$('#timezone').on('change', () => {
    submitGs();
});

// Servant-Moderator roles multi select in guild settings
function submitModRoles() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitGs, interval2s);
}

// Mod role selection to color 'no mod role' gray
$("#mod").change(() => {
    if ($(this).val() == "0") $(this).addClass("empty-option");
    else $(this).removeClass("empty-option")
});
$("#mod").change();

// Submit guild settings
$('#send-gs').click((event) => {
    event.preventDefault();

    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/guild-settings',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            prefix: $('#prefix').val(),
            language: $('#language').val(),
            modRole: $('#mod').val(),
            achievements: $('#achievements').is(':checked'),
            cmddeletion: $('#cmddeletion').is(':checked'),
            eastereggs: $('#eastereggs').is(':checked'),
            leveling: $('#leveling').is(':checked')
        },
        success: () => {
            // Success banner
            $('#dismissable-success').addClass('dismiss');
        },
        error: () => {
            // Error banner
            $('#dismissable-error').addClass('dismiss');
        }
    });
});

// Submit guild settings
function submitGs() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/guild-settings',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            prefix: $('#prefix-gs').val(),
            language: $('#language-gs').val(),
            timezone: $('#timezone').val(),
            modRoles: $('#mod-roles').val().join('|'),
            achievements: $('#achievements').is(':checked'),
            cmddeletion: $('#cmddeletion').is(':checked'),
            eastereggs: $('#eastereggs').is(':checked')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

/////////// GUILD CATEGORIES ///////////

// Submit categories in guild's dashboard (slider checkbox)
function submitCategories(checkbox, category) {
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/category-toggle',
        dataType: 'html',
        data: {
            guildId: checkbox.getAttribute('name'),
            category: category,
            checked: checkbox.checked
        },
        success: () => { },
        error: () => {
            $('#dismissible-item').addClass('dismiss'); // "Couldn't update category toggles."
        }
    });
}

/////////// GUILD COMMANDS ///////////

// Submit commands in guild's dashboard (slider checkbox)
function submitCommands(checkbox, command) {
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/command-toggle',
        dataType: 'html',
        data: {
            guildId: checkbox.getAttribute('name'),
            command: command,
            checked: checkbox.checked
        },
        success: () => { },
        error: () => {
            $('#dismissible-item-com').addClass('dismiss'); // "Couldn't update command toggle."
        }
    });
}

/////////// GUILD PLUGINS ///////////

// Submit plugins in guild's dashboard (slider checkbox)
function submitPlugins(checkbox, plugin) {
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/plugin-toggle',
        dataType: 'html',
        data: {
            guildId: checkbox.getAttribute('name'),
            plugin: plugin,
            checked: checkbox.checked
        },
        success: () => { },
        error: () => {
            $('#dismissible-item-plugin').addClass('dismiss'); // "Couldn't update plugin toggle."
        }
    });
}

/////////// EMBED CREATION ////////////
var maxFields = 25;
var fields;
var fieldAi;

function getDirektLink() {
    let url = prompt('Enter image URL (direkt link!)');

    if (url && isValidHttpUrl(url) && isValidDirectLink(url)) return url;
    else return null;
}

// Close modal
function closeModal(element) {
    element.closest('.modal').remove();
}

// Create
// Author
function addAuthorCreate(addButton) {
    addButton.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<div class="embed-author-left">' +
        '<div class="embed-author-icon-wrapper-create">' +
        '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-create" name="add-author-icon" value="+" onclick="addAuthorIconCreate(this);" />' +
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
        '<input class="btn-redirect empty" type="button" id="delete-author-create" name="delete-author" value="x" onclick="deleteAuthorCreate(this);" />' +
        '</div>';

    $('.embed-author-wrapper-create').append(html);
}

function deleteAuthorCreate(deleteButton) {
    deleteButton.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-author-create" name="add-embed-author" value="+ Author" onclick="addAuthorCreate(this);" />' +
        '</div>';

    $('.embed-author-wrapper-create').append(html);
};

function addAuthorIconCreate(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-author-icon').remove();

        let html = '<div class="embed-author-icon">' +
            '<a onclick="addAuthorIcon(this);">' +
            '<img src="' + url + '" id="embed-author-icon-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-author-icon-create" name="delete-author-icon" value="x" onclick="deleteAuthorIconCreate(this);" />' +
            '</div>';

        $('.embed-author-icon-wrapper-create').append(html);
    }
}

function deleteAuthorIconCreate(deleteButton) {
    deleteButton.closest('.embed-author-icon').remove();

    let html = '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-create" name="add-author-icon" value="+" onclick="addAuthorIconCreate(this);" />' +
        '</div>';

    $('.embed-author-icon-wrapper-create').append(html);
};

// Thumbnail
function addThumbCreate(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-thumbnail').remove();

        let html = '<div class="embed-thumbnail">' +
            '<a onclick="addThumb(this);" class="thumb">' +
            '<img src="' + url + '" id="embed-thumbnail-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-thumbnail-create" name="delete-thumbnail" value="x" onclick="deleteThumbCreate(this);" />' +
            '</div>';

        $('.embed-thumbnail-wrapper-create').append(html);
    }
}

function deleteThumbCreate(deleteButton) {
    deleteButton.closest('.embed-thumbnail').remove();

    let html = '<div class="embed-thumbnail">' +
        '<input class="btn-redirect empty" type="button" id="add-thumbnail-create" name="add-thumbnail" value="+ Thumbnail" onclick="addThumbCreate(this);" />' +
        '</div>';

    $('.embed-thumbnail-wrapper-create').append(html);
};

// Title
function addTitleCreate(addButton) {
    addButton.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input type="text" name="embed-title" id="embed-title-create" placeholder="Title" maxlength="256" required />' +

        '<div class="embed-title-link">' +
        '<input type="url" name="embed-title-link" id="embed-title-link-create" placeholder="Title URL" />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-title-create" name="delete-title" value="x" onclick="deleteTitleCreate(this);" />' +
        '</div>';

    $('.embed-title-wrapper-create').append(html);
}

function deleteTitleCreate(deleteButton) {
    deleteButton.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-title-create" name="add-embed-title" value="+ Title" onclick="addTitleCreate(this);" />' +
        '</div>';

    $('.embed-title-wrapper-create').append(html);
};

// Description
function addDescriptionCreate(addButton) {
    addButton.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<textarea name="embed-description" id="embed-description-create" placeholder="Description" maxlength="2048" required></textarea>' +
        '<input class="btn-redirect empty" type="button" id="delete-description-create" name="delete-description" value="x" onclick="deleteDescriptionCreate(this);" />' +
        '</div>';

    $('.embed-description-wrapper-create').append(html);
}

function deleteDescriptionCreate(deleteButton) {
    deleteButton.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-description-create" name="add-embed-description" value="+ Description" onclick="addDescriptionCreate(this);" />' +
        '</div>';

    $('.embed-description-wrapper-create').append(html);
};

// Fields
function addFieldInlineCreate() {
    if (fields <= maxFields) {
        let html = '<div class="embed-field-i inline">' +
            '<div class="embed-inline-field-title">' +
            '<input type="text" name="embed-inline-field-title" id="embed-field-title-create-' + fieldAi + '" placeholder="Inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-inline-field-description">' +
            '<textarea name="embed-inline-field-description" id="embed-field-description-create-' + fieldAi + '" placeholder="Inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-create" type="button" id="delete-field-create-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldCreate(this);" />' +
            '</div>';

        $("#embed-fields-create").append(html);

        fields++;
        fieldAi++;
    } else {
        alert('You reached the limits!')
    }
}

function addFieldNonInlineCreate() {
    if (fields <= maxFields) {
        let html = '<div class="embed-field-i non-inline">' +
            '<div class="embed-non-inline-field-title">' +
            '<input type="text" name="embed-non-inline-field-title" id="embed-field-title-create-' + fieldAi + '" placeholder="Non-inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-non-inline-field-description">' +
            '<textarea name="embed-non-inline-field-description" id="embed-field-description-create-' + fieldAi + '" placeholder="Non-inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-create" type="button" id="delete-field-create-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldCreate(this);" />' +
            '</div>';

        $("#embed-fields-create").append(html);

        fields++;
        fieldAi++;
    } else {
        alert('You reached the limits!')
    }
}

function deleteFieldCreate(deleteButton) {
    deleteButton.closest('.embed-field-i').remove();
    fields--;
}

// Image
function addImgCreate(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-image').remove();

        let html = '<div class="embed-image">' +
            '<a onclick="addImg(this);" class="img">' +
            '<img src="' + url + '" id="embed-image-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-img-create" name="delete-img" value="x" onclick="deleteImgCreate(this);" />' +
            '</div>';

        $('.embed-image-wrapper-create').append(html);
    }
}

function deleteImgCreate(deleteButton) {
    deleteButton.closest('.embed-image').remove();

    let html = '<div class="embed-image">' +
        '<input class="btn-redirect empty" type="button" id="add-img-create" name="add-img" value="+ Image" onclick="addImgCreate(this);" />' +
        '</div>';

    $('.embed-image-wrapper-create').append(html);
};

// Footer
function addFooterCreate(addButton) {
    addButton.closest('.embed-footer').remove();

    let html = '<div class="embed-footer-used">' +
        '<div class="embed-footer-icon-wrapper-create">' +
        '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-create" name="add-footer-icon" value="+" onclick="addFooterIconCreate(this);" />' +
        '</div>' +
        '</div>' +

        '<div class="embed-footer-text">' +
        '<input type="text" name="embed-footer-text" id="embed-footer-text-create" placeholder="Footer" maxlength="2048" required />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-footer-create" name="delete-footer" value="x" onclick="deleteFooterCreate(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-create').append(html);
}

function deleteFooterCreate(deleteButton) {
    deleteButton.closest('.embed-footer-used').remove();

    let html = ' <div class="embed-footer">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-footer-create" name="add-embed-footer" value="+ Footer" onclick="addFooterCreate(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-create').append(html);
};

function addFooterIconCreate(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-footer-icon').remove();

        let html = '<div class="embed-footer-icon">' +
            '<a onclick="addFooterIcon(this);">' +
            '<img src="' + url + '" id="embed-footer-icon-create">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-create" name="delete-footer-icon" value="x" onclick="deleteFooterIconCreate(this);" />' +
            '</div>';

        $('.embed-footer-icon-wrapper-create').append(html);
    }
}

function deleteFooterIconCreate(deleteButton) {
    deleteButton.closest('.embed-footer-icon').remove();

    let html = '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-create" name="add-footer-icon" value="+" onclick="addFooterIconCreate(this);" />' +
        '</div>';

    $('.embed-footer-icon-wrapper-create').append(html);
};

// Timestamp
function addTimestampCreate(addButton) {
    addButton.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input type="datetime-local" name="embed-timestamp" id="embed-timestamp-create" />' +
        '<input class="btn-redirect empty" type="button" id="delete-timestamp-create" name="delete-timestamp" value="x" onclick="deleteTimestampCreate(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-create').append(html);
}

function deleteTimestampCreate(deleteButton) {
    deleteButton.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-timestamp-create" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampCreate(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-create').append(html);
};

// Edit
// Author
function addAuthorEdit(addButton) {
    addButton.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<div class="embed-author-left">' +
        '<div class="embed-author-icon-wrapper-edit">' +
        '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="addAuthorIconEdit(this);" />' +
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
        '<input class="btn-redirect empty" type="button" id="delete-author-edit" name="delete-author" value="x" onclick="deleteAuthorEdit(this);" />' +
        '</div>';

    $('.embed-author-wrapper-edit').append(html);
}

function deleteAuthorEdit(deleteButton) {
    deleteButton.closest('.embed-author').remove();

    let html = '<div class="embed-author">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-author-edit" name="add-embed-author" value="+ Author" onclick="addAuthorEdit(this);" />' +
        '</div>';

    $('.embed-author-wrapper-edit').append(html);
};

function addAuthorIconEdit(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-author-icon').remove();

        let html = '<div class="embed-author-icon">' +
            '<a onclick="addAuthorIcon(this);">' +
            '<img src="' + url + '" id="embed-author-icon-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-author-icon-edit" name="delete-author-icon" value="x" onclick="deleteAuthorIconEdit(this);" />' +
            '</div>';

        $('.embed-author-icon-wrapper-edit').append(html);
    }
}

function deleteAuthorIconEdit(deleteButton) {
    deleteButton.closest('.embed-author-icon').remove();

    let html = '<div class="embed-author-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="addAuthorIconEdit(this);" />' +
        '</div>';

    $('.embed-author-icon-wrapper-edit').append(html);
};

// Thumbnail
function addThumbEdit(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-thumbnail').remove();

        let html = '<div class="embed-thumbnail">' +
            '<a onclick="addThumb(this);" class="thumb">' +
            '<img src="' + url + '" id="embed-thumbnail-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-thumbnail-edit" name="delete-thumbnail" value="x" onclick="deleteThumbEdit(this);" />' +
            '</div>';

        $('.embed-thumbnail-wrapper-edit').append(html);
    }
}

function deleteThumbEdit(deleteButton) {
    deleteButton.closest('.embed-thumbnail').remove();

    let html = '<div class="embed-thumbnail">' +
        '<input class="btn-redirect empty" type="button" id="add-thumbnail-edit" name="add-thumbnail" value="+ Thumbnail" onclick="addThumbEdit(this);" />' +
        '</div>';

    $('.embed-thumbnail-wrapper-edit').append(html);
};

// Title
function addTitleEdit(addButton) {
    addButton.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input type="text" name="embed-title" id="embed-title-edit" placeholder="Title" maxlength="256" required />' +

        '<div class="embed-title-link">' +
        '<input type="url" name="embed-title-link" id="embed-title-link-edit" placeholder="Title URL" />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-title-edit" name="delete-title" value="x" onclick="deleteTitleEdit(this);" />' +
        '</div>';

    $('.embed-title-wrapper-edit').append(html);
}

function deleteTitleEdit(deleteButton) {
    deleteButton.closest('.embed-title').remove();

    let html = '<div class="embed-title">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-title-edit" name="add-embed-title" value="+ Title" onclick="addTitleEdit(this);" />' +
        '</div>';

    $('.embed-title-wrapper-edit').append(html);
};

// Description
function addDescriptionEdit(addButton) {
    addButton.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<textarea name="embed-description" id="embed-description-edit" placeholder="Description" maxlength="2048" required></textarea>' +
        '<input class="btn-redirect empty" type="button" id="delete-description-edit" name="delete-description" value="x" onclick="deleteDescriptionEdit(this);" />' +
        '</div>';

    $('.embed-description-wrapper-edit').append(html);
}

function deleteDescriptionEdit(deleteButton) {
    deleteButton.closest('.embed-description').remove();

    let html = '<div class="embed-description">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-description-edit" name="add-embed-description" value="+ Description" onclick="addDescriptionEdit(this);" />' +
        '</div>';

    $('.embed-description-wrapper-edit').append(html);
};

// Fields
function addFieldInlineEdit() {
    if (fields <= maxFields) {
        let html = '<div class="embed-field-i inline">' +
            '<div class="embed-inline-field-title">' +
            '<input type="text" name="embed-inline-field-title" id="embed-field-title-edit-' + fieldAi + '" placeholder="Inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-inline-field-description">' +
            '<textarea name="embed-inline-field-description" id="embed-field-description-edit-' + fieldAi + '" placeholder="Inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldEdit(this);" />' +
            '</div>';

        $("#embed-fields-edit").append(html);

        fields++;
        fieldAi++;
    } else {
        alert('You reached the limits!')
    }
}

function addFieldNonInlineEdit() {
    if (fields <= maxFields) {
        let html = '<div class="embed-field-i non-inline">' +
            '<div class="embed-non-inline-field-title">' +
            '<input type="text" name="embed-non-inline-field-title" id="embed-field-title-edit-' + fieldAi + '" placeholder="Non-inline field title" maxlength="256" required />' +
            '</div>' +
            '<div class="embed-non-inline-field-description">' +
            '<textarea name="embed-non-inline-field-description" id="embed-field-description-edit-' + fieldAi + '" placeholder="Non-inline field description" maxlength="1024" required></textarea>' +
            '</div>' +
            '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldEdit(this);" />' +
            '</div>';

        $("#embed-fields-edit").append(html);

        fields++;
        fieldAi++;
    } else {
        alert('You reached the limits!')
    }
}

function deleteFieldEdit(deleteButton) {
    deleteButton.closest('.embed-field-i').remove();
    fields--;
}

// Image
function addImgEdit(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-image').remove();

        let html = '<div class="embed-image">' +
            '<a onclick="addImg(this);" class="img">' +
            '<img src="' + url + '" id="embed-image-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-img-edit" name="delete-img" value="x" onclick="deleteImgEdit(this);" />' +
            '</div>';

        $('.embed-image-wrapper-edit').append(html);
    }
}

function deleteImgEdit(deleteButton) {
    deleteButton.closest('.embed-image').remove();

    let html = '<div class="embed-image">' +
        '<input class="btn-redirect empty" type="button" id="add-img-edit" name="add-img" value="+ Image" onclick="addImgEdit(this);" />' +
        '</div>';

    $('.embed-image-wrapper-edit').append(html);
};

// Footer
function addFooterEdit(addButton) {
    addButton.closest('.embed-footer').remove();

    let html = '<div class="embed-footer-used">' +
        '<div class="embed-footer-icon-wrapper-edit">' +
        '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="addFooterIconEdit(this);" />' +
        '</div>' +
        '</div>' +

        '<div class="embed-footer-text">' +
        '<input type="text" name="embed-footer-text" id="embed-footer-text-edit" placeholder="Footer" maxlength="2048" required />' +
        '</div>' +
        '<input class="btn-redirect empty" type="button" id="delete-footer-edit" name="delete-footer" value="x" onclick="deleteFooterEdit(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-edit').append(html);
}

function deleteFooterEdit(deleteButton) {
    deleteButton.closest('.embed-footer-used').remove();

    let html = ' <div class="embed-footer">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-footer-edit" name="add-embed-footer" value="+ Footer" onclick="addFooterEdit(this);" />' +
        '</div>';

    $('.embed-footer-wrapper-edit').append(html);
};

function addFooterIconEdit(addButton) {
    let url = getDirektLink();

    if (url != null) {
        addButton.closest('.embed-footer-icon').remove();

        let html = '<div class="embed-footer-icon">' +
            '<a onclick="addFooterIcon(this);">' +
            '<img src="' + url + '" id="embed-footer-icon-edit">' +
            '</a>' +
            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-edit" name="delete-footer-icon" value="x" onclick="deleteFooterIconEdit(this);" />' +
            '</div>';

        $('.embed-footer-icon-wrapper-edit').append(html);
    }
}

function deleteFooterIconEdit(deleteButton) {
    deleteButton.closest('.embed-footer-icon').remove();

    let html = '<div class="embed-footer-icon">' +
        '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="addFooterIconEdit(this);" />' +
        '</div>';

    $('.embed-footer-icon-wrapper-edit').append(html);
};

// Timestamp
function addTimestampEdit(addButton) {
    addButton.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input type="datetime-local" name="embed-timestamp" id="embed-timestamp-edit" />' +
        '<input class="btn-redirect empty" type="button" id="delete-timestamp-edit" name="delete-timestamp" value="x" onclick="deleteTimestampEdit(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-edit').append(html);
}

function deleteTimestampEdit(deleteButton) {
    deleteButton.closest('.embed-timestamp').remove();

    let html = '<div class="embed-timestamp">' +
        '<input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampEdit(this);" />' +
        '</div>';

    $('.embed-timestamp-wrapper-edit').append(html);
};

// Auto role plugin
$(document).ready(() => {
    let maxFields = 10; // Maximum amount of auto roles
    let wrapper = $(".container1");
    let addButton = $(".add-form-field");

    let x = 1;

    $(addButton).click(function (e) {
        e.preventDefault();

        if ($('#role-10').length != 0) x = 11;
        else if ($('#role-9').length != 0) x = 10;
        else if ($('#role-8').length != 0) x = 9;
        else if ($('#role-7').length != 0) x = 8;
        else if ($('#role-6').length != 0) x = 7;
        else if ($('#role-5').length != 0) x = 6;
        else if ($('#role-4').length != 0) x = 5;
        else if ($('#role-3').length != 0) x = 4;
        else if ($('#role-2').length != 0) x = 3;
        else if ($('#role-1').length != 0) x = 2;

        if (x <= maxFields) {
            var rolesSelect = [];
            rolesSelect.push('<div class="roles">');
            rolesSelect.push('<a href="#" class="delete"><i class="fas fa-times-circle"></i></a>');
            rolesSelect.push('<select onchange="submitAutoRoles();" id="role-' + x + '" name="role-' + x + '" style="margin-left: 17px; margin-right:10px;">');
            rolesSelect.push('<option value="0" disabled selected>Select a role</option>');

            globalBotRoles.forEach(role => {
                let colorcode = role.color === 0 ? "FFFFFF" : role.color.toString(16);

                if (role.name !== "@everyone") {
                    rolesSelect.push('<option value="' + role.id + '" style="color: #' + colorcode + '">')
                    rolesSelect.push(role.name)
                    rolesSelect.push('</option>')
                }
            });

            rolesSelect.push('</select>');
            rolesSelect.push('<input type="number" id="delay-' + x + '" name="delay-' + x + '" placeholder="delay (min)" onkeyup="handleDelay(this)" style="margin-left:5px;">');
            rolesSelect.push('</div>');
            $(wrapper).append(rolesSelect.join("")); //add input box
            x++;
        } else {
            alert('You reached the limits!')
        }
    });

    $(wrapper).on("click", ".delete", function (e) {
        e.preventDefault();
        $(this).parent('div').remove();
        x--;
        submitAutorole();
    });

    // Initial coloring of roles
    for (let i = 1; i <= 10; i++) {
        setColor(i);
    }

    $('select.role-1').change(() => {
        setColor(1);
    });
    $('select.role-2').change(() => {
        setColor(2);
    });
    $('select.role-3').change(() => {
        setColor(3);
    });
    $('select.role-4').change(() => {
        setColor(4);
    });
    $('select.role-5').change(() => {
        setColor(5);
    });
    $('select.role-6').change(() => {
        setColor(6);
    });
    $('select.role-7').change(() => {
        setColor(7);
    });
    $('select.role-8').change(() => {
        setColor(8);
    });
    $('select.role-9').change(() => {
        setColor(9);
    });
    $('select.role-10').change(() => {
        setColor(10);
    });
});

function setColor(pos) {
    var style = $('select.role-' + pos).find('option:selected').attr('style');
    if (style === undefined) return;
    var color = "#" + style.split("#")[1];
    color = color.substring(0, color.length - 1);
    $('select.role-' + pos).css('color', color);
}

function handleDelay(input) {
    input.value = input.value > 60 ? 60 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitAutorole, interval1s);
}

function submitAutoRoles() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitAutorole, interval2s);
}

function submitAutorole() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/auto-role',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            ar1Val: $('#role-1').find(":selected").val(),
            ar1Delay: $('#delay-1').val(),
            ar2Val: $('#role-2').find(":selected").val(),
            ar2Delay: $('#delay-2').val(),
            ar3Val: $('#role-3').find(":selected").val(),
            ar3Delay: $('#delay-3').val(),
            ar4Val: $('#role-4').find(":selected").val(),
            ar4Delay: $('#delay-4').val(),
            ar5Val: $('#role-5').find(":selected").val(),
            ar5Delay: $('#delay-5').val(),
            ar6Val: $('#role-6').find(":selected").val(),
            ar6Delay: $('#delay-6').val(),
            ar7Val: $('#role-7').find(":selected").val(),
            ar7Delay: $('#delay-7').val(),
            ar8Val: $('#role-8').find(":selected").val(),
            ar8Delay: $('#delay-8').val(),
            ar9Val: $('#role-9').find(":selected").val(),
            ar9Delay: $('#delay-9').val(),
            ar10Val: $('#role-10').find(":selected").val(),
            ar10Delay: $('#delay-10').val(),
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: function (xhr, status, text) {
            if (xhr.status === 406) {
                $('#dismissible-item').addClass('dismiss'); // "You cannot set he same role twice."
            }

            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Best of image plugin & best of quote plugin
var target = document.getElementById("emoji");
var emojiCount = emoji.length;
var locationSplit = window.location.href.split('/');

$(document).ready(() => {
    let pluginName = locationSplit[locationSplit.length - 1];
    if (pluginName == 'best-of-image') {
        addPickerListenerBoi();
    } else if (pluginName == 'best-of-quote') {
        addPickerListenerBoq();
    }
});

function addPickerListenerBoi() {
    $("#picker-0").lsxEmojiPicker({
        closeOnSelect: true,
        twemoji: true,
        onSelect: function (emoji) {
            $("#picker-0").html(emoji.value);
            twemoji.parse(document.getElementById("picker-0"));
            addPickerListenerBoi();
            submitBestOfImage();
        }
    })
}

function addPickerListenerBoq() {
    $("#picker-0").lsxEmojiPicker({
        closeOnSelect: true,
        twemoji: true,
        onSelect: function (emoji) {
            $("#picker-0").html(emoji.value);
            twemoji.parse(document.getElementById("picker-0"));
            addPickerListenerBoq();
            submitBestOfQuote();
        }
    })
}

// Best of image plugin
function handlePercentageBoi(input) {
    input.value = input.value > 100 ? 100 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfImage, interval1s);
}

function handleFlatBoi(input) {
    input.value = input.value > 500000 ? 500000 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfImage, interval1s);
}

function doneTypingBestOfImage() {
    submitBestOfImage();
}

function submitBestOfImage() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/best-of-image',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            percentage: $('#percentage').val(),
            flat: $('#flat').val(),
            tcId: $('#tc').val(),
            emoji: $('#picker-0').find('.emoji').attr('alt')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Best of quote plugin
function handlePercentageBoq(input) {
    input.value = input.value > 100 ? 100 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfQuote, interval1s);
}

function handleFlatBoq(input) {
    input.value = input.value > 500000 ? 500000 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingBestOfQuote, interval1s);
}

function doneTypingBestOfQuote() {
    submitBestOfQuote();
}

function submitBestOfQuote() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/best-of-quote',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            percentage: $('#percentage').val(),
            flat: $('#flat').val(),
            tcId: $('#tc').val(),
            emoji: $('#picker-0').find('.emoji').attr('alt')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Birthday plugin
function submitBirthday() {
    let guildUser = $('#guild-user-id').val();
    let guildId = guildUser.split("|")[0];
    let userId = guildUser.split("|")[1];

    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/birthday',
        dataType: 'html',
        data: {
            guildId: guildId,
            servantBday: $('#birthday-servant').is(':checked'),
            announcementTcId: $('#tc').val(),
            listTcId: $('#tc-list').val(),
            userId: userId
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Custom commands plugin
function showNormalMsg() {
    $('#normal-msg-desc').prop('required', true);

    // Tabs
    $('#tab-embed').removeClass('active-cc');
    $('#tab-normal').addClass('active-cc');

    // Content
    $('#embed-msg').css('display', 'none')
    $('#normal-msg').css('display', 'block');
}

function showEmbedMsg() {
    $('#normal-msg-desc').prop('required', false);

    // Tabs
    $('#tab-normal').removeClass('active-cc');
    $('#tab-embed').addClass('active-cc');

    // Content
    $('#normal-msg').css('display', 'none')
    $('#embed-msg').css('display', 'block');
}

function openModalCreateCc() {
    if (globalCommandsAmount < 100) {
        rr = 0;
        rrAi = 0;
        currAi = 0;

        fields = 1;
        fieldAi = 1;

        let html =
            '<div id="reactionrole-modal-create" class="modal">' +

            '    <!-- Modal content -->' +
            '    <div class="modal-content cc-content">' +
            '        <span id="closeCreate" class="close" onclick="closeModal(this);">&times;</span>' +

            '        <form action="/submit/custom-commands" method="POST" id="form-custom-commands">' +
            '            <div id="dismissible-item-error-create" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>' +
            '            <div id="dismissible-item-error-invoke" data-component="dismissible-item" data-type="error" data-value="This invoke has already been used."></div>' +
            '            <div id="dismissible-item-error-commands" data-component="dismissible-item" data-type="error" data-value="You already have 100 custom commands."></div>' +
            '            <div id="dismissible-item-error-name" data-component="dismissible-item" data-type="error" data-value="Your invoke or one of your aliases is equal to an existing command name or alias of Servant."></div>' +

            '            <div class="embed-warning">' +
            '                If you refresh or quit the page, your progress will be lost!' +
            '            </div>' +

            '            <div class="container small dark">' +
            '                <div class="padding-top padding-bottom padding-left padding-right">' +
            '                    <div class="settings-disclaimer embed tc">' +
            '                        <div>This is how the command will be used.</div>' +
            '                        <br />' +
            '                        <div class="invoke-wrapper">' +
            '                           <div class="prefix">' + globalPrefix + '</div>' +
            '                           <div class="form-group embed invoke-div">' +
            '                               <input type="text" id="invoke" name="invoke" maxlength="100" title="No spaces allowed!" pattern="[^\' \']+" required>' +
            '                               <label for="invoke" class="control-label">Command Name (Invoke)</label><i class="bar"></i>' +
            '                           </div>' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +
            '           <br/>' +
            '           <div class="container small dark">' +
            '               <div class="padding-top padding-bottom padding-left padding-right">' +
            '                   <div class="settings-disclaimer embed">' +
            '                       <div>Command aliases. Seperate multiple aliases by comma. (Max. 10)</div>' +
            '                       <div class="tags-input" data-name="tags-input">' +
            '                       </div>' +
            '                   </div>' +
            '               </div>' +
            '           </div>';

        // Normal or embed message?
        html +=
            '<div class="tab-cc">' +
            '   <div id="tab-normal" class="tablinks-cc grp-a active-cc" onclick="showNormalMsg();"><i class="far fa-envelope"></i> Normal Message</div>' +
            '   <div id="tab-embed" class="tablinks-cc grp-b" onclick="showEmbedMsg();"><i class="fas fa-envelope"></i> Embed Message</div>' +
            '</div>';


        // Normal
        html +=
            '<div id="normal-msg">' +
            '   <div id="normal-msg-wrapper">' +
            '       <textarea name="normal-msg-desc" id="normal-msg-desc" placeholder="Your message" maxlength="2000" required></textarea>' +
            '   </div>' +
            '</div>';

        // Embed
        html +=
            '<div id="embed-msg">';


        let disabled = globalIsSupporter ? '' : 'disabled';

        html +=
            '            <div class="embed-field">';

        if (!globalIsSupporter) {
            html +=
                '                <div class="supporter-tooltip">' +
                '                    <a href="/donate">' +
                '                        <span class="supporter-tooltip-wrapper">' +
                '                            <span class="supporter-tooltiptext">' +
                '                                <h3>Embed Colours</h3>' +
                '                                <h3>Become a supporter</h3>' +
                '                                <img src="/images/become_supporter.png" alt="Supporter">' +
                '                            </span>' +
                '                        </span>' +
                '                    </a>';
        }

        html +=
            '                    <div id="color-picker-wrapper-create">';

        let color = globalColorCode.length > 0 ? globalColorCode[0].color_code : '#7289da';

        html +=
            '                        <input name="color-picker" type="color" value="' + color + '" id="color-picker-create" ' + disabled + '>' +
            '                    </div>';

        if (!globalIsSupporter) {
            html +=
                '                </div>';
        }

        html +=
            '                <div class="embed-content">' +
            '                    <div class="embed-author-wrapper-create">' +
            '                        <div class="embed-author">' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-author-create" name="add-embed-author" value="+ Author" onclick="addAuthorCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-thumbnail-wrapper-create">' +
            '                        <div class="embed-thumbnail">' +
            '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-create" name="add-thumbnail" value="+ Thumbnail" onclick="addThumbCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-title-wrapper-create">' +
            '                        <div class="embed-title">' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-title-create" name="add-embed-title" value="+ Title" onclick="addTitleCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-description-wrapper-create">' +
            '                        <div class="embed-description">' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-description-create" name="add-embed-description" value="+ Description" onclick="addDescriptionCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="add-buttons">' +
            '                        <div class="btn-redirect empty rr" id="add-inline-field-create" name ="add-inline-field" onclick="addFieldInlineCreate();">+ Inline Field</div>' +
            '                        <div class="btn-redirect empty rr" id="add-non-inline-field-create" name ="add-non-inline-field" onclick="addFieldNonInlineCreate();">+ Non-inline Field</div>' +
            '                    </div>' +
            '                    <div id="embed-fields-create"></div>' +

            '                    <div class="embed-image-wrapper-create">' +
            '                        <div class="embed-image">' +
            '                            <input class="btn-redirect empty" type="button" id="add-image-create" name="add-image" value="+ Image" onclick="addImgCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-complete-footer-wrapper-create">' +
            '                        <div class="embed-footer-wrapper-create">' +
            '                            <div class="embed-footer">' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-create" name="add-embed-footer" value="+ Footer" onclick="addFooterCreate(this);" />' +
            '                            </div>' +
            '                        </div>' +

            '                        <div class="embed-divider">|</div>' +

            '                        <div class="embed-timestamp-wrapper-create">' +
            '                            <div class="embed-timestamp">' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-create" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampCreate(this);" />' +
            '                            </div>' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>';

        html +=
            '</div>';


        html +=
            '            <!-- to include it in url params -->' +
            '            <input type="hidden" id="guild-id-create" name="guild-id" value="' + globalGuild.id + '" />' +

            '            <div class="center-button">' +
            '                <button type="submit" class="btn-redirect center-button margin-top">Save</button>' +
            '            </div>' +
            '        </form>' +
            '    </div>' +
            '</div>';

        $('#modals-wrapper').append(html);

        // Dismissables
        refreshDismissibles(window);

        // Add script for color picker
        var colorPicker = document.getElementById("color-picker-create");
        var colorPickerWrapper = document.getElementById("color-picker-wrapper-create");
        colorPicker.onchange = () => {
            colorPickerWrapper.style.backgroundColor = colorPicker.value;
        }
        colorPickerWrapper.style.backgroundColor = colorPicker.value;

        // Aliases
        [].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
            let hiddenInput = document.createElement('input');
            let mainInput = document.createElement('input');
            let tags = [];

            hiddenInput.setAttribute('type', 'hidden');
            hiddenInput.setAttribute('name', el.getAttribute('data-name'));

            mainInput.setAttribute('type', 'text');
            mainInput.classList.add('main-input');
            mainInput.addEventListener('input', () => {
                let enteredTags = mainInput.value.split(',');
                if (enteredTags.length > 1) {
                    enteredTags.forEach(function (t) {
                        let filteredTag = filterTag(t, globalPrefix);
                        if (filteredTag.length > 0)
                            addTag(filteredTag);
                    });
                    mainInput.value = '';
                }
            });
            mainInput.addEventListener('blur', () => {
                if (!mainInput.value.endsWith(',')) {
                    mainInput.value = mainInput.value + ",";
                    let enteredTags = mainInput.value.split(',');
                    if (enteredTags.length > 1) {
                        enteredTags.forEach(function (t) {
                            let filteredTag = filterTag(t, globalPrefix);
                            if (filteredTag.length > 0)
                                addTag(filteredTag);
                        });
                        mainInput.value = '';
                    }
                }
            });

            mainInput.addEventListener('keydown', function (e) {
                let keyCode = e.which || e.keyCode;
                if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
                    removeTag(tags.length - 1);
                }
            });

            el.appendChild(mainInput);
            el.appendChild(hiddenInput);

            function addTag(text) {
                let tag = {
                    text: text,
                    element: document.createElement('span'),
                };

                tag.element.classList.add('tag');
                tag.element.textContent = tag.text;

                let closeBtn = document.createElement('span');
                closeBtn.classList.add('closetag');
                closeBtn.addEventListener('click', () => {
                    removeTag(tags.indexOf(tag));
                });
                tag.element.prepend(closeBtn);

                tags.push(tag);

                el.insertBefore(tag.element, mainInput);

                refreshTags();
            }

            function removeTag(index) {
                let tag = tags[index];
                tags.splice(index, 1);
                el.removeChild(tag.element);
                refreshTags();
            }

            function refreshTags() {
                let tagsList = [];
                tags.forEach(function (t) {
                    tagsList.push(t.text);
                });
                hiddenInput.value = tagsList.join(',');
            }

            function filterTag(tag, prefix) {
                let filteredTag = tag.replace(/\s/g, '');
                return filteredTag ? prefix + filteredTag : '';
            }
        });

        // Submit custom commands
        $('#form-custom-commands').on("submit", function (e) {
            e.preventDefault();

            let submitTags = [];
            let iterator = 0;
            $('.tag').each(function (i) {
                if (iterator < 10) {
                    let alias = $(this).text().replace(globalPrefix, '');
                    if (alias != $('#invoke').val()) {
                        submitTags.push(alias);
                        iterator++;
                    }
                }
            });
            let uniqueTags = Array.from(new Set(submitTags));

            if ($('#tab-normal').hasClass('active-cc')) {
                // Normal message
                $.ajax({
                    global: false,
                    type: 'POST',
                    url: '/submit/custom-commands-normal',
                    dataType: 'html',
                    data: {
                        guildId: $('#guild-id-create').val(),
                        invoke: $('#invoke').val(),
                        aliases: JSON.stringify(uniqueTags),
                        message: $('#normal-msg-desc').val()
                    },
                    success: () => {
                        location.reload();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        switch (xhr.status) {
                            case 406:
                                $('#dismissible-item-error-invoke').addClass('dismiss'); // "This invoke has already been used."
                                break;

                            case 403:
                                $('#dismissible-item-error-commands').addClass('dismiss'); // "You already have 100 custom commands."
                                break;

                            case 409:
                                $('#dismissible-item-error-name').addClass('dismiss'); // "Your invoke or one of your aliases is equal to an existing command name or alias of Servant."
                                break;

                            case 500:
                                $('#dismissible-item-error-create').addClass('dismiss'); // "Something went wrong."
                                break;
                        }
                    }
                });
            } else {
                // Embed message
                let fieldTitles = [];
                let fieldDescriptions = [];
                let fieldInlines = [];

                $('.embed-field-i').each(function () {
                    fieldTitles.push($(this).find('[id^="embed-field-title-create"]').val());
                    fieldDescriptions.push($(this).find('[id^="embed-field-description-create"]').val());
                    fieldInlines.push($(this).attr('class').split(/\s+/)[1]);
                });

                $.ajax({
                    global: false,
                    type: 'POST',
                    url: '/submit/custom-commands-embed',
                    dataType: 'html',
                    data: {
                        guildId: $('#guild-id-create').val(),
                        invoke: $('#invoke').val(),
                        aliases: JSON.stringify(uniqueTags),

                        color: $('#color-picker-create').val(),
                        authorIcon: $('#embed-author-icon-create').attr('src'),
                        authorName: $('#embed-author-name-create').val(),
                        authorLink: $('#embed-author-link-create').val(),
                        thumbnail: $('#embed-thumbnail-create').attr('src'),
                        title: $('#embed-title-create').val(),
                        titleLink: $('#embed-title-link-create').val(),
                        description: $('#embed-description-create').val(),

                        fieldTitles: JSON.stringify(fieldTitles),
                        fieldDescriptions: JSON.stringify(fieldDescriptions),
                        fieldInlines: JSON.stringify(fieldInlines),

                        image: $('#embed-image-create').attr('src'),
                        footerIcon: $('#embed-footer-icon-create').attr('src'),
                        footerText: $('#embed-footer-text-create').val(),
                        timestamp: $('#embed-timestamp-create').val()
                    },
                    success: () => {
                        location.reload();
                    },
                    error: function (xhr, ajaxOptions, thrownError) {
                        switch (xhr.status) {
                            case 406:
                                $('#dismissible-item-error-invoke').addClass('dismiss'); // "This invoke has already been used."
                                break;

                            case 403:
                                $('#dismissible-item-error-commands').addClass('dismiss'); // "You already have 100 custom commands."
                                break;

                            case 409:
                                $('#dismissible-item-error-name').addClass('dismiss'); // "Your invoke or one of your aliases is equal to an existing command name or alias of Servant."
                                break;

                            case 500:
                                $('#dismissible-item-error-create').addClass('dismiss'); // "Something went wrong."
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

function deleteCc(button) {
    if (confirm('Are you sure to delete this custom command?')) {
        let nameSplit = button.name.split("|");
        let guildId = nameSplit[0];
        let invoke = nameSplit[1];

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/custom-commands-delete',
            dataType: 'html',
            data: {
                guildId: guildId,
                invoke: invoke
            },
            success: () => {
                location.reload();
            },
            error: () => {
                $('#dismissible-item-delete').addClass('dismiss'); // Couldn't delete custom command.
            }
        });
    } else return;
}

function openModalEditCc(button) {
    var isNormalMessage;

    var ccId;
    var invoke;

    var normalMsg;

    var colorcode;
    var authorName;
    var authorUrl;
    var authorIconUrl;
    var title;
    var titleUrl;
    var thumbnailUrl;
    var description;
    var imageUrl;
    var footer;
    var footerIconUrl;

    var lFields = [];
    fields = 1;
    fieldAi = 1;

    if (globalCcs.length > 0) {
        globalCcs.forEach(cc => {
            if (cc.invoke == button.name) {
                ccId = cc.id;
                invoke = cc.invoke;

                if (cc.normal_msg) {
                    // Normal message
                    isNormalMessage = true;

                    colorcode = globalColorCode.length > 0 ? (globalColorCode[0] ? globalColorCode[0].color_code : '#7289da') : '#7289da';

                    normalMsg = cc.normal_msg;
                } else {
                    // Embed message
                    isNormalMessage = false;

                    globalCcEmbeds.forEach(ccEmbed => {
                        if (ccEmbed.cc_id == ccId) {
                            colorcode = ccEmbed.colorcode;
                            authorName = ccEmbed.author_name;
                            authorUrl = ccEmbed.author_url;
                            authorIconUrl = ccEmbed.author_icon_url;
                            title = ccEmbed.title;
                            titleUrl = ccEmbed.title_url;
                            thumbnailUrl = ccEmbed.thumbnail_url;
                            description = ccEmbed.description;
                            imageUrl = ccEmbed.image_url;
                            footer = ccEmbed.footer;
                            footerIconUrl = ccEmbed.footer_icon_url;
                        }
                    });

                    if (globalCcFields.length > 0) {
                        let i = 0;
                        globalCcFields.forEach(ccField => {
                            if (i < 25 && ccField.cc_id == ccId) {
                                lFields.push({
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
                    '<div id="reactionrole-modal-edit" class="modal">' +
                    '    <!-- Modal content -->' +
                    '    <div class="modal-content cc-content">' +
                    '        <span id="close-edit" class="close" onclick="closeModal(this);">&times;</span>' +

                    '        <form action="/submit/custom-commands" method="POST" id="form-custom-commands">' +
                    '            <div id="dismissible-item-error-edit" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>' +
                    '            <div id="dismissible-item-error-invoke" data-component="dismissible-item" data-type="error" data-value="This invoke has already been used."></div>' +
                    '            <div id="dismissible-item-error-commands" data-component="dismissible-item" data-type="error" data-value="You already have 100 custom commands."></div>' +
                    '            <div id="dismissible-item-error-name" data-component="dismissible-item" data-type="error" data-value="Your invoke or one of your aliases is equal to an existing command name or alias of Servant."></div>' +

                    '            <div class="embed-warning">' +
                    '                If you refresh or quit the page, your progress will be lost!' +
                    '            </div>' +

                    '            <div class="container small dark">' +
                    '                <div class="padding-top padding-bottom padding-left padding-right">' +
                    '                    <div class="settings-disclaimer embed tc">' +
                    '                        <div>This is how the command will be used.</div>' +
                    '                        <br />' +
                    '                        <div class="invoke-wrapper">' +
                    '                           <div class="prefix">' + globalPrefix + '</div>' +
                    '                           <div class="form-group embed invoke-div">' +
                    '                               <input type="text" id="invoke" name="invoke" maxlength="100" required value="' + invoke + '">' +
                    '                               <label for="invoke" class="control-label">Command Name (Invoke)</label><i class="bar"></i>' +
                    '                           </div>' +
                    '                        </div>' +
                    '                    </div>' +
                    '                </div>' +
                    '            </div>' +
                    '           <br/>' +
                    '           <div class="container small dark">' +
                    '               <div class="padding-top padding-bottom padding-left padding-right">' +
                    '                   <div class="settings-disclaimer embed">' +
                    '                       <div>Command aliases. Seperate multiple aliases by comma. (Max. 10)</div>' +
                    '                       <div class="tags-input" data-name="tags-input">' +
                    '                       </div>' +
                    '                   </div>' +
                    '               </div>' +
                    '           </div>';

                // Normal or embed message?
                html +=
                    '<div class="tab-cc">' +
                    '   <div id="tab-normal" class="tablinks-cc grp-a ' + (isNormalMessage ? 'active-cc' : '') + '" onclick="showNormalMsg();"><i class="far fa-envelope"></i> Normal Message</div>' +
                    '   <div id="tab-embed" class="tablinks-cc grp-b ' + (isNormalMessage ? '' : 'active-cc') + '" onclick="showEmbedMsg();"><i class="fas fa-envelope"></i> Embed Message</div>' +
                    '</div>';


                // Normal
                html +=
                    '<div id="normal-msg">' +
                    '   <div id="normal-msg-wrapper">' +
                    '       <textarea name="normal-msg-desc" id="normal-msg-desc" placeholder="Your message" maxlength="2000" required>' + (isNormalMessage ? normalMsg : '') + '</textarea>' +
                    '   </div>' +
                    '</div>';

                // Embed
                html +=
                    '<div id="embed-msg">';

                html +=
                    '            <div class="embed-field">';

                // Non-supporter tooltip
                let disabled = globalIsSupporter ? "" : "disabled";

                if (!globalIsSupporter) {
                    html +=
                        '                <div class="supporter-tooltip">' +
                        '                    <a href="/donate">' +
                        '                        <span class="supporter-tooltip-wrapper">' +
                        '                            <span class="supporter-tooltiptext">' +
                        '                                <h3>Embed Colours</h3>' +
                        '                                <h3>Become a supporter</h3>' +
                        '                                <img src="/images/become_supporter.png" alt="Supporter">' +
                        '                            </span>' +
                        '                        </span>' +
                        '                    </a>';

                }

                // Color picker
                html +=
                    '                    <div id="color-picker-wrapper-edit">' +
                    '                        <input name="color-picker" type="color" value="' + colorcode + '" id="color-picker-edit" ' + disabled + '>' +
                    '                    </div>';


                // Closing non-supporter tooltip
                if (!globalIsSupporter) {
                    html +=
                        '                </div>';
                }

                // Embed content
                html +=
                    '                <div class="embed-content">';

                // Author
                html +=
                    '                    <div class="embed-author-wrapper-edit">';

                if (authorName) {
                    html +=
                        '<div class="embed-author">' +
                        '<div class="embed-author-left">' +
                        '<div class="embed-author-icon-wrapper-edit">';

                    // Author Icon
                    if (authorIconUrl) {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<a onclick="addAuthorIcon(this);">' +
                            '<img src="' + authorIconUrl + '" id="embed-author-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-author-icon-edit" name="delete-author-icon" value="x" onclick="deleteAuthorIconEdit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="addAuthorIconEdit(this);" />' +
                            '</div>';
                    }

                    // Author Name & Url
                    html +=
                        '</div>' +
                        '</div>' +

                        '<div class="embed-author-right">' +
                        '<span class="embed-author-name">' +
                        '<input value="' + authorName + '" type="text" name="embed-author-name" id="embed-author-name-edit" placeholder="Author Name" maxlength="256" required />' +
                        '</span>' +

                        '<div class="embed-author-link">' +
                        '<input value="' + authorUrl + '" type="url" name="embed-author-link" id="embed-author-link-edit" placeholder="Author Name URL" maxlength="5000" />' +
                        '</div>' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-author-edit" name="delete-author" value="x" onclick="deleteAuthorEdit(this);" />' +
                        '</div>';
                } else {
                    // Author add button
                    html +=

                        '                        <div class="embed-author">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-author-edit" name="add-embed-author" value="+ Author" onclick="addAuthorEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Thumbnail
                html +=
                    '                    <div class="embed-thumbnail-wrapper-edit">';

                if (thumbnailUrl) {
                    html +=
                        '<div class="embed-thumbnail">' +
                        '<a onclick="addThumb(this);" class="thumb">' +
                        '<img src="' + thumbnailUrl + '" id="embed-thumbnail-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-thumbnail-edit" name="delete-thumbnail" value="x" onclick="deleteThumbEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-thumbnail">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-edit" name="add-thumbnail" value="+ Thumbnail" onclick="addThumbEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Title
                html +=
                    '                    <div class="embed-title-wrapper-edit">';

                if (title) {
                    html +=
                        '<div class="embed-title">' +
                        '<input value="' + title + '" type="text" name="embed-title" id="embed-title-edit" placeholder="Title" maxlength="256" required />' +

                        '<div class="embed-title-link">' +
                        '<input value="' + titleUrl + '" type="url" name="embed-title-link" id="embed-title-link-edit" placeholder="Title URL" />' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-title-edit" name="delete-title" value="x" onclick="deleteTitleEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-title">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-title-edit" name="add-embed-title" value="+ Title" onclick="addTitleEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Description
                html +=
                    '                    <div class="embed-description-wrapper-edit">';

                if (description) {
                    html +=
                        '<div class="embed-description">' +
                        '<textarea name="embed-description" id="embed-description-edit" placeholder="Description" maxlength="2048" required>' + description + '</textarea>' +
                        '<input class="btn-redirect empty" type="button" id="delete-description-edit" name="delete-description" value="x" onclick="deleteDescriptionEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-description">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-description-edit" name="add-embed-description" value="+ Description" onclick="addDescriptionEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Field add buttons
                html +=
                    '                    <div class="add-buttons">' +
                    '                        <div class="btn-redirect empty rr" id="add-inline-field-edit" name ="add-inline-field" onclick="addFieldInlineEdit();">+ Inline Field</div>' +
                    '                        <div class="btn-redirect empty rr" id="add-non-inline-field-edit" name ="add-non-inline-field" onclick="addFieldNonInlineEdit();">+ Non-inline Field</div>' +
                    '                    </div>';

                // Fields
                html +=
                    '                    <div id="embed-fields-edit">';

                if (lFields.length > 0) {
                    lFields.forEach(field => {
                        if (field.inline) {
                            html +=
                                '<div class="embed-field-i inline">' +
                                '<div class="embed-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-inline-field-title" id="embed-field-title-edit-' + fieldAi + '" placeholder="Inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-inline-field-description">' +
                                '<textarea name="embed-inline-field-description" id="embed-field-description-edit-' + fieldAi + '" placeholder="Inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldEdit(this);" />' +
                                '</div>';
                        } else {
                            html +=
                                '<div class="embed-field-i non-inline">' +
                                '<div class="embed-non-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-non-inline-field-title" id="embed-field-title-edit-' + fieldAi + '" placeholder="Non-inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-non-inline-field-description">' +
                                '<textarea name="embed-non-inline-field-description" id="embed-field-description-edit-' + fieldAi + '" placeholder="Non-inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldEdit(this);" />' +
                                '</div>';
                        }

                        fields++;
                        fieldAi++;
                    });
                }

                html +=
                    '                   </div>';

                // Image
                html +=
                    '                    <div class="embed-image-wrapper-edit">';

                if (imageUrl) {
                    html +=
                        '<div class="embed-image">' +
                        '<a onclick="addImg(this);" class="img">' +
                        '<img src="' + imageUrl + '" id="embed-image-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-img-edit" name="delete-img" value="x" onclick="deleteImgEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-image">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-image-edit" name="add-image" value="+ Image" onclick="addImgEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Footer Complete
                html +=
                    '                    <div class="embed-complete-footer-wrapper-edit">';

                // Footer
                html +=
                    '                        <div class="embed-footer-wrapper-edit">';

                if (footer) {
                    html +=
                        '<div class="embed-footer-used">';

                    // Footer Icon
                    html +=
                        '<div class="embed-footer-icon-wrapper-edit">';

                    if (footerIconUrl) {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<a onclick="addFooterIcon(this);">' +
                            '<img src="' + footerIconUrl + '" id="embed-footer-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-edit" name="delete-footer-icon" value="x" onclick="deleteFooterIconEdit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="addFooterIconEdit(this);" />' +
                            '</div>';
                    }

                    html +=
                        '</div>';

                    // Footer Text
                    html +=
                        '<div class="embed-footer-text">' +
                        '<input value="' + footer + '" type="text" name="embed-footer-text" id="embed-footer-text-edit" placeholder="Footer" maxlength="2048" required />' +
                        '</div>' +

                        '<input class="btn-redirect empty" type="button" id="delete-footer-edit" name="delete-footer" value="x" onclick="deleteFooterEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                            <div class="embed-footer">' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-edit" name="add-embed-footer" value="+ Footer" onclick="addFooterEdit(this);" />' +
                        '                            </div>';
                }

                html +=
                    '                        </div>';

                // Divider
                html +=
                    '                        <div class="embed-divider">|</div>';

                // Timestamp 
                html +=
                    '                        <div class="embed-timestamp-wrapper-edit">';


                let timestampWasSet = false;

                if (globalTimestampTzs) {
                    globalTimestampTzs.forEach(globalTimestampTz => {
                        if (globalTimestampTz.cc_id == ccId) {
                            timestampWasSet = true;
                            let timestampTz = globalTimestampTz.tz.substring(0, 16);
                            if (timestampTz == 'Invalid date') {
                                html +=
                                    '                            <div class="embed-timestamp">' +
                                    '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampEdit(this);" />' +
                                    '                            </div>';
                            } else {
                                html +=
                                    '<div class="embed-timestamp">' +
                                    '   <input value="' + timestampTz + '" type="datetime-local" name="embed-timestamp" id="embed-timestamp-edit" />' +
                                    '   <input class="btn-redirect empty" type="button" id="delete-timestamp-edit" name="delete-timestamp" value="x" onclick="deleteTimestampEdit(this);" />' +
                                    '</div>';
                            }
                        }
                    });
                }

                if (!timestampWasSet) {
                    html +=
                        '                            <div class="embed-timestamp">' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampEdit(this);" />' +
                        '                            </div>';
                }

                html +=
                    '                        </div>' +
                    '                  </div>' +
                    '           </div>';


                // Closing ealier stuff
                html +=
                    '                    </div>';

                html +=
                    '            </div>';


                html +=
                    '            <!-- to include it in url params -->' +
                    '            <input type="hidden" id="guild-id-edit" name="guild-id" value="' + globalGuild.id + '" />' +
                    '            <input type="hidden" id="invoke-old" name="invoke-old" value="' + invoke + '" />' +

                    '            <div class="center-button">' +
                    '                <button type="submit" class="btn-redirect center-button margin-top">Update</button>' +
                    '            </div>' +
                    '        </form>' +
                    '    </div>' +
                    '</div>';

                $('#modals-wrapper').append(html);

                if (!isNormalMessage) showEmbedMsg();
                refreshDismissibles(window);

                // Add script for color picker
                var colorPicker = document.getElementById("color-picker-edit");
                var colorPickerWrapper = document.getElementById("color-picker-wrapper-edit");
                colorPicker.onchange = () => {
                    colorPickerWrapper.style.backgroundColor = colorPicker.value;
                }
                colorPickerWrapper.style.backgroundColor = colorPicker.value;

                // Aliases
                [].forEach.call(document.getElementsByClassName('tags-input'), function (el) {
                    let hiddenInput = document.createElement('input');
                    let mainInput = document.createElement('input');
                    let tags = [];

                    hiddenInput.setAttribute('type', 'hidden');
                    hiddenInput.setAttribute('name', el.getAttribute('data-name'));

                    mainInput.setAttribute('type', 'text');

                    // Get aliases in array
                    let aliases = [];
                    globalCcAliases.forEach(ccAlias => {
                        if (ccAlias.invoke == invoke)
                            aliases.push(ccAlias.alias);
                    });

                    // Write aliases into value like: tag1,tag2,tag3
                    aliases.forEach(alias => {
                        if (mainInput.value) mainInput.value = mainInput.value + ",";
                        mainInput.value = mainInput.value + alias;
                    });
                    mainInput.value = mainInput.value + ",";

                    mainInput.classList.add('main-input');
                    mainInput.addEventListener('input', () => {
                        let enteredTags = mainInput.value.split(',');
                        if (enteredTags.length > 1) {
                            enteredTags.forEach(function (t) {
                                let filteredTag = filterTag(t, globalPrefix);
                                if (filteredTag.length > 0)
                                    addTag(filteredTag);
                            });
                            mainInput.value = '';
                        }
                    });
                    mainInput.addEventListener('blur', () => {
                        if (!mainInput.value.endsWith(',')) {
                            mainInput.value = mainInput.value + ",";
                            let enteredTags = mainInput.value.split(',');
                            if (enteredTags.length > 1) {
                                enteredTags.forEach(function (t) {
                                    let filteredTag = filterTag(t, globalPrefix);
                                    if (filteredTag.length > 0)
                                        addTag(filteredTag);
                                });
                                mainInput.value = '';
                            }
                        }
                    });

                    mainInput.addEventListener('keydown', function (e) {
                        let keyCode = e.which || e.keyCode;
                        if (keyCode === 8 && mainInput.value.length === 0 && tags.length > 0) {
                            removeTag(tags.length - 1);
                        }
                    });

                    el.appendChild(mainInput);
                    el.appendChild(hiddenInput);

                    // Convert string into actual tags
                    let enteredTags = mainInput.value.split(',');
                    if (enteredTags.length > 1) {
                        enteredTags.forEach(function (t) {
                            let filteredTag = filterTag(t, globalPrefix);
                            if (filteredTag.length > 0)
                                addTag(filteredTag);
                        });
                        mainInput.value = '';
                    }

                    function addTag(text) {
                        let tag = {
                            text: text,
                            element: document.createElement('span'),
                        };

                        tag.element.classList.add('tag');
                        tag.element.textContent = tag.text;

                        let closeBtn = document.createElement('span');
                        closeBtn.classList.add('closetag');
                        closeBtn.addEventListener('click', () => {
                            removeTag(tags.indexOf(tag));
                        });
                        tag.element.prepend(closeBtn);

                        tags.push(tag);

                        el.insertBefore(tag.element, mainInput);

                        refreshTags();
                    }

                    function removeTag(index) {
                        let tag = tags[index];
                        tags.splice(index, 1);
                        el.removeChild(tag.element);
                        refreshTags();
                    }

                    function refreshTags() {
                        let tagsList = [];
                        tags.forEach(function (t) {
                            tagsList.push(t.text);
                        });
                        hiddenInput.value = tagsList.join(',');
                    }

                    function filterTag(tag, prefix) {
                        let filteredTag = tag.replace(/\s/g, '');
                        return filteredTag ? prefix + filteredTag : '';
                    }
                });

                $('#form-custom-commands').on("submit", function (e) {
                    e.preventDefault();

                    let submitTags = [];
                    let iterator = 0;
                    $('.tag').each(function (i) {
                        if (iterator < 10) {
                            let alias = $(this).text().replace(globalPrefix, '');
                            if (alias != $('#invoke').val()) {
                                submitTags.push(alias);
                                iterator++;
                            }
                        }
                    });
                    let uniqueTags = Array.from(new Set(submitTags));

                    if ($('#tab-normal').hasClass('active-cc')) {
                        // Normal message
                        $.ajax({
                            global: false,
                            type: 'POST',
                            url: '/submit/custom-commands-normal-edit',
                            dataType: 'html',
                            data: {
                                guildId: $('#guild-id-edit').val(),
                                invokeOld: $('#invoke-old').val(),
                                invokeNew: $('#invoke').val(),
                                aliases: JSON.stringify(uniqueTags),
                                message: $('#normal-msg-desc').val()
                            },
                            success: () => {
                                location.reload();
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                switch (xhr.status) {
                                    case 406:
                                        $('#dismissible-item-error-invoke').addClass('dismiss'); // "This invoke has already been used."
                                        break;

                                    case 403:
                                        $('#dismissible-item-error-commands').addClass('dismiss'); // "You already have 100 custom commands."
                                        break;

                                    case 409:
                                        $('#dismissible-item-error-name').addClass('dismiss'); // "Your invoke or one of your aliases is equal to an existing command name or alias of Servant."
                                        break;

                                    case 500:
                                        $('#dismissible-item-error-create').addClass('dismiss'); // "Something went wrong."
                                        break;
                                }
                            }
                        });
                    } else {
                        // Embed message
                        let fieldTitles = [];
                        let fieldDescriptions = [];
                        let fieldInlines = [];

                        $('.embed-field-i').each(function () {
                            fieldTitles.push($(this).find('[id^="embed-field-title-edit"]').val());
                            fieldDescriptions.push($(this).find('[id^="embed-field-description-edit"]').val());
                            fieldInlines.push($(this).attr('class').split(/\s+/)[1]);
                        });

                        $.ajax({
                            global: false,
                            type: 'POST',
                            url: '/submit/custom-commands-embed-edit',
                            dataType: 'html',
                            data: {
                                guildId: $('#guild-id-edit').val(),
                                invokeOld: $('#invoke-old').val(),
                                invokeNew: $('#invoke').val(),
                                aliases: JSON.stringify(uniqueTags),

                                color: $('#color-picker-edit').val(),
                                authorIcon: $('#embed-author-icon-edit').attr('src'),
                                authorName: $('#embed-author-name-edit').val(),
                                authorLink: $('#embed-author-link-edit').val(),
                                thumbnail: $('#embed-thumbnail-edit').attr('src'),
                                title: $('#embed-title-edit').val(),
                                titleLink: $('#embed-title-link-edit').val(),
                                description: $('#embed-description-edit').val(),

                                fieldTitles: JSON.stringify(fieldTitles),
                                fieldDescriptions: JSON.stringify(fieldDescriptions),
                                fieldInlines: JSON.stringify(fieldInlines),

                                image: $('#embed-image-edit').attr('src'),
                                footerIcon: $('#embed-footer-icon-edit').attr('src'),
                                footerText: $('#embed-footer-text-edit').val(),
                                timestamp: $('#embed-timestamp-edit').val()
                            },
                            success: () => {
                                location.reload();
                            },
                            error: function (xhr, ajaxOptions, thrownError) {
                                switch (xhr.status) {
                                    case 406:
                                        $('#dismissible-item-error-invoke').addClass('dismiss'); // "This invoke has already been used."
                                        break;

                                    case 403:
                                        $('#dismissible-item-error-commands').addClass('dismiss'); // "You already have 100 custom commands."
                                        break;

                                    case 409:
                                        $('#dismissible-item-error-name').addClass('dismiss'); // "Your invoke or one of your aliases is equal to an existing command name or alias of Servant."
                                        break;

                                    case 500:
                                        $('#dismissible-item-error-create').addClass('dismiss'); // "Something went wrong."
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

// Embed plugin
$(document).ready(() => {
    if (window.location.href.endsWith('embed')) {
        var colorPicker = document.getElementById("color-picker-create");
        var colorPickerWrapper = document.getElementById("color-picker-wrapper-create");
        colorPicker.onchange = () => {
            colorPickerWrapper.style.backgroundColor = colorPicker.value;
        }
        colorPickerWrapper.style.backgroundColor = colorPicker.value;

        fields = 1;
        fieldAi = 1;
    }
});

$('#form-embed').submit(function (e) {
    e.preventDefault();

    let fieldTitles = [];
    let fieldDescriptions = [];
    let fieldInlines = [];

    $('.embed-field-i').each(function () {
        fieldTitles.push($(this).find('[id^="embed-field-title-create"]').val());
        fieldDescriptions.push($(this).find('[id^="embed-field-description-create"]').val());
        fieldInlines.push($(this).attr('class').split(/\s+/)[1]);
    });

    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/embed',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            tcId: $('#tc').val(),
            color: $('#color-picker-create').val(),
            authorIcon: $('#embed-author-icon-create').attr('src'),
            authorName: $('#embed-author-name-create').val(),
            authorLink: $('#embed-author-link-create').val(),
            thumbnail: $('#embed-thumbnail-create').attr('src'),
            title: $('#embed-title-create').val(),
            titleLink: $('#embed-title-link-create').val(),
            description: $('#embed-description-create').val(),

            fieldTitles: JSON.stringify(fieldTitles),
            fieldDescriptions: JSON.stringify(fieldDescriptions),
            fieldInlines: JSON.stringify(fieldInlines),

            image: $('#embed-image-create').attr('src'),
            footerIcon: $('#embed-footer-icon-create').attr('src'),
            footerText: $('#embed-footer-text-create').val(),
            timestamp: $('#embed-timestamp-create').val()
        },
        success: () => {
            $('#dismissible-item-success').addClass('dismiss');
        },
        error: function (xhr, ajaxOptions, thrownError) {
            switch (xhr.status) {
                case 406:
                    $('#dismissible-item-error-permission').addClass('dismiss'); // "I cannot write in that text channel."
                    break;

                case 403:
                    $('#dismissible-item-error-tc').addClass('dismiss'); // "I cannot find that text channel."
                    break;

                case 500:
                    $('#dismissible-item-error').addClass('dismiss'); // "Something went wrong."
                    break;
            }
        }
    });
});

// Join plugin
function handleJoinMsg(input) {
    input.value = input.value > 2048 ? 2048 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingJoin, interval1s);
}

function doneTypingJoin() {
    submitJoin();
}

function submitJoin() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/join',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            joinMsg: $('#join-msg').val(),
            tcId: $('#tc').val()
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Leave plugin
function handleLeaveMsg(input) {
    input.value = input.value > 2048 ? 2048 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(doneTypingLeave, interval1s);
}

function doneTypingLeave() {
    submitLeave();
}

function submitLeave() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/leave',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            leaveMsg: $('#leave-msg').val(),
            tcId: $('#tc').val()
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Level plugin
function handleLevelSpeed() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitLevel, interval1s);
}

function handleLevel(input) {
    input.value = input.value > 9999 ? 9999 : input.value < 1 ? 1 : input.value;
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitLevel, interval2s);
}

function handleLevelSelect() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitLevel, interval2s);
}

function submitLevel() {
    let levels = [];
    let roleIds = [];

    $('.roles').each(function () {
        let levelValue = $(this).find('[id^="level-"]').val();
        levels.push(levelValue == "" ? "0" : levelValue);
        let roleIdValue = $(this).find('[id^="level-roles-"]').val().join("|");
        roleIds.push(roleIdValue == "" ? "0" : roleIdValue);
    });

    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/level',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            notification: $('#level-up-msg').is(':checked'),
            modifier: $('#level-speed').val(),
            levels: JSON.stringify(levels),
            roleIds: JSON.stringify(roleIds)
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: function (xhr, status, text) {
            if (xhr.status === 403) {
                $('#dismissible-item').addClass('dismiss'); // "You cannot set he same role twice."
            }

            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

function levelScale(input) {
    document.getElementById("scale-display").innerHTML = parseFloat(input.value).toFixed(2) + "x" + (input.value == 1 ? " (recommended)" : "");
}

$(document).ready(() => {
    if (window.location.href.endsWith('level')) {
        lrAi = $('.chosen-container').length;;
        lrI = $('.chosen-container').length;;
    }
});

var lrAi = 1; // Current amount of level roles
var lrMax = 100; // Maximum amount of level roles
var lrI = 1; // Auto increment number of level roles to provide unique ID's

function addLevelRole() {
    if (lrAi >= lrMax) {
        alert('You have reached the limits!');
    } else {
        let html =
            '<div class="roles level">' +
            '	<span class="delete-level-role" onclick="deleteLevelRole(this)"><i class="fas fa-times-circle"></i></span>' +
            '	<input type="number" id="level-' + lrI + '" name="level-' + lrI + '" placeholder="Level" min="1" max="9999" onkeyup="handleLevel(this)" value="">' +
            '	<select onchange="handleLevelSelect();" id="level-roles-' + lrI + '" name="level-roles-' + lrI + '" data-placeholder="Select roles..." multiple class="chosen-select">';

        globalBotRoles.forEach(role => {
            if (role.name !== "@everyone") {
                html +=
                    '		<option style="color: #' + role.color.toString(16) + '" value="' + role.id + '">' + role.name + '</option>';
            }
        });

        html +=
            '	</select>' +
            '</div>';

        $("#level-roles").append(html);

        addChosen();
        lrAi++;
        lrI++;
    }
}

function deleteLevelRole(thisspan) {
    thisspan.closest(".roles").remove();
    lrAi--;
    submitLevel();
}

// Livestream plugin
function handleLivestreamSelect() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitLivestream, interval2s);
}

function submitLivestream() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/livestream',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            publicMode: $('#livestream-public').is(':checked'),
            streamerRoles: $('#livestream-roles').val().join('|'),
            liveRole: $('#livestream-role').val(),
            livestreamPingRole: $('#livestream-ping-role').val(),
            tc: $('#tc').val()
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Log plugin
function handleLogChecks() {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(submitLog, interval1s);
}

function submitLog() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/log',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            tcId: $('#tc').val(),
            msgUpdate: $('#msg-update').is(':checked'),
            msgDelete: $('#msg-delete').is(':checked'),
            categoryCreate: $('#category-create').is(':checked'),
            categoryDelete: $('#category-delete').is(':checked'),
            vcCreate: $('#vc-create').is(':checked'),
            vcDelete: $('#vc-delete').is(':checked'),
            vcJoin: $('#vc-join').is(':checked'),
            vcMove: $('#vc-move').is(':checked'),
            vcLeave: $('#vc-leave').is(':checked'),
            tcCreate: $('#tc-create').is(':checked'),
            tcDelete: $('#tc-delete').is(':checked'),
            userBan: $('#user-ban').is(':checked'),
            userUnban: $('#user-unban').is(':checked'),
            inviteCreate: $('#invite-create').is(':checked'),
            inviteDelete: $('#invite-delete').is(':checked'),
            userJoin: $('#user-join').is(':checked'),
            userLeave: $('#user-leave').is(':checked'),
            roleAdd: $('#role-add').is(':checked'),
            roleRemove: $('#role-remove').is(':checked'),
            roleCreate: $('#role-create').is(':checked'),
            roleDelete: $('#role-delete').is(':checked'),
            emoteAdd: $('#emote-add').is(':checked'),
            emoteRemove: $('#emote-remove').is(':checked'),
            boostCount: $('#boost-count').is(':checked'),
            boostTier: $('#boost-tier').is(':checked')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Media-only channel plugin
function submitMediaOnlyChannel() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/media-only-channel',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            mocWarning: $('#moc-warning').is(':checked'),
            moc: $('#moc-channels').val().join('|')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

// Reaction role plugin
function addPickerListener(id) {
    $("#" + id).lsxEmojiPicker({
        closeOnSelect: true,
        twemoji: true,
        onSelect: function (emoji) {
            $("#" + currId).html(emoji.value);
            twemoji.parse(document.getElementById(currId));
            addPickerListener(currId);
        }
    })
}

function addChosen() {
    $(".chosen-select").chosen({
        no_results_text: "Oops, nothing found!"
    })
}

function addOnClick() {
    $('.picker').on('click', function () {
        currId = $(this).attr('id');
    })
}

var rr = 0; // Current amount of reaction roles
var maxRr = 20; // Maximum amount of reaction roles
var rrAi = 0; // Auto increment number to keep unique ID's
var currId; // Current auto increment number

function addReactionRole() {
    if (rr >= maxRr) {
        alert("You've reached the limits of 20 reactions!")
    } else {
        let options = [];
        globalBotRoles.forEach(function (role) {
            if (role.name !== '@everyone') {
                let colorcode = role.color === 0 ? "FFFFFF" : role.color.toString(16);
                options.push('<option value="' + role.id + '" style="color: #' + colorcode + '">' + role.name + '</option>')
            }
        });
        let id = 'picker-' + rrAi;
        let html =
            '<div class="settings-disclaimer">' +
            '<br />' +
            '<div class="reaction-role-groups">' +
            '<div class="form-group">' +
            '<div class="picker" id="' + id + '">&#x1f44d</div>' +
            '<div class="picker-label">Emoji</div>' +
            '</div>' +

            '<div class="form-group embed">' +
            '<select name="rr-roles"  data-placeholder="Select roles..." multiple class="chosen-select">' + options.join("") + '</select>' +
            '<label for="tc" class="control-label">Role(s)</label><i class="bar"></i>' +
            '</div>' +

            '<div class="remove-rr" onclick="removeRr(this);">' +
            '<img src="/images/close.png" alt="Remove">' +
            '</div>' +
            '</div>' +
            '</div>';

        $('.reaction-role').append(html);
        let element = document.getElementById(id);
        twemoji.parse(element);
        addPickerListener(id);
        addChosen();
        addOnClick();

        rr++;
        rrAi++;
    }
}

function removeRr(dis) {
    dis.closest('.settings-disclaimer').remove();
    rr--;
}

function deleteRr(button) {
    if (confirm('Are you sure to delete this reaction role message?')) {
        let nameSplit = button.name.split("|");
        let guildId = nameSplit[0];
        let tcId = nameSplit[1];
        let msgId = nameSplit[2];

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/reaction-role-delete',
            dataType: 'html',
            data: {
                guildId: guildId,
                tcId: tcId,
                msgId: msgId
            },
            success: () => {
                location.reload();
            },
            error: () => {
                $('#dismissible-item').addClass('dismiss'); // "Couldn't delete reaction role."
            }
        });
    } else return;
}

// Reaction role create
function openModalCreate() {
    if (globalRrAmount < 20) {
        rr = 0;
        rrAi = 0;
        currAi = 0;

        fields = 1;
        fieldAi = 1;

        let html =
            '<div id="reactionrole-modal-create" class="modal">' +
            '    <div class="modal-content">' +
            '        <span id="closeCreate" class="close" onclick="closeModal(this);">&times;</span>' +
            '        <form action="/submit/reaction-role-create" method="POST" id="form-reaction-role-create">' +

            '            <div id="dismissible-item-error-create" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>' +
            '            <div id="dismissible-item-error-permission" data-component="dismissible-item" data-type="error" data-value="I cannot write in that text channel."></div>' +
            '            <div id="dismissible-item-error-tc" data-component="dismissible-item" data-type="error" data-value="I cannot find that text channel."></div>' +

            '            <div class="embed-warning">' +
            '                If you refresh or quit the page, your progress will be lost!' +
            '            </div>' +

            '            <div class="container small dark">' +
            '                <div class="padding-top padding-bottom padding-left padding-right">' +
            '                    <div class="settings-disclaimer embed tc">' +
            '                        <div>This is the text channel the embed message will be posted in.</div>' +
            '                        <br />' +
            '                        <div class="form-group embed">' +
            '                            <select id="tc-create" name="tc" onchange="changeTcSel(this);" required>' +
            '                                <option value="" selected disabled>Please select a text channel</option>';


        globalChannels.forEach(channel => {
            if ((channel.type === 'text' || channel.type === 'news') && channel.viewable) {
                html +=
                    '                                <option value="' + channel.id + '">#' + channel.name + (channel.parentName ? ' (' + channel.parentName + ')' : '') + '</option>';
            }
        });

        html +=
            '                            </select>' +
            '                            <label for="tc" class="control-label">Text Channel</label><i class="bar"></i>' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>';

        let disabled = globalIsSupporter ? '' : 'disabled';

        html +=
            '            <div class="embed-field">';

        if (!globalIsSupporter) {
            html +=
                '                <div class="supporter-tooltip">' +
                '                    <a href="/donate">' +
                '                        <span class="supporter-tooltip-wrapper">' +
                '                            <span class="supporter-tooltiptext">' +
                '                                <h3>Embed Colours</h3>' +
                '                                <h3>Become a supporter</h3>' +
                '                                <img src="/images/become_supporter.png" alt="Supporter">' +
                '                            </span>' +
                '                        </span>' +
                '                    </a>';
        }

        html +=
            '                    <div id="color-picker-wrapper-create">';

        let color = globalColorCode.length > 0 ? (globalColorCode[0] ? globalColorCode[0].color_code : '#7289da') : '#7289da';

        html +=
            '                        <input name="color-picker" type="color" value="' + color + '" id="color-picker-create" ' + disabled + '>' +
            '                    </div>';

        if (!globalIsSupporter) {
            html +=
                '                </div>';
        }

        html +=
            '                <div class="embed-content">' +
            '                    <div class="embed-author-wrapper-create">' +
            '                        <div class="embed-author">' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-author-create" name="add-embed-author" value="+ Author" onclick="addAuthorCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-thumbnail-wrapper-create">' +
            '                        <div class="embed-thumbnail">' +
            '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-create" name="add-thumbnail" value="+ Thumbnail" onclick="addThumbCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-title-wrapper-create">' +
            '                        <div class="embed-title">' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-title-create" name="add-embed-title" value="+ Title" onclick="addTitleCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-description-wrapper-create">' +
            '                        <div class="embed-description">' +
            '                            <input class="btn-redirect empty" type="button" id="add-embed-description-create" name="add-embed-description" value="+ Description" onclick="addDescriptionCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="add-buttons">' +
            '                        <div class="btn-redirect empty rr" id="add-inline-field-create" name ="add-inline-field" onclick="addFieldInlineCreate();">+ Inline Field</div>' +
            '                        <div class="btn-redirect empty rr" id="add-non-inline-field-create" name ="add-non-inline-field" onclick="addFieldNonInlineCreate();">+ Non-inline Field</div>' +
            '                    </div>' +
            '                    <div id="embed-fields-create"></div>' +

            '                    <div class="embed-image-wrapper-create">' +
            '                        <div class="embed-image">' +
            '                            <input class="btn-redirect empty" type="button" id="add-image-create" name="add-image" value="+ Image" onclick="addImgCreate(this);" />' +
            '                        </div>' +
            '                    </div>' +

            '                    <div class="embed-complete-footer-wrapper-create">' +
            '                        <div class="embed-footer-wrapper-create">' +
            '                            <div class="embed-footer">' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-create" name="add-embed-footer" value="+ Footer" onclick="addFooterCreate(this);" />' +
            '                            </div>' +
            '                        </div>' +

            '                        <div class="embed-divider">|</div>' +

            '                        <div class="embed-timestamp-wrapper-create">' +
            '                            <div class="embed-timestamp">' +
            '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-create" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampCreate(this);" />' +
            '                            </div>' +
            '                        </div>' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +

            '            <div class="container small dark">' +
            '                <div class="padding-top padding-bottom padding-left padding-right">' +
            '                    <div class="reaction-role">' +
            '                        <div>Set up at least one emoji that will provide at least one role.</div>' +
            '                        <br />' +
            '                        <div class="btn-redirect empty center-button" onclick="addReactionRole();">+ Add</div>' +
            '                        <!-- Here, we will paste in emoji + role -->' +
            '                    </div>' +
            '                </div>' +
            '            </div>' +

            '            <!-- to include it in url params -->' +
            '            <input type="hidden" id="guild-id-create" name="guild-id" value="' + globalGuild.id + '" />' +

            '            <div class="center-button">' +
            '                <button type="submit" class="btn-redirect center-button margin-top">Create Message</button>' +
            '            </div>' +
            '        </form>' +
            '    </div>' +
            '</div>';

        $('#modals-wrapper').append(html);

        refreshDismissibles(window);

        // Add script for color picker
        var colorPicker = document.getElementById("color-picker-create");
        var colorPickerWrapper = document.getElementById("color-picker-wrapper-create");
        colorPicker.onchange = () => {
            colorPickerWrapper.style.backgroundColor = colorPicker.value;
        }
        colorPickerWrapper.style.backgroundColor = colorPicker.value;

        $('#form-reaction-role-create').on("submit", function (e) {
            e.preventDefault();

            let fieldTitles = [];
            let fieldDescriptions = [];
            let fieldInlines = [];

            $('.embed-field-i').each(function () {
                fieldTitles.push($(this).find('[id^="embed-field-title-create"]').val());
                fieldDescriptions.push($(this).find('[id^="embed-field-description-create"]').val());
                fieldInlines.push($(this).attr('class').split(/\s+/)[1]);
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
                url: '/submit/reaction-role-create',
                dataType: 'html',
                data: {
                    guildId: $('#guild-id-create').val(),

                    tcId: $('#tc-create').val(),

                    color: $('#color-picker-create').val(),
                    authorIcon: $('#embed-author-icon-create').attr('src'),
                    authorName: $('#embed-author-name-create').val(),
                    authorLink: $('#embed-author-link-create').val(),
                    thumbnail: $('#embed-thumbnail-create').attr('src'),
                    title: $('#embed-title-create').val(),
                    titleLink: $('#embed-title-link-create').val(),
                    description: $('#embed-description-create').val(),

                    fieldTitles: JSON.stringify(fieldTitles),
                    fieldDescriptions: JSON.stringify(fieldDescriptions),
                    fieldInlines: JSON.stringify(fieldInlines),

                    image: $('#embed-image-create').attr('src'),
                    footerIcon: $('#embed-footer-icon-create').attr('src'),
                    footerText: $('#embed-footer-text-create').val(),
                    timestamp: $('#embed-timestamp-create').val(),

                    emojis: JSON.stringify(emojis),
                    roles: JSON.stringify(roles)
                },
                success: () => {
                    location.reload();
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    switch (xhr.status) {
                        case 406:
                            $('#dismissible-item-error-permission').addClass('dismiss'); // "I cannot write in that text channel."
                            break;

                        case 403:
                            $('#dismissible-item-error-tc').addClass('dismiss'); // "I cannot find that text channel."
                            break;

                        case 500:
                            $('#dismissible-item-error-create').addClass('dismiss'); // "Something went wrong."
                            break;
                    }
                }
            });
        });
    } else {
        alert("You have reached the limits of 20 reaction role messages!");
    }
}

function openModalEdit(button) {
    var tcId;
    var msgId;

    var colorcode;
    var authorName;
    var authorUrl;
    var authorIconUrl;
    var title;
    var titleUrl;
    var thumbnailUrl;
    var description;
    var imageUrl;
    var footer;
    var footerIconUrl;

    var lFields = [];

    var rrMap = new Map();

    if (globalRrMsgs.length > 0) {
        globalRrMsgs.forEach(rrMsg => {
            if (rrMsg.msg_id == button.name) {
                tcId = rrMsg.tc_id;
                msgId = rrMsg.msg_id;
                colorcode = rrMsg.colorcode;
                authorName = rrMsg.author_name;
                authorUrl = rrMsg.author_url;
                authorIconUrl = rrMsg.author_icon_url;
                title = rrMsg.title;
                titleUrl = rrMsg.title_url;
                thumbnailUrl = rrMsg.thumbnail_url;
                description = rrMsg.description;
                imageUrl = rrMsg.image_url;
                footer = rrMsg.footer;
                footerIconUrl = rrMsg.footer_icon_url;

                rr = 0;
                rrAi = 0;
                currAi = 0;

                fields = 1;
                fieldAi = 1;

                if (globalRrFields.length > 0) {
                    let i = 0;
                    globalRrFields.forEach(rrField => {
                        if (i < 25 && rrField.msg_id == rrMsg.msg_id) {
                            lFields.push({
                                title: rrField.title,
                                description: rrField.description,
                                inline: rrField.inline
                            });

                            i++;
                        }
                    });
                }

                if (globalRrRolesEmojis.length > 0) {
                    globalRrRolesEmojis.forEach(rrRolesEmoji => {
                        if (rrMap.size < 20 && rrRolesEmoji.msg_id == rrMsg.msg_id) {
                            const emoji = rrRolesEmoji.emoji;
                            const role = rrRolesEmoji.role_id;

                            if (rrMap.has(emoji)) {
                                rrMap.set(emoji, rrMap.get(emoji) + '|' + role);
                            } else {
                                rrMap.set(emoji, role);
                            }
                        }
                    })
                }

                // Start of modal
                let html =
                    '<div id="reactionrole-modal-edit" class="modal">' +
                    '    <!-- Modal content -->' +
                    '    <div class="modal-content">' +
                    '        <span id="close-edit" class="close" onclick="closeModal(this);">&times;</span>' +
                    '        <form action="/submit/reaction-role-edit" method="POST" id="form-reaction-role-edit">' +
                    '            <div id="dismissible-item-error-edit" data-component="dismissible-item" data-type="error" data-value="Something went wrong."></div>' +
                    '            <div id="dismissible-item-error-permission" data-component="dismissible-item" data-type="error" data-value="I cannot write in that text channel."></div>' +
                    '            <div id="dismissible-item-error-tc" data-component="dismissible-item" data-type="error" data-value="I cannot find that text channel."></div>' +
                    '            <div class="embed-warning">' +
                    '                If you refresh or quit the page, your progress will be lost!' +
                    '            </div>' +
                    '            <div class="container small dark">' +
                    '                <div class="padding-top padding-bottom padding-left padding-right">' +
                    '                    <div class="settings-disclaimer embed tc">' +
                    '                        <div>It is not possible to change the text channel of an already posted message.</div>' +
                    '                        <br />' +
                    '                        <div class="form-group embed">' +

                    '                            <select id="tc-edit" name="tc" onchange="changeTcSel(this);" required disabled>' +
                    '                                <option value="" disabled>Please select a text channel</option>';

                // Text channel options
                globalChannels.forEach(channel => {
                    if ((channel.type === 'text' || channel.type === 'news') && channel.viewable) {
                        html +=
                            '                                <option value="' + channel.id + '">#' + channel.name + (channel.parentName ? ' (' + channel.parentName + ')' : '') + '</option>';
                    }
                });

                html +=
                    '                            </select>' +
                    '                            <label for="tc" class="control-label">Text Channel</label><i class="bar"></i>' +
                    '                        </div>' +
                    '                    </div>' +
                    '                </div>' +
                    '            </div>' +

                    '            <div class="embed-field">';

                // Non-supporter tooltip
                let disabled = globalIsSupporter ? "" : "disabled";

                if (!globalIsSupporter) {
                    html +=
                        '                <div class=" supporter-tooltip">' +
                        '                    <a href="/donate">' +
                        '                        <span class="supporter-tooltip-wrapper">' +
                        '                            <span class="supporter-tooltiptext">' +
                        '                                <h3>Embed Colours</h3>' +
                        '                                <h3>Become a supporter</h3>' +
                        '                                <img src="/images/become_supporter.png" alt="Supporter">' +
                        '                            </span>' +
                        '                        </span>' +
                        '                    </a>';

                }

                // Color picker
                html +=
                    '                    <div id="color-picker-wrapper-edit">' +
                    '                        <input name="color-picker" type="color" value="' + colorcode + '" id="color-picker-edit" ' + disabled + '>' +
                    '                    </div>';

                // Closing non-supporter tooltip
                if (!globalIsSupporter) {
                    html +=
                        '                </div>';
                }

                // Embed content
                html +=
                    '                <div class="embed-content">';


                // Author
                html +=
                    '                    <div class="embed-author-wrapper-edit">';

                if (authorName) {
                    html +=
                        '<div class="embed-author">' +
                        '<div class="embed-author-left">' +
                        '<div class="embed-author-icon-wrapper-edit">';

                    // Author Icon
                    if (authorIconUrl) {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<a onclick="addAuthorIcon(this);">' +
                            '<img src="' + authorIconUrl + '" id="embed-author-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-author-icon-edit" name="delete-author-icon" value="x" onclick="deleteAuthorIconEdit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-author-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-author-icon-edit" name="add-author-icon" value="+" onclick="addAuthorIconEdit(this);" />' +
                            '</div>';
                    }

                    // Author Name & Url
                    html +=
                        '</div>' +
                        '</div>' +

                        '<div class="embed-author-right">' +
                        '<span class="embed-author-name">' +
                        '<input value="' + authorName + '" type="text" name="embed-author-name" id="embed-author-name-edit" placeholder="Author Name" maxlength="256" required />' +
                        '</span>' +

                        '<div class="embed-author-link">' +
                        '<input value="' + authorUrl + '" type="url" name="embed-author-link" id="embed-author-link-edit" placeholder="Author Name URL" maxlength="5000" />' +
                        '</div>' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-author-edit" name="delete-author" value="x" onclick="deleteAuthorEdit(this);" />' +
                        '</div>';
                } else {
                    // Author add button
                    html +=

                        '                        <div class="embed-author">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-author-edit" name="add-embed-author" value="+ Author" onclick="addAuthorEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Thumbnail
                html +=
                    '                    <div class="embed-thumbnail-wrapper-edit">';

                if (thumbnailUrl) {
                    html +=
                        '<div class="embed-thumbnail">' +
                        '<a onclick="addThumb(this);" class="thumb">' +
                        '<img src="' + thumbnailUrl + '" id="embed-thumbnail-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-thumbnail-edit" name="delete-thumbnail" value="x" onclick="deleteThumbEdit(this);" />' +
                        '</div>';
                } else {
                    html +=

                        '                        <div class="embed-thumbnail">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-thumbnail-edit" name="add-thumbnail" value="+ Thumbnail" onclick="addThumbEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Title
                html +=
                    '                    <div class="embed-title-wrapper-edit">';

                if (title) {
                    html +=
                        '<div class="embed-title">' +
                        '<input value="' + title + '" type="text" name="embed-title" id="embed-title-edit" placeholder="Title" maxlength="256" required />' +

                        '<div class="embed-title-link">' +
                        '<input value="' + titleUrl + '" type="url" name="embed-title-link" id="embed-title-link-edit" placeholder="Title URL" />' +
                        '</div>' +
                        '<input class="btn-redirect empty" type="button" id="delete-title-edit" name="delete-title" value="x" onclick="deleteTitleEdit(this);" />' +
                        '</div>';
                } else {
                    html +=

                        '                        <div class="embed-title">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-title-edit" name="add-embed-title" value="+ Title" onclick="addTitleEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Description
                html +=
                    '                    <div class="embed-description-wrapper-edit">';

                if (description) {
                    html +=
                        '<div class="embed-description">' +
                        '<textarea name="embed-description" id="embed-description-edit" placeholder="Description" maxlength="2048" required>' + description + '</textarea>' +
                        '<input class="btn-redirect empty" type="button" id="delete-description-edit" name="delete-description" value="x" onclick="deleteDescriptionEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                        <div class="embed-description">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-embed-description-edit" name="add-embed-description" value="+ Description" onclick="addDescriptionEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Field add buttons
                html +=
                    '                    <div class="add-buttons">' +
                    '                        <div class="btn-redirect empty rr" id="add-inline-field-edit" name ="add-inline-field" onclick="addFieldInlineEdit();">+ Inline Field</div>' +
                    '                        <div class="btn-redirect empty rr" id="add-non-inline-field-edit" name ="add-non-inline-field" onclick="addFieldNonInlineEdit();">+ Non-inline Field</div>' +
                    '                    </div>';

                // Fields
                html +=
                    '                    <div id="embed-fields-edit">';

                if (lFields.length > 0) {
                    lFields.forEach(field => {
                        if (field.inline) {
                            html +=
                                '<div class="embed-field-i inline">' +
                                '<div class="embed-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-inline-field-title" id="embed-field-title-edit-' + fieldAi + '" placeholder="Inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-inline-field-description">' +
                                '<textarea name="embed-inline-field-description" id="embed-field-description-edit-' + fieldAi + '" placeholder="Inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldEdit(this);" />' +
                                '</div>';
                        } else {
                            html +=
                                '<div class="embed-field-i non-inline">' +
                                '<div class="embed-non-inline-field-title">' +
                                '<input value="' + field.title + '" type="text" name="embed-non-inline-field-title" id="embed-field-title-edit-' + fieldAi + '" placeholder="Non-inline field title" maxlength="256" required />' +
                                '</div>' +
                                '<div class="embed-non-inline-field-description">' +
                                '<textarea name="embed-non-inline-field-description" id="embed-field-description-edit-' + fieldAi + '" placeholder="Non-inline field description" maxlength="1024" required>' + field.description + '</textarea>' +
                                '</div>' +
                                '<input class="btn-redirect empty delete-field-edit" type="button" id="delete-field-edit-' + fieldAi + '" name="delete-field" value="x" onclick="deleteFieldEdit(this);" />' +
                                '</div>';
                        }

                        fields++;
                        fieldAi++;
                    });
                }

                html +=
                    '</div>';

                // Image
                html +=
                    '                    <div class="embed-image-wrapper-edit">';

                if (imageUrl) {
                    html +=
                        '<div class="embed-image">' +
                        '<a onclick="addImg(this);" class="img">' +
                        '<img src="' + imageUrl + '" id="embed-image-edit">' +
                        '</a>' +
                        '<input class="btn-redirect empty" type="button" id="delete-img-edit" name="delete-img" value="x" onclick="deleteImgEdit(this);" />' +
                        '</div>';;
                } else {
                    html +=
                        '                        <div class="embed-image">' +
                        '                            <input class="btn-redirect empty" type="button" id="add-image-edit" name="add-image" value="+ Image" onclick="addImgEdit(this);" />' +
                        '                        </div>';
                }

                html +=
                    '                    </div>';

                // Footer Complete
                html +=
                    '                    <div class="embed-complete-footer-wrapper-edit">';

                // Footer
                html +=
                    '                        <div class="embed-footer-wrapper-edit">';

                if (footer) {
                    html +=
                        '<div class="embed-footer-used">';

                    // Footer Icon
                    html +=
                        '<div class="embed-footer-icon-wrapper-edit">';

                    if (footerIconUrl) {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<a onclick="addFooterIcon(this);">' +
                            '<img src="' + footerIconUrl + '" id="embed-footer-icon-edit">' +
                            '</a>' +
                            '<input class="btn-redirect empty" type="button" id="delete-footer-icon-edit" name="delete-footer-icon" value="x" onclick="deleteFooterIconEdit(this);" />' +
                            '</div>';
                    } else {
                        html +=
                            '<div class="embed-footer-icon">' +
                            '<input class="btn-redirect empty" type="button" id="add-footer-icon-edit" name="add-footer-icon" value="+" onclick="addFooterIconEdit(this);" />' +
                            '</div>';
                    }

                    html +=
                        '</div>';

                    // Footer Text
                    html +=
                        '<div class="embed-footer-text">' +
                        '<input value="' + footer + '" type="text" name="embed-footer-text" id="embed-footer-text-edit" placeholder="Footer" maxlength="2048" required />' +
                        '</div>' +

                        '<input class="btn-redirect empty" type="button" id="delete-footer-edit" name="delete-footer" value="x" onclick="deleteFooterEdit(this);" />' +
                        '</div>';
                } else {
                    html +=
                        '                            <div class="embed-footer">' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-footer-edit" name="add-embed-footer" value="+ Footer" onclick="addFooterEdit(this);" />' +
                        '                            </div>';
                }

                html +=
                    '                        </div>';

                // Divider
                html +=
                    '                        <div class="embed-divider">|</div>';

                // Timestamp 
                html +=
                    '                        <div class="embed-timestamp-wrapper-edit">';

                if (globalTimestampTzs) {
                    globalTimestampTzs.forEach(globalTimestampTz => {
                        if (globalTimestampTz.msg_id == rrMsg.msg_id) {
                            let timestampTz = globalTimestampTz.tz.substring(0, 16);
                            if (timestampTz == 'Invalid date') {
                                html +=
                                    '                            <div class="embed-timestamp">' +
                                    '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampEdit(this);" />' +
                                    '                            </div>';
                            } else {
                                html +=
                                    '<div class="embed-timestamp">' +
                                    '<input value="' + timestampTz + '" type="datetime-local" name="embed-timestamp" id="embed-timestamp-edit" />' +
                                    '<input class="btn-redirect empty" type="button" id="delete-timestamp-edit" name="delete-timestamp" value="x" onclick="deleteTimestampEdit(this);" />' +
                                    '</div>';
                            }
                        }
                    });
                } else {
                    html +=
                        '                            <div class="embed-timestamp">' +
                        '                                <input class="btn-redirect empty" type="button" id="add-embed-timestamp-edit" name="add-embed-timestamp" value="+ Timestamp" onclick="addTimestampEdit(this);" />' +
                        '                            </div>';
                }

                html +=
                    '                        </div>';


                // Closing ealier stuff
                html +=
                    '                    </div>' +
                    '                </div>' +
                    '            </div>';

                // Reaction Roles
                html +=
                    '            <div class="container small dark">' +
                    '                <div class="padding-top padding-bottom padding-left padding-right">' +
                    '                    <div class="reaction-role">' +
                    '                        <div>You can change this but keep in mind, if you add or remove a role from a reaction, it will not update all the users automatically. Only those who again click on the reaction.</div>' +
                    '                        <br />' +
                    '                        <div class="btn-redirect empty center-button" onclick="addReactionRole();">+ Add</div>' +
                    '                        <!-- Here, we will paste in emoji + role -->';

                for (let [k, v] of rrMap) {
                    let options = [];
                    globalBotRoles.forEach(role => {
                        if (role.name !== '@everyone') {
                            let selected = v.includes(role.id) ? 'selected' : '';
                            let colorcode = role.color === 0 ? "FFFFFF" : role.color.toString(16);
                            options.push('<option ' + selected + ' value="' + role.id + '" style="color: #' + colorcode + '">' + role.name + '</option>')
                        }
                    });

                    let id = 'picker-' + rrAi;
                    html +=
                        '<div class="settings-disclaimer">' +
                        '<br />' +
                        '<div class="reaction-role-groups">' +
                        '<div class="form-group">' +
                        '<div class="picker" id="' + id + '">' + k + '</div>' +
                        '<div class="picker-label">Emoji</div>' +
                        '</div>' +

                        '<div class="form-group embed">' +
                        '<select name="rrRoles"  data-placeholder="Select roles..." multiple class="chosen-select">' + options.join("") + '</select>' +
                        '<label for="tc" class="control-label">Role(s)</label><i class="bar"></i>' +
                        '</div>' +

                        '<div class="remove-rr" onclick="removeRr(this);">' +
                        '<img src="/images/close.png" alt="Remove">' +
                        '</div>' +
                        '</div>' +
                        '</div>';

                    rr++;
                    rrAi++;
                }

                html +=
                    '                    </div>' +
                    '                </div>' +
                    '            </div>';

                // Guild ID and Message ID
                html +=
                    '            <!-- to include it in url params -->' +
                    '            <input type="hidden" id="guild-msg-id-edit" name="guild-msg-id" value="' + globalGuild.id + '|' + msgId + '" />';

                // Submit
                html +=
                    '            <div class="center-button">' +
                    '                <button type="submit" class="btn-redirect center-button margin-top">Update Message</button>' +
                    '            </div>';

                // Closing everything
                html +=
                    '        </form>' +
                    '    </div>' +
                    '</div>';


                $('#modals-wrapper').append(html);

                refreshDismissibles(window);

                // Add script for color picker
                var colorPicker = document.getElementById("color-picker-edit");
                var colorPickerWrapper = document.getElementById("color-picker-wrapper-edit");
                colorPicker.onchange = () => {
                    colorPickerWrapper.style.backgroundColor = colorPicker.value;
                }
                colorPickerWrapper.style.backgroundColor = colorPicker.value;

                $('.picker').each(function (i) {
                    let id = $(this).attr('id');
                    twemoji.parse(document.getElementById(id));
                    addPickerListener(id);
                    addChosen();
                    addOnClick();
                });

                $('#form-reaction-role-edit').on("submit", function (e) {
                    e.preventDefault();

                    let fieldTitles = [];
                    let fieldDescriptions = [];
                    let fieldInlines = [];

                    $('.embed-field-i').each(function () {
                        fieldTitles.push($(this).find('[id^="embed-field-title-edit"]').val());
                        fieldDescriptions.push($(this).find('[id^="embed-field-description-edit"]').val());
                        fieldInlines.push($(this).attr('class').split(/\s+/)[1]);
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
                        url: '/submit/reaction-role-edit',
                        dataType: 'html',
                        data: {
                            guildId: $('#guild-msg-id-edit').val().split('|')[0],
                            tcId: $('#tc-edit').val(),
                            msgId: $('#guild-msg-id-edit').val().split('|')[1],

                            color: $('#color-picker-edit').val(),
                            authorIcon: $('#embed-author-icon-edit').attr('src'),
                            authorName: $('#embed-author-name-edit').val(),
                            authorLink: $('#embed-author-link-edit').val(),
                            thumbnail: $('#embed-thumbnail-edit').attr('src'),
                            title: $('#embed-title-edit').val(),
                            titleLink: $('#embed-title-link-edit').val(),
                            description: $('#embed-description-edit').val(),

                            fieldTitles: JSON.stringify(fieldTitles),
                            fieldDescriptions: JSON.stringify(fieldDescriptions),
                            fieldInlines: JSON.stringify(fieldInlines),

                            image: $('#embed-image-edit').attr('src'),
                            footerIcon: $('#embed-footer-icon-edit').attr('src'),
                            footerText: $('#embed-footer-text-edit').val(),
                            timestamp: $('#embed-timestamp-edit').val(),

                            emojis: JSON.stringify(emojis),
                            roles: JSON.stringify(roles)
                        },
                        success: () => {
                            location.reload();
                        },
                        error: function (xhr, ajaxOptions, thrownError) {
                            switch (xhr.status) {
                                case 406:
                                    $('#dismissible-item-error-permission').addClass('dismiss'); // "I cannot write in that text channel."
                                    break;

                                case 403:
                                    $('#dismissible-item-error-tc').addClass('dismiss'); // "I cannot find that text channel."
                                    break;

                                case 500:
                                    $('#dismissible-item-error-create').addClass('dismiss'); // "Something went wrong."
                                    break;
                            }
                        }
                    });
                });
            }
        });
    }
}

// Voice lobby plugin
function submitVoicelobby() {
    circleLoading();
    $.ajax({
        global: false,
        type: 'POST',
        url: '/submit/voice-lobby',
        dataType: 'html',
        data: {
            guildId: $('#guild-id').val(),
            lobbies: $('#lobby-channels').val().join('|')
        },
        success: () => {
            setTimeout(() => {
                circleSaved();
            }, 1000);
        },
        error: () => {
            setTimeout(() => {
                circleError();
            }, 1000);
        }
    });
}

////////////////////////////////////////////
// LEADERBOARD
////////////////////////////////////////////

// Danger area
$(() => {
    $('#danger-mode').change(() => {
        var checked = $('#danger-mode').prop("checked");

        $('.delete-user-fake').toggle(checked);
        $('.delete-user').toggle(checked);
        $('#danger-area').toggle(checked);

        setCookie("danger-mode", checked, 1);
    });
});

$(document).ready(function () {
    if (typeof globalIsAuthorized !== 'undefined') {
        var toggle = getCookie("danger-mode") === "true" ? true : false;
        if (!globalIsAuthorized) toggle = false;
        $('#danger-mode').prop("checked", toggle);
        $('.delete-user-fake').toggle(toggle);
        $('.delete-user').toggle(toggle);
        $('#danger-area').toggle(toggle);
    }
});

function submitResetMember(button) {
    if (confirm('Are you sure to reset this member?')) {
        let nameSplit = button.name.split("|");
        let guildId = nameSplit[0];
        let userId = nameSplit[1];

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/leaderboard-reset-member',
            dataType: 'html',
            data: {
                guildId: guildId,
                userId: userId
            },
            success: () => {
                location.reload();
            },
            error: function (xhr, status, text) {
                if (xhr.status === 403)
                    $('#dismissible-item-forbidden').addClass('dismiss'); // "You're not allowed to reset members!"
                else
                    $('#dismissible-item').addClass('dismiss'); // Couldn't delete member(s).
            }
        });
    } else return;
}

function submitResetMembers(button) {
    if (confirm('Are you sure to reset ALL members?')) {
        let guildId = button.name;

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/leaderboard-reset-members',
            dataType: 'html',
            data: {
                guildId: guildId
            },
            success: () => {
                location.reload();
            },
            error: function (xhr, status, text) {
                if (xhr.status === 403)
                    $('#dismissible-item-forbidden').addClass('dismiss'); // "You're not allowed to reset members!"
                else
                    $('#dismissible-item').addClass('dismiss'); // Couldn't delete member(s).
            }
        });
    } else return;
}

function submitPruneMembers(button) {
    if (confirm('Are you sure to reset gone members?')) {
        let guildId = button.name;

        $.ajax({
            global: false,
            type: 'POST',
            url: '/submit/leaderboard-prune-members',
            dataType: 'html',
            data: {
                guildId: guildId
            },
            success: () => {
                location.reload();
            },
            error: function (xhr, status, text) {
                if (xhr.status === 403)
                    $('#dismissible-item-forbidden').addClass('dismiss'); // "You're not allowed to reset members!"
                else
                    $('#dismissible-item').addClass('dismiss'); // Couldn't delete member(s).
            }
        });
    } else return;
}