class API{
	static #urls = {
		baseUrl: "http://localhost:5001/",
		dirsPath: "pwd",
		mkdirPath: "mkdir"
	}

	static async createDir(dirPath){
		return await this.#fetchFromBackend(this.#urls.mkdirPath, dirPath)
	}

	static async getDirs(dirPath){
		return await this.#fetchFromBackend(this.#urls.dirsPath, dirPath)
	}

	static async #fetchFromBackend(path, body){
		return await fetch(this.#urls.baseUrl + path, { method: "POST", body: body }).then(resp => resp.json())
	}
}

export {API}