
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
				console.log(activeAPI)
				break;
			case "Lingva":
				await this.lingaAPICall(args);
				console.log(activeAPI)
				break;
			case "Projectsegfau":
				await this.projectsegfauAPICall(args);
				console.log(activeAPI)
				break;

		}
		return this.outputText;
	}


	async myMemoryAPICall(args: APIArguments) {

		const response = await fetch(`https://api.mymemory.translated.net/get?q=${args.inputWord}&langpair=${args.fromLanguage}|${args.toLanguage}`);

		if (response.status == 200) {
			const json = await response.json();
			if (json.responseStatus == 200) {

				const translatedText = json.responseData.translatedText;
				this.outputText = translatedText;
				console.log(translatedText);
				console.log(this.outputText)
			} else {
				this.outputText = "403"
			}

		} else {

			console.log("error");


		}


	}


	async lingaAPICall(args: APIArguments) {

		const encodedWord = encodeURIComponent(args.inputWord);
		// const baseURL = "https://lingva.garudalinux.org/"
		const baseURL = "https://lingva.ml/"
		const response = await fetch(`${baseURL}api/v1/${args.fromLanguage}/${args.toLanguage}/${encodedWord}`)

		if (response.status == 200) {
			const json = await response.json();
			console.log(json.translation)
			this.outputText = json.translation;
		} else {
			console.log("error occured");
		}



	}

	async projectsegfauAPICall(args: APIArguments) {
		const encodedWord = encodeURIComponent(args.inputWord);
		const baseURL = 'https://translate.projectsegfau.lt/api/translate?engine=google&';

		const response = await fetch(`${baseURL}from=${args.fromLanguage}&to=${args.toLanguage}&text=${encodedWord}`);
		if (response.status == 200) {
			const json = await response.json();
			this.outputText = json["translated-text"]
		}
	}
}
