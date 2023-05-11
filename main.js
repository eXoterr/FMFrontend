
// Кнопочки
let btnUpdate = document.getElementById("update")
let btnRoot = document.getElementById("toRoot")
let btnBack = document.getElementById("backBtn")

let selectedAr = []


class ManagerWin {
    #win;
    #path;
    constructor(win = undefined, path = '/'){
        this.#win = win
        this.#path = path
    }

    //Функция для обновления данных о файлах в директории
    //На выходе получаем нужые данные

    async update(){
        let drawAr = []
        let ar;

        try {
            console.log(this.#path.getDom().value)

            let res = await fetch("http://localhost:5001/pwd", {method: "POST", body: this.#path.getDom().value})
            res = await res.text()
            ar = JSON.parse(res)
        } catch (error) {
            alert("Error: Cannot open directory")
            this.#path.setDir(this.#path.getDom().value)
            return
        }
        this.#path.getDom().value = this.#path.getDir()
        console.log(ar)

        

        for(let i=0; i<ar.length; i++){
            if(ar[i] == ""){
                drawAr.push(new Empty)
            }else{
                if(!ar[i].includes('/')){
                    if(ar[i].includes('.')){
                        drawAr.push(new File(ar[i].split(".")[0],ar[i].split(".")[1]))
                    }else{
                        drawAr.push(new File(ar[i]))
                    }
                }else{
                    drawAr.push(new File(ar[i].replace('/',''), 'dir'))
                }
            }
            
        }
        console.log(drawAr)
        this.#render(drawAr)

    }
    
    #render(drawAr){
        // Чистим окно рендера для нового рендера
        this.#win.innerHTML = ''


        // Создание кнопки возврата на уровень директории выше.
        if(this.#path.getDom().value != "/"){
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
                rendImg.src = "/pics/File.svg"
            }else{
                textBox.textContent = drawAr[i].getName()
                rendElem.addEventListener("click",(e)=>{ e.stopPropagation(); folderClick(drawAr[i].getName()) })
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

class Path {
    #domInput;
    #dir;

    constructor(domInput = undefined, dir = ''){
        this.#domInput = domInput
        this.#dir = dir

        this.#domInput.value = '/'
    }
    getDom(){
        return this.#domInput
    }
    setText(txt){
        this.#domInput.textContent = txt
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
let managers = [new ManagerWin(wins[0], new Path(paths[0])), new ManagerWin(wins[1], new Path(paths[1]))]
console.log(paths)
console.log(managers)

class File {
    #name;
    #type;
    #path;
    constructor(name = "undefined", type="", path=""){
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

function folderClick(name){
    if(curDir != '/'){
        curDir = curDir+'/'+name 
    }else{  
        curDir = curDir+name
    }
    update().then(()=>{ render(main) })
}

// Привязка функций к кнопкам
btnUpdate.addEventListener('click',async ()=>{
    for(let i=0; i < managers.length; i++){
        managers[i].update()
    }
})

btnRoot.addEventListener('click',async ()=>{
    curDir = "/"
    update().then(()=>{ render(main) })
})
btnBack.addEventListener('click', ()=>{
    dirBack()
})







