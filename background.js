const browser = globalThis.browser || globalThis.chrome;
const locale = navigator.language || "en-US"; 
const CONTEXT_MENU_ID = 'contextMenu_SearchWithGoogle';

const parts = locale.split('-');
const hl = parts[0]; // e.g., "en"
const gl = parts[1] ? parts[1].toLowerCase() : hl; // e.g., "us"

function buildSearchUrl(text) {
	let url = `https://www.google.com/search?q=${encodeURIComponent(text)}`;
	url += `&hl=${hl}`;
  url += `&gl=${gl}`;

	return url
}

function handleSearchSelection(info) {
	const text = info?.selectionText?.trim();

	if (!text) {
		return;
	}

	browser.tabs.create({ url: buildSearchUrl(text) });
}

function setupContextMenu() {
	browser.contextMenus.removeAll(() => {
		browser.contextMenus.create({
			id: CONTEXT_MENU_ID,
			title: 'Search "%s" using Google Search',
			contexts: ['selection']
		});
	});
}

browser.runtime?.onInstalled?.addListener(setupContextMenu);
browser.runtime?.onStartup?.addListener(setupContextMenu);

browser.contextMenus.onClicked.addListener((info, tab) => {
	if (info.menuItemId === CONTEXT_MENU_ID) {
		handleSearchSelection(info, tab);
	}
});

setupContextMenu();
