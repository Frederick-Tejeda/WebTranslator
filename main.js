const target = 'en'
var prev = '', prevRange = '';
const API_KEY = "f926bd8046msh8fc4f7d8a15079fp1abd39jsndcb95e31d843";
    XHR = new XMLHttpRequest();
XHR.withCredentials = true;
// Makes the HTTP request using the selected text as the query string
function apiRequest(text, target, source = '') {
    XHR.open("POST", "https://microsoft-translator-text.p.rapidapi.com/translate?to="
        + target.toString() +
        "&api-version=3.0&"
        + source +
        "profanityAction=NoAction&textType=plain");
    XHR.setRequestHeader("content-type", "application/json");
    XHR.setRequestHeader("x-rapidapi-key", API_KEY);
    XHR.setRequestHeader("x-rapidapi-host", "microsoft-translator-text.p.rapidapi.com");
    XHR.send(JSON.stringify([{ "text": text }]));
}
// Handles the translation response
XHR.addEventListener("readystatechange", function () {
    if (this.readyState === this.DONE) {
        const responseData = JSON.parse(this.responseText)[0];
        let translation = responseData.translations[0].text;
        if (window.getSelection().toString().length > 1) {
            prev = window.getSelection().toString();
            replaceSelectedText(translation);
        }
    }
});
// Handles mouse clicks on the page
window.addEventListener('mouseup', function () {
    let selection = window.getSelection();
    console.log(selection);
    // If user has closed the selection, revert text to the initial state
    if (selection.isCollapsed === true && prev != '') {
        try {
            prevRange.deleteContents();
            prevRange.insertNode(document.createTextNode(prev));
        } catch (error) { };
        return
    }
    // used with language autodetection
    apiRequest(selection.toString(), target);
});
// Replaces the selected text with the translation
function replaceSelectedText(replacementText) {
    var sel, range;
    if (window.getSelection) {
        sel = window.getSelection();
        if (sel.rangeCount) {
            range = sel.getRangeAt(0);
            prevRange = range;
            range.deleteContents();
            range.insertNode(document.createTextNode(replacementText));
        }
    }
}
