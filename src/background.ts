const textToBlob = (text: string): Blob => {
	return new Blob([text], { type: 'text/plain' });
};

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
	if (request.contentScriptQuery == 'compressImage') {
		let reader = new FileReader();
		reader.readAsDataURL(textToBlob(request.imageFile));
		reader.onloadend = function () {
			sendResponse({ dataUrl: reader.result });
		};
		return true;
	}
});
