let blockedRequestCount = 0;
let blockingEnabled = true;

loadSettings();

chrome.webRequest.onBeforeRequest.addListener(
    (details) => {
        if (blockingEnabled && details.url.includes("seen")) {
            blockedRequestCount++;
            saveSettings();
            chrome.browserAction.setBadgeText({ text: String(blockedRequestCount) || "0" });
            return { cancel: true };
        }
    }, { urls: ["*://*.instagram.com/*"] }, ["blocking"]
);

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.message === "getBlockedRequestCount") {
        sendResponse({ blockedRequestCount });
    }

    if (request.message === "getBlockingEnabled") {
        sendResponse({ blockingEnabled });
    }

    if (request.message === "setBlockingEnabled") {
        blockingEnabled = request.data.blockingEnabled;
        saveSettings();
        sendResponse({ message: "Blocking enabled set to " + blockingEnabled });
    }
});


function saveSettings() {
    changeIcon();
    chrome.storage.sync.set({
        "blockingEnabled": blockingEnabled,
        "blockedRequestCount": blockedRequestCount,
    }, function() {
        console.log("Settings saved");
    });
}

function loadSettings() {
    chrome.storage.sync.get({
        "blockingEnabled": true,
        "blockedRequestCount": 0,
    }, function(items) {
        blockingEnabled = items.blockingEnabled;
        blockedRequestCount = items.blockedRequestCount;
        changeIcon();
        chrome.browserAction.setBadgeText({ text: String(blockedRequestCount) || "0" });
    });
}

function changeIcon() {
    chrome.browserAction.setIcon({
        path: blockingEnabled ? "icon16.png" : "icon16-bw.png"
    });
}