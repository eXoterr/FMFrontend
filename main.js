let main = document.getElementsByClassName("manager")[0]
let btnUpdate = document.getElementById("update")
let btnRoot = document.getElementById("toRoot")
let btnBack = document.getElementById("backBtn")
let path = document.getElementById("path")
let curDir = "/"
let drawAr = []
let selectedAr = []
let miniLog = document.getElementById("miniLog")

let updateOn = false
let updateTime = 6000

path.value = curDir

//Функция возврата на уровень директории
function dirBack(){
    let ar = curDir.split("/")
    ar.splice(0,1)
    ar.pop()
    console.log(ar)
    curDir = '/'+ar.join('/')
    update().then(()=>{ render() })
}

//Функция для обновления данных о файлах в директории
async function update(){
    let res = await fetch("http://localhost:5001/pwd", {method: "POST", body: curDir})
    res = await res.text()
    try {
        ar = JSON.parse(res)
    } catch (error) {
        miniLog.textContent = "Error: Cannot open file"
        miniLog.style.transition = "all 0.25s ease"
        miniLog.style.color = "rgb(255,255,255)"
        setTimeout(()=>{
            miniLog.style.transition = "all 2s ease"
            miniLog.style.color = "rgb(75,75,75)"
        }, 1000)
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
}

// Обновление содержимого по таймеру
// setInterval(() => { update() }, updateTime);


// Привязка функций к кнопкам

btnUpdate.addEventListener('click',async ()=>{
    update().then(()=>{ render() })
})
btnRoot.addEventListener('click',async ()=>{
    curDir = "/"
    update().then(()=>{ render() })
})
btnBack.addEventListener('click', ()=>{
    dirBack()
})

//Класс отвечающий за наличие файла.
class file {
    #name;
    //Контент можно использовать для читаемых файлов, не мне лень это реализовывать.
    #type;
    constructor(name = "undefined", type=""){
        this.#name = name
        this.#type = type
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

function folderClick(name){
    if(curDir != '/'){
        curDir = curDir+'/'+name 
    }else{
        curDir = curDir+name
    }
    update().then(()=>{ render() })
}

function render(){
    // console.log("Render")
    main.innerHTML = ''

    // Создание кнопки возврата на уровень директории выше.
    if(curDir != "/"){
        let backElem = document.createElement('div')
        backElem.className = 'slotA'
        backElem.textContent = '..'
        backElem.addEventListener('click',()=>{ dirBack() })
        main.insertBefore(backElem,null)
    }
    for(let i=0;i<drawAr.length;i++){
        let rendElem = document.createElement('div')
        
        let icoBox = document.createElement('div')
        icoBox.className = "icoBox"

        let textBox = document.createElement('div')

        if(!(i%2)){
            rendElem.className = 'slotA'
        }else{
            rendElem.className = 'slotB'
        }

        if(drawAr[i].isSlot()){
            let rendImg = document.createElement('img')
            if(drawAr[i].getType() != 'dir'){
                textBox.textContent = drawAr[i].getName()+'.'+drawAr[i].getType()
                rendImg.src = "/pics/file.svg"
            }else{
                textBox.textContent = drawAr[i].getName()
                rendElem.addEventListener("click",()=>{ folderClick(drawAr[i].getName()) })
                rendImg.src = "/pics/folder.svg"
            }
            icoBox.insertBefore(rendImg,null)
        }
        rendElem.insertBefore(icoBox,null)
        rendElem.insertBefore(textBox,null)
        main.insertBefore(rendElem, null)
        
    }
}




// setInterval(()=>{

// },500)

