import { API } from "./api.js"

// Кнопочки
let btnUpdate = document.getElementById("update")
let btnRoot = document.getElementById("toRoot")
let btnBack = document.getElementById("backBtn")

let popupBlackout = document.getElementById("popUpBlackout")
let selectionWin = document.getElementById("selectionWin")

let selectionWinCloseBtn = document.getElementById("selectionWinCloseBtn")
let selectionWinOpenBtn = document.getElementById("list")
let selectionWinInput = document.getElementById("selectionWinInput")

selectionWinCloseBtn.addEventListener("click",()=>{
    popupBlackout.style.display = "none"
    selectionWin.style.display = "none"
})
selectionWinOpenBtn.addEventListener("click",()=>{
    popupBlackout.style.display = "block"
    selectionWin.style.display = "block"
})

let selectedAr = []


class ManagerWin {
    #win;
    #path;
    #controls;
    #selection;
    constructor(win, path, controls){
        this.#win = win
        this.#path = path
        this.#controls = controls
        this.#selection = []
    }

    addToSelection(el){
        if(!this.#selection.find(n => n == el)){
            this.#selection.push(el)
            console.log(el)
            console.log("addEl: "+el.getName())
        }else{
            console.log("alread in")
        }
        

    }
    getSelection(){
        return this.#selection
    }

    //Функция для обновления данных о файлах в директории
    //На выходе получаем нужые данные

    async update(){
        let drawAr = []
        let ar;

        try {
            // let res = await fetch("http://localhost:5001/pwd", {method: "POST", body: this.#path.getDom().value})
            // res = await res.text()
            // ar = JSON.parse(res)
            ar = await API.getDirs(this.#path.getDom().value)
        } catch (error) {
            alert("Error: Cannot open directory or file")
            this.#path.setText(this.#path.getDir())
            return
        }
        this.#path.setDir(this.#path.getText())
        console.log(ar)

        

        for(let file of ar){
            if(file?.isdir){
                drawAr.push(new File(file?.name, "", this.#path.getDir()+file.name, true))
            } else {
                let type = ''; let name = undefined
                if(file?.name != name){
                    [name, type] = file.name.split(".",2)
                    // /home/imper/MyScripts/Bashin/TestDirGeneratorScript
                }
                drawAr.push(new File(name, type, this.#path.getDir()+file.name, false))
                // console.log(name, type)
            }
        }
        
        this.#render(drawAr)

    }

    #render(drawAr){
        // Чистим окно рендера для нового рендера
        this.#win.innerHTML = ''


        // Создание кнопки возврата на уровень директории выше.
        if(this.#path.getText() != "/"){
            let backElem = document.createElement('div')
            backElem.className = 'slot'
            backElem.textContent = '..'
            backElem.addEventListener('click',()=>{ this.moveBack() })
            this.#win.insertBefore(backElem,null)
        }

        for(let i=0;i<drawAr.length;i++){
            let rendElem = document.createElement('div')

            // Создание кнопки выделения

            let selectBtnContainer = document.createElement("button")
            let selectBtnImg = document.createElement("img")
            selectBtnImg.src = "/pics/plus.svg"
            selectBtnContainer.insertBefore(selectBtnImg, null)

            selectBtnContainer.addEventListener("click", ()=>{
                this.addToSelection(drawAr[i])
            })

            // Остальная отрисовка. Иконка, текст.

            let icoBox = document.createElement('div')
            icoBox.className = "icoBox"

            let textBox = document.createElement('div')
            textBox.className = "fileTextBox"

            rendElem.className = 'slot'

            // Проверка на директорию. Для директории создаём прослушку на клик для перехода

            let rendImg = document.createElement('img')
            if(!drawAr[i].isFolder()){
                if(drawAr[i].getType()){
                    textBox.textContent = drawAr[i].getName()+'.'+drawAr[i].getType()
                }else{
                    textBox.textContent = drawAr[i].getName()
                }
                rendImg.src = "/pics/file.svg"
            }else{
                textBox.textContent = drawAr[i].getName()

                //Добавляем обработку клика на директорию

                textBox.addEventListener("click",(e)=>{ e.stopPropagation(); 

                    if(this.#path.getText() != '/'){
                        this.#path.setText(this.#path.getText() + '/' + drawAr[i].getName())
                    }else{
                        this.#path.setText("/"+ drawAr[i].getName())
                    }
                    
                    this.update()

                })
                rendImg.src = "/pics/folder.svg"
            }
            rendImg.draggable = false
            icoBox.insertBefore(rendImg,null)
            
            rendElem.insertBefore(selectBtnContainer,null)
            rendElem.insertBefore(icoBox,null)
            rendElem.insertBefore(textBox,null)
            this.#win.insertBefore(rendElem, null)
            
        }
    }

    moveToRoot(){
        this.#path.setText('/')
        this.update()
    }

    moveBack(){
        if(this.#path.getText() != '/'){
            let temp = this.#path.getText().split("/")
            temp.pop()
            if(temp.join("/").length > 0){
                this.#path.setText(temp.join("/"))
            }else{
                this.#path.setText("/")
            }
            


            this.update()
        }
    }

    // /mv json перемещаемых, и путь куда переместить

    async createFolder(){

        // /mkdir body: полный путь до папк

        let createPath = this.#path.getText()+"/"+prompt("Введите название папки")
        await API.createDir(createPath)
        await this.update()

    }

}

class SelectionWin {
    #path;
    constructor(btns){
        this.#path = selectionWinInput
    }

    render(drawAr){
        let curwin = managers[0]
        if(curwin.getSelection().length > 0){

            for(let i=0; i<drawAr.length; i++){

                let slot = document.createElement("div")
                slot.className = "selectionSlot"

                let btn = document.createElement("button")
                let btnImg = document.createElement("img")
                btnImg.src = "pics/dash.svg"
                btnImg.draggable = "false"

                let icoBox = document.createElement("div")
                icoBox.className = "icoBox"
                icoBox.draggable = "false"
                let img = document.createElement("img")
                if(drawAr[i].isFolder()){
                    img.src = "pics/folder.svg"
                }else{
                    img.src = "pics/file.svg"
                }
                

                let textBox = document.createElement("div")
                textBox.className = "textBox"

            }
        }
    }

    moveToRight(){
        
    }
}

class Controls{
    #domEl;
    #buttons;
    #managerWin;
    #isInited;

    constructor(elems, num){
        
        this.#domEl = elems[num]

        let buttons = {}
        let btn;

        btn = document.getElementsByClassName("updateLocal")[num]
        btn.addEventListener("click", ()=>{
            this.#managerWin.update()
        })

        btn = document.getElementsByClassName("backBtn")[num]
        btn.addEventListener("click", ()=>{
            this.#managerWin.moveBack()
        })

        btn = document.getElementsByClassName("toRoot")[num]
        btn.addEventListener("click", ()=>{
            this.#managerWin.moveToRoot()
        })

        btn = document.getElementsByClassName("makeDir")[num]
        btn.addEventListener("click", ()=>{
            this.#managerWin.createFolder()
        })
        

        this.#domEl = elems[num]
        this.#buttons = buttons
    }
    setManagerWin(n){
        this.#managerWin = n
    }

}

class Path {
    #domInput;
    #dir;

    constructor(domInput, dir=""){
        this.#domInput = domInput
        this.#dir = dir

        this.#domInput.value = '/'
    }
    getDom(){
        return this.#domInput
    }
    getText(){
        return this.#domInput.value
    }
    setText(txt){
        this.#domInput.value = txt
    }
    setDir(n){
        this.#dir = n
    }
    getDir(){
        return this.#dir
    }

}

// Окна с которыми будем рабоать
let wins = document.getElementsByClassName("manager")
let paths = document.getElementsByClassName("path")
let controls = document.getElementsByClassName("winContorls")
let tempAr = [
    new Controls(controls,0),
    new Controls(controls,1)
]
let managers = [
    new ManagerWin
    (
        wins[0],
        new Path(paths[0]),
        tempAr[0]
    ),
    new ManagerWin
    (
        wins[1],
        new Path(paths[1]),
        tempAr[1]
    )
]
// Доинициализируем компонент Controls, передавая ссылку на созданные окна менеджеров.
for(let i=0; i<tempAr.length; i++){ tempAr[i].setManagerWin(managers[i]) }

class File {
    #name;
    #type;
    #path;
    #isFolder;
    constructor(name, type, path, isFolder){
        this.#name = name
        this.#type = type
        this.#path = path
        this.#isFolder = isFolder
    }
    getName(){
        return this.#name
    }
    getType(){
        return this.#type
    }
    setPath(n){
        this.#path = n
    }
    getPath(){
        return this.#type
    }
    isFolder(){
        return this.#isFolder
    }
}



// Функции для кнопок

function dirBack(){
    let ar = curDir.split("/")
    ar.splice(0,1)
    ar.pop()
    console.log(ar)
    curDir = '/'+ar.join('/')
    update().then(()=>{ render(main) })
}

async function updateDirs(){
    for(let i=0; i < managers.length; i++){
        managers[i].update()
    }
}

// Привязка функций к кнопкам
btnUpdate.addEventListener('click', updateDirs)

updateDirs()



