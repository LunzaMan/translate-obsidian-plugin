import TranslatePlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

export interface ISettings {
	activeAPI: string;
	fromLanguage: string;
	toLanguage: string;
}

export const defaultSettings: ISettings = {
	activeAPI: 'Projectsegfau',
	fromLanguage: 'auto',
	toLanguage: 'en',
}



export class TranslateSettingTab extends PluginSettingTab {
	plugin: TranslatePlugin;

	constructor(app: App, plugin: TranslatePlugin) {
		super(app, plugin);
		this.plugin = plugin;
	}

	display(): void {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName('Language Selection')
			.setHeading()
			.setDesc(
				"For language codes check respective api's website." +
				"\nAuto doesn't work for My Memory"
			);

		new Setting(containerEl)
			.setName('Input Language')
			.addText((text) =>
				text
					.setPlaceholder('auto')
					.setValue(this.plugin.settings.fromLanguage)
					.onChange(async (value) => {
						this.plugin.settings.fromLanguage = value;
						this.plugin.saveSettings();
					})
			)


		new Setting(containerEl)
			.setName('Output Language')
			.addText((text) =>
				text
					.setPlaceholder('en')
					.setValue(this.plugin.settings.toLanguage)
					.onChange(async (value) => {
						this.plugin.settings.toLanguage = value;
						this.plugin.saveSettings();
						console.log(this.plugin.settings.toLanguage)
					})
			)


		new Setting(containerEl).setName('API Selection').setHeading();

		new Setting(containerEl)
			.setName('Translation Model Selection')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('My Memory', 'My Memory')
					.addOption('Lingva', 'Lingva')
					.addOption('Projectsegfau', 'Projectsegfau')
					.setValue(this.plugin.settings.activeAPI)
					.onChange(async (value) => {
						this.plugin.settings.activeAPI = value;
						console.log(this.plugin.settings)
						this.plugin.saveData(this.plugin.settings)
						await this.plugin.saveSettings();
					})
			)








	}
}

export class TranslatePluginSettings implements ISettings {
	activeAPI: string;
	fromLanguage: string;
	toLanguage: string;

	constructor(loadedData: Partial<ISettings>) {
		this.activeAPI = loadedData.activeAPI ? loadedData.activeAPI : defaultSettings.activeAPI;
		this.fromLanguage = loadedData.fromLanguage ? loadedData.fromLanguage : defaultSettings.fromLanguage;
		this.toLanguage = loadedData.toLanguage ? loadedData.toLanguage : defaultSettings.toLanguage;
	}
}


