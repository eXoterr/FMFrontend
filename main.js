import { API } from "./api.js"

// Кнопочки
let btnUpdate = document.getElementById("update")
let btnRoot = document.getElementById("toRoot")
let btnBack = document.getElementById("backBtn")

let selectedAr = []


class ManagerWin {
    #win;
    #path;
    #controls;
    constructor(win, path, controls){
        this.#win = win
        this.#path = path
        this.#controls = controls
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
                drawAr.push(new File(file?.name, 'dir'))
            } else {
                drawAr.push(new File(file?.name))
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
            backElem.addEventListener('click',()=>{ dirBack() })
            this.#win.insertBefore(backElem,null)
        }

        for(let i=0;i<drawAr.length;i++){
            let rendElem = document.createElement('div')

            // Создание кнопки выделения

            let selectBtnContainer = document.createElement("button")
            let selectBtnImg = document.createElement("img")
            selectBtnImg.src = "/pics/plus.svg"
            selectBtnContainer.insertBefore(selectBtnImg, null)

            // Остальная отрисовка. Иконка, текст.

            let icoBox = document.createElement('div')
            icoBox.className = "icoBox"

            let textBox = document.createElement('div')

            rendElem.className = 'slot'

            // Проверка на директорию. Для директории создаём прослушку на клик для перехода

            let rendImg = document.createElement('img')
            if(drawAr[i].getType() != 'dir'){
                textBox.textContent = drawAr[i].getName()+'.'+drawAr[i].getType()
                rendImg.src = "/pics/file.svg"
            }else{
                textBox.textContent = drawAr[i].getName()

                //Добавляем обработку клика на директорию

                rendElem.addEventListener("click",(e)=>{ e.stopPropagation(); 

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

}

class Controls{
    #domEl;
    #buttons;

    constructor(elem = undefined, num = undefined){
        if(elem == undefined){ throw new Error("elem cannot be undefiend!") }
        if(num == undefined){ throw new Error("num cannot be undefiend!") }
        
        // let buttons = [
        //     document.getElementsByClassName("updateLocal")[num],
        //     document.getElementsByClassName("backBtn")[num],
        //     document.getElementsByClassName("toRoot")[num]
        // ]
        let buttons = {}
        let btn = document.getElementsByClassName("updateLocal")[num]
        btn.addEventListener("click", ()=>{

        })

    }

}

class Path {
    #domInput;
    #dir;

    constructor(domInput, dir){
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
let managers = [new ManagerWin(wins[0], new Path(paths[0])), new ManagerWin(wins[1], new Path(paths[1]))]

class File {
    #name;
    #type;
    #path;
    constructor(name, type, path){
        this.#name = name
        this.#type = type
        this.#path = path
    }
    getName(){
        return this.#name
    }
    getType(){
        return this.#type
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



