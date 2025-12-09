import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
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
		return 'Translate View'
	}

	async onOpen() {


		const container = this.containerEl
		container.empty();
		const innerContainer = this.containerEl.createDiv({ cls: 'container' });
		innerContainer.createEl('h1', { text: 'Translate Plugin' })
		innerContainer.createEl('label', { text: 'Input', cls: 'label' })
		const input = innerContainer.createEl('input', { cls: 'box' });
		const translateButton = innerContainer.createEl('button', { text: 'Translate', cls: 'button' })
		innerContainer.createEl('label', { text: 'Output', cls: 'label' })
		const output = innerContainer.createEl('input', { cls: 'box', attr: { disabled: true } });

		translateButton.onClickEvent(
			async () => {

				console.log(input.value)
				if (input.value != null || input.value != "") {
					const translatorObject = new translators();
					await translatorObject.translatorReturnFunction(input.value, this.settings.toLanguage, this.settings.fromLanguage, this.settings.activeAPI);
					output.value = translatorObject.outputText ? translatorObject.outputText : "this is null";
				}


			});

		const copyButton = innerContainer.createEl('button', { text: 'Copy', cls: 'button' });

		copyButton.onClickEvent(() => {
			navigator.clipboard.writeText(output.value)
			new Notice('Copied to clipboard');
		});

	}
}



