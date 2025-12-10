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
			.setName('Language selection')
			.setHeading()
			.setDesc(
				"For language codes check respective api's website." +
				"\nAuto doesn't work for My Memory"
			);

		new Setting(containerEl)
			.setName('Input language')
			.addText((text) =>
				text
					.setPlaceholder('auto')
					.setValue(this.plugin.settings.fromLanguage)
					.onChange(async (value) => {
						this.plugin.settings.fromLanguage = value;
						await this.plugin.saveSettings();
					})
			)

		new Setting(containerEl)
			.setName('Output language')
			.addText((text) =>
				text
					.setPlaceholder('en')
					.setValue(this.plugin.settings.toLanguage)
					.onChange(async (value) => {
						this.plugin.settings.toLanguage = value;
						await this.plugin.saveSettings();
					})
			)


		new Setting(containerEl)
			.setName('Translation model selection')
			.addDropdown((dropdown) =>
				dropdown
					.addOption('My memory', 'My Memory')
					.addOption('Lingva', 'Lingva')
					.addOption('Projectsegfau', 'Projectsegfau')
					.setValue(this.plugin.settings.activeAPI)
					.onChange(async (value) => {
						this.plugin.settings.activeAPI = value;
						await this.plugin.saveData(this.plugin.settings)
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


