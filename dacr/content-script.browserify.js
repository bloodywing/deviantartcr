let browser = require('webextension-polyfill');
const deviationmatch = new RegExp("deviantart.com\/.*\/art\/.*");

let enableContextMenuItem = function() {
    browser.runtime.sendMessage({
        "message": {
            'enabled': true
        }
    });
};

let disableContextMenuItem = function() {
    browser.runtime.sendMessage({
        "message": {
            'enabled': false
        }
    });
};

document.addEventListener('contextmenu', event => {
    if(event.target.href && event.target.href.match(deviationmatch)) {
        enableContextMenuItem();
        return;
    } else {
        disableContextMenuItem();
    }

    if(event.target.baseURI.match(deviationmatch)) {
        enableContextMenuItem();
    } else {
        disableContextMenuItem();
    }
}, {
    capture: true
});