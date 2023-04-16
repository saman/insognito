document.addEventListener("DOMContentLoaded", () => {
    const counter = document.getElementById("counter");
    const blockingCheckbox = document.getElementById("blockingCheckbox");

    chrome.runtime.sendMessage({ message: "getBlockedRequestCount" }, (response) => {
        counter.textContent = response.blockedRequestCount;
    });

    chrome.runtime.sendMessage({ message: "getBlockingEnabled" }, (response) => {
        blockingCheckbox.checked = response.blockingEnabled;
    });

    blockingCheckbox.addEventListener("change", () => {
        blockingEnabled = blockingCheckbox.checked;


        chrome.runtime.sendMessage({ message: "setBlockingEnabled", data: { blockingEnabled } }, (response) => {
            console.log(response);
        });
    });
});