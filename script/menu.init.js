import { MenuManager } from './menu.manager.js';

const menuManager = new MenuManager({
	menuTargetId: "application-menu-container",
	menuPosition: "bottom-center",
	iconSize: 42,
	menuMargin: 16,
	initialVisibility: {
		settings: false,
		search: false,
		data: false,
		assistant: false,
		about: false
	}
});
