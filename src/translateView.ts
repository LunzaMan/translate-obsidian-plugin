import { ItemView, WorkspaceLeaf, Notice, IconName } from "obsidian";
import translators from "./translators";
import { TranslatePluginSettings } from "./settings";

export const TranslateViewType = 'translate-toolbar';


export class TranslateView extends ItemView {
	outputText: string;
	settings: TranslatePluginSettings;

	constructor(leaf: WorkspaceLeaf, settings: TranslatePluginSettings) {
		super(leaf);
		this.settings = settings;
	}

	getViewType(): string {
		return TranslateViewType;
	}

	getDisplayText(): string {
		return 'Translate view'
	}

	getIcon(): IconName {
		return "languages"
	}

	async onOpen() {
		const container = this.containerEl
		container.empty();
		const innerContainer = this.containerEl.createDiv({ cls: 'container' });
		innerContainer.createEl('h1', { text: 'Inline translator' })

		const inputLabel = innerContainer.createEl('label', { text: 'Input', cls: 'label' });
		const inputLanguageSelector = inputLabel.createEl('input', { cls: 'languageInput', placeholder: 'Input Language' })
		const input = innerContainer.createEl('input', { cls: 'box', placeholder: 'Write text you want to translate' });

		const translateButton = innerContainer.createEl('button', { text: 'Translate', cls: 'button' })
		const swapButton = innerContainer.createEl('button', { text: 'Swap language', cls: 'button' })

		const outputLabel = innerContainer.createEl('label', { text: 'Output', cls: 'label' })
		const outputLanguageSelector = outputLabel.createEl('input', { cls: 'languageInput', placeholder: 'Output Language' })
		const output = innerContainer.createEl('input', { cls: 'box', attr: { disabled: true }, placeholder: 'Translated text will be displayed here.' });

		const copyButton = innerContainer.createEl('button', { text: 'Copy', cls: 'button' });

		translateButton.onClickEvent(
			async () => {

				if (input.value != null || input.value != "") {
					const translatorObject = new translators();
					await translatorObject.translatorReturnFunction(
						input.value,
						outputLanguageSelector.value != '' ? outputLanguageSelector.value : this.settings.toLanguage,
						inputLanguageSelector.value != '' ? inputLanguageSelector.value : this.settings.fromLanguage,
						this.settings.activeAPI
					);
					output.value = translatorObject.outputText ? translatorObject.outputText : "this is null";
				}
			});

		swapButton.onClickEvent(() => {

			const temp = inputLanguageSelector.value;
			inputLanguageSelector.value = outputLanguageSelector.value;
			outputLanguageSelector.value = temp;
		}
		)


		copyButton.onClickEvent(async () => {
			await navigator.clipboard.writeText(output.value)
			new Notice('Copied to clipboard');
		});

	}
}



