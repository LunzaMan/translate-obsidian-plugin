import { ItemView, WorkspaceLeaf, Notice } from "obsidian";
import translators from "./translators";
export const TranslateViewType = 'translate-toolbar';


export class TranslateView extends ItemView {
	outputText: string;

	constructor(leaf: WorkspaceLeaf) {
		super(leaf);
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
					const inputText = input.value;
					const translatorObject = new translators();
					await translatorObject.myMemoryAPICall(inputText);
					output.value = translatorObject.outputText ? translatorObject.outputText : "this is null";
				}


			});

		const copyButton = innerContainer.createEl('button', { text: 'Copy', cls: 'button' });

		copyButton.onClickEvent(() => {
			navigator.clipboard.writeText(output.value)
			new Notice('Copied to clipboard');
		});

	}





	// async myMemoryAPICall(inputWord: string) {
	//
	// 	const response = await fetch(`https://api.mymemory.translated.net/get?q=${inputWord}&langpair=en|ja`);
	//
	// 	if (response.status == 200) {
	// 		const json = await response.json();
	// 		if (json.responseStatus == 200) {
	//
	// 			const translatedText = json.responseData.translatedText;
	// 			this.outputText = translatedText;
	// 			console.log(translatedText);
	// 			console.log(this.outputText)
	// 		} else {
	// 			this.outputText = "403"
	// 		}
	//
	// 	} else {
	// 		console.log("error");
	//
	//
	// 	}
	//
	//
	// }
}



