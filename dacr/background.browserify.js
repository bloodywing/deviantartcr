let browser = require('webextension-polyfill');

const deviationmatch = new RegExp("deviantart.com\/.*\/art\/.*");

browser.contextMenus.create({
    id: "open-on-dd-add",
    title: "DD this",
    contexts: ["link", "page"]
});


browser.runtime.onMessage.addListener(function (message) {
    if(message.message.enabled) {
        browser.contextMenus.update('open-on-dd-add', {
            enabled: true
        })
    } else {
        browser.contextMenus.update('open-on-dd-add', {
            enabled: false
        })
    }
});

/*browser.contextMenus.onShown.addListener(
    function (info, tab) {
        if(!tab.url.match(/deviantart.com/) && (info.linkUrl ? info.linkUrl : info.pageUrl).match(deviationmatch)) {
            browser.contextMenus.remove("open-on-dd-add");
        }
    }
);*/

browser.contextMenus.onClicked.addListener(
    function(info, tab) {
        switch (info.menuItemId) {
            case "open-on-dd-add":
                if((info.linkUrl ? info.linkUrl : info.pageUrl).match(deviationmatch)) {
                    browser.tabs.create({
                        url: `https://da.isartistic.biz/add_dd?deviation=${info.linkUrl ? info.linkUrl : info.pageUrl}`
                    });
                }
                break;
        }
    }
);
