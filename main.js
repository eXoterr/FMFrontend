
// Окна с которыми будем рабоать
let main = document.getElementsByClassName("manager")[0]
let second = document.getElementsByClassName("manager")[1]


// Кнопочки
let btnUpdate = document.getElementById("update")
let btnRoot = document.getElementById("toRoot")
let btnBack = document.getElementById("backBtn")

let curDir = "/"
let drawAr = []
let selectedAr = []
let miniLog = document.getElementById("miniLog")

let updateOn = false
let updateTime = 6000

class managerWin {
    #win;
    #path;
    constructor(win = undefined, path = undefined){
        this.#win = win
    }

    render(){
        // console.log("Render")
        this.innerHTML = ''

        // Создание кнопки возврата на уровень директории выше.
        if(curDir != "/"){
            let backElem = document.createElement('div')
            backElem.className = 'slot'
            backElem.textContent = '..'
            backElem.addEventListener('click',()=>{ dirBack() })
            this.insertBefore(backElem,null)

            
        }
        for(let i=0;i<drawAr.length;i++){
            let rendElem = document.createElement('div')

            // Создание кнопки выделения
            let selectBtnContainer = document.createElement("button")
            let selectBtnImg = document.createElement("img")
            selectBtnImg.src = "/pics/plus.svg"
            selectBtnContainer.insertBefore(selectBtnImg,null)
            
            let icoBox = document.createElement('div')
            icoBox.className = "icoBox"

            let textBox = document.createElement('div')

            rendElem.className = 'slot'

            if(drawAr[i].isSlot()){
                let rendImg = document.createElement('img')
                if(drawAr[i].getType() != 'dir'){
                    textBox.textContent = drawAr[i].getName()+'.'+drawAr[i].getType()
                    rendImg.src = "/pics/file.svg"
                }else{
                    textBox.textContent = drawAr[i].getName()
                    rendElem.addEventListener("click",(e)=>{ e.stopPropagation(); folderClick(drawAr[i].getName()) })
                    rendImg.src = "/pics/folder.svg"
                }
                rendImg.draggable = false
                icoBox.insertBefore(rendImg,null)
            }
            rendElem.insertBefore(selectBtnContainer,null)
            rendElem.insertBefore(icoBox,null)
            rendElem.insertBefore(textBox,null)
            this.insertBefore(rendElem, null)
            
        }
    }

}

class path {
    #domInput;
    #dir;

    constructor(domInput = undefined, dir = ''){
        this.#domInput = domInput
        this.#dir = dir
    }

    setText(txt){
        this.#domInput.textContent = txt
    }

    getDir(){
        return this.#dir
    }

}

class file {
    #name;
    #type;
    #path;
    constructor(name = "undefined", type="", path=""){
        this.#name = name
        this.#type = type
        this.#path = path
    }
    isSlot(){
        return true
    }
    getName(){
        return this.#name
    }
    getType(){
        return this.#type
    }
}
class empty {
    isSlot(){
        return false
    }
}

path.value = curDir

//Функция для обновления данных о файлах в директории
async function update(){

    let drawAr = []

    try {
        let res = await fetch("http://localhost:5001/pwd", {method: "POST", body: curDir})
        res = await res.text()
        ar = JSON.parse(res)
    } catch (error) {
        alert("Error: Cannot open file")
        curDir = path.value
        return
    }
    miniLog.textContent = ""
    path.value = curDir
    console.log(ar)

    drawAr = []

    for(let i=0; i<ar.length; i++){
        if(ar[i] == ""){
            drawAr.push(new empty)
        }else{
            if(!ar[i].includes('/')){
                if(ar[i].includes('.')){
                    drawAr.push(new file(ar[i].split(".")[0],ar[i].split(".")[1]))
                }else{
                    drawAr.push(new file(ar[i]))
                }
            }else{
                drawAr.push(new file(ar[i].replace('/',''), 'dir'))
            }
        }
        
    }

    return drawAr

}

// Обновление содержимого по таймеру
// setInterval(() => { update() }, updateTime);

// Дальше идут менее критичные для функционала штуки

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
    update().then(()=>{ render(main) })
})
btnRoot.addEventListener('click',async ()=>{
    curDir = "/"
    update().then(()=>{ render(main) })
})
btnBack.addEventListener('click', ()=>{
    dirBack()
})











// setInterval(()=>{

// },500)

