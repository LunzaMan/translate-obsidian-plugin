import {
	Notice,
	Plugin,
	WorkspaceLeaf,
	Editor,
	Setting,
} from "obsidian";
import { App, Modal } from "obsidian";
import { TranslateViewType, TranslateView } from "src/translateView";
import translators from "src/translators";
import { TranslatePluginSettings, TranslateSettingTab, defaultSettings } from "./settings";

export default class TranslatePlugin extends Plugin {
	static activeTranslationModal: string;
	settings: TranslatePluginSettings;


	async onload() {
		await this.loadSettings();

		this.addSettingTab(new TranslateSettingTab(this.app, this));



		this.registerView(
			TranslateViewType,
			(leaf) => new TranslateView(leaf, this.settings)
		);

		this.addRibbonIcon('languages', 'Translate Plugin', (_evt: MouseEvent) => {
			this.activateView();
		});

		// Commands
		this.addCommand({
			id: 'translateSelectedCommand',
			name: 'Translate Selected',
			editorCallback: async (editor: Editor) => {
				const inputText = editor.getSelection();
				const translatorObject = new translators;
				await translatorObject.translatorReturnFunction(inputText, this.settings.toLanguage, this.settings.fromLanguage, this.settings.activeAPI);
				new TranslatedModal(this.app, translatorObject.outputText).open();

			},
		});

		this.addCommand({
			id: 'replaceSelectedWithTranslationCommand',
			name: 'Replace With Translation',
			editorCallback: async (editor: Editor) => {
				const inputText = editor.getSelection();
				const translatorObject = new translators;
				await translatorObject.translatorReturnFunction(inputText, this.settings.toLanguage, this.settings.fromLanguage, this.settings.activeAPI);
				editor.replaceSelection(translatorObject.outputText);
			}
		});

		this.addCommand({
			id: 'copyTranslationToClipboard',
			name: 'Translate and Copy to Clipboard',
			editorCallback: async (editor: Editor) => {
				const inputText = editor.getSelection();
				const translatorObject = new translators;
				await translatorObject.translatorReturnFunction(inputText, this.settings.toLanguage, this.settings.fromLanguage, this.settings.activeAPI);
				navigator.clipboard.writeText(translatorObject.outputText);
				new Notice(translatorObject.outputText +
					"\nCopied to clipboard"
				)
			}
		})

	}

	async activateView() {
		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null;

		const leaves = workspace.getLeavesOfType(TranslateViewType);

		if (leaves.length > 0) {
			leaf = leaves[0];
		} else {
			leaf = workspace.getRightLeaf(false);
			await leaf?.setViewState({ type: TranslateViewType, active: true });

		}

		workspace.revealLeaf(leaf);
	}

	async updateView() {

		const { workspace } = this.app;

		let leaf: WorkspaceLeaf | null = null;

		const leaves = workspace.getLeavesOfType(TranslateViewType);

		leaf = leaves[0];
		leaf.view.containerEl
		console.log(leaf)

	}
	async loadSettings() {
		const currentSettings = Object.assign(defaultSettings, await this.loadData());
		this.settings = new TranslatePluginSettings(currentSettings);
		this.saveData(this.settings);
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}


}


export class TranslatedModal extends Modal {
	displayText: string;
	constructor(app: App, displayText: string) {
		super(app);
		this.setTitle('Translated Text');
		this.setContent(displayText);

		new Setting(this.contentEl)
			.addButton((copyButton) => {
				copyButton
					.setButtonText("Copy")
					.onClick(() => {
						navigator.clipboard.writeText(displayText);
						this.close();
						new Notice("Copied to clipboard");
					})
			})

	}

}
