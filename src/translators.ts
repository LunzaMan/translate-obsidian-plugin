export default class translators {
	outputText: string;
	async translatorReturnFunction(inputWord: string) {
		await this.myMemoryAPICall(inputWord);
		return this.outputText;
	}
	async myMemoryAPICall(inputWord: string) {

		const response = await fetch(`https://api.mymemory.translated.net/get?q=${inputWord}&langpair=en|ja`);

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
}
