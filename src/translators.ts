import { requestUrl } from "obsidian";

export interface APIArguments {
	inputWord: string;
	fromLanguage: string;
	toLanguage: string;
}

export default class translators {
	outputText: string;

	async translatorReturnFunction(inputWord: string, toLang: string, fromLang: string, activeAPI: string,) {
		const args: APIArguments = {
			inputWord: inputWord,
			fromLanguage: fromLang,
			toLanguage: toLang,
		}
		switch (activeAPI) {
			case "My Memory":
				await this.myMemoryAPICall(args);
				break;
			case "Lingva":
				await this.lingaAPICall(args);
				break;
			case "Projectsegfau":
				await this.projectsegfauAPICall(args);
				break;

		}
		return this.outputText;
	}


	async myMemoryAPICall(args: APIArguments) {

		const response = await requestUrl(`https://api.mymemory.translated.net/get?q=${args.inputWord}&langpair=${args.fromLanguage}|${args.toLanguage}`);

		if (response.status == 200) {
			const json = await response.json;
			if (json.responseStatus == 200) {

				const translatedText = json.responseData.translatedText;
				this.outputText = translatedText;
			} else {
				this.outputText = "Error connecting to the API, please use a different API"
			}

		} else {
			this.outputText = "Error connecting to the API, please use a different API"
		}


	}


	async lingaAPICall(args: APIArguments) {

		const encodedWord = encodeURIComponent(args.inputWord);
		// const baseURL = "https://lingva.garudalinux.org/"
		const baseURL = "https://lingva.ml/"
		const response = await requestUrl(`${baseURL}api/v1/${args.fromLanguage}/${args.toLanguage}/${encodedWord}`)

		if (response.status == 200) {
			const json = await response.json;
			this.outputText = json.translation;
		} else {
			this.outputText = "Error connecting to the API, please use a different API"
		}



	}

	async projectsegfauAPICall(args: APIArguments) {
		const encodedWord = encodeURIComponent(args.inputWord);
		const baseURL = 'https://translate.projectsegfau.lt/api/translate?engine=google&';

		const response = await requestUrl(`${baseURL}from=${args.fromLanguage}&to=${args.toLanguage}&text=${encodedWord}`);
		if (response.status == 200) {
			const json = await response.json;
			this.outputText = json["translated-text"]
		} else {
			this.outputText = "Error connecting to the API, please use a different API"
		}
	}
}
