import imageCompression from 'browser-image-compression';

const blobToText = async (blob: Blob): Promise<string> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsText(blob);
	});
}

const compressButtonClickEventListener = async () => {
	const imageFile = (document.getElementById('imageFile') as any)?.files[0];
	console.log('originalFile instanceof Blob', imageFile instanceof Blob);
	console.log(`originalFile size ${imageFile.size / 1024 / 1024} MB`);

	const options = {
		maxSizeMB: 1,
		maxWidthOrHeight: 1920,
		useWebWorker: true,
	};

	try {
		const compressedFile = await imageCompression(imageFile, options);
		console.log('compressedFile instanceof Blob', compressedFile instanceof Blob);
		console.log(`compressedFile size ${compressedFile.size / 1024 / 1024} MB`);

		// You can then upload this compressed file or save it somewhere
		// Here, we're just converting it to a dataUrl and sending it to the background script

		blobToText(compressedFile).then((data) => {
			chrome.runtime.sendMessage(
				{
					contentScriptQuery: 'compressImage',
					imageFile: data,
				},
				function (response) {
					console.log(response.dataUrl);
				}
			);
		});
	} catch (error) {
		console.error(error);
	}
};

document.addEventListener('DOMContentLoaded', () => {
	const compressButton = document.getElementById('compressButton');
	compressButton?.addEventListener('click', compressButtonClickEventListener);
});
