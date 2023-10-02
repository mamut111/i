window.onload = function () {
    initDate();
    const checkboxCard = document.querySelector('.checkboxCard')
    if (localStorage.getItem("SaveCard")) {
        checkboxCard.checked = JSON.parse(localStorage.getItem("SaveCard")).checked
        card.unmaskedValue = JSON.parse(localStorage.getItem("SaveCard")).lastvalue
    } else {
        localStorage.setItem("SaveCard", JSON.stringify({checked: false, lastvalue: ''}))
    }

    const checkboxSaldo = document.querySelector('.checkboxSaldo')
    if (localStorage.getItem("SaveSaldo")) {
        checkboxSaldo.checked = JSON.parse(localStorage.getItem("SaveSaldo")).checked
        saldo.unmaskedValue = JSON.parse(localStorage.getItem("SaveSaldo")).lastvalue
    } else {
        localStorage.setItem("SaveSaldo", JSON.stringify({checked: false, lastvalue: ''}))
    }
}

const price = new IMask(
    document.querySelector('.price'),
    {
      mask: Number,
      min: 0,
      max: 1000000,
    }
)

const card = new IMask(
    document.querySelector('.card'),
    {
      mask: '0000 0000',
      overwrite: 'shift'
    }
)

const saldo = new IMask(
    document.querySelector('.saldo'),
    {
      mask: '0[00][,][00]',
      overwrite: 'shift'
    }
)

const check = {
    card: "",
    price: 0,
    date: "",
    saldo: 0,
    date_waluty: "",
    number_ref: 0,
    price_2: 0,
    pln_step: 0
}

function generateImg() {
    check.price = `-${price.value}`
    check.date = formatDateToScreen(form.querySelector('.date').value);
    check.card = card.value ? card.value : `${getNumber(4)} ${getNumber(4)}`
    check.saldo = saldo.value ? `${saldo.value} PLN` : `${getRandomInt(1,1000)},${getRandomInt(0,10)}${getRandomInt(1,10)} PLN`
    check.date_waluty = formatDateToScreen(form.querySelector('.date').value);
    check.number_ref = `05272423213283${getNumber(9)}`
    check.price_2 = `${form.querySelector('.price').value} PLN`
    check.pln_step = price.value.toString().length - 1

    const obj = {
        "files": [ 
            "https://raw.githubusercontent.com/mamut111/i/main/1.psd"
        ],
        "resources": [
            "https://raw.githubusercontent.com/mamut111/i/main/0.ttf",
        ],
        "environment": {
    
        },
        "script" : `var a = app.activeDocument.layers.getByName('card'); a.textItem.contents = '53 (...) ${check.card}';
        a = app.activeDocument.layers.getByName('summa_1'); a.textItem.contents = '${check.price}';
        a = app.activeDocument.layers.getByName('data_operacji'); a.textItem.contents = '${check.date}';
        a = app.activeDocument.layers.getByName('saldo'); a.textItem.contents = '${check.saldo}';
        a = app.activeDocument.layers.getByName('data_waluty'); a.textItem.contents = '${check.date_waluty}';
        a = app.activeDocument.layers.getByName('numer_ref'); a.textItem.contents = '${check.number_ref}';
        a = app.activeDocument.layers.getByName('summa_2'); a.textItem.contents = '${check.price_2}';
        a = app.activeDocument.layers.getByName('PLN'); a.translate(${11 * check.pln_step},0);
        app.activeDocument.saveToOE("png");`
    }
    const url = encodeURI(`https://www.photopea.com#${JSON.stringify(obj)}`)
    console.log(url)
    let iframe = document.querySelector('.iframe');
    iframe.src = url
}

window.addEventListener("message", function(e) { 
    if (e.data != 'done') {
        var arrayBufferView = new Uint8Array(e.data);
        var blob = new Blob([arrayBufferView], {type: "image/jpeg"});
        var urlCreator = window.URL || window.webkitURL;
        var imageUrl = urlCreator.createObjectURL(blob);
        var img = document.querySelector("#photo");
        img.src = imageUrl;
        downloadBtn.style.display = "inline-block"
        copyBtn.style.display = "inline-block"
        link.download = `${check.price}`
        link.href = imageUrl;
        console.log(imageUrl)
    }
    console.log(e) 
});

let downloadBtn = document.querySelector("#download-btn");
let copyBtn = document.querySelector("#copy-btn");
let link = document.querySelector("#link");

const img = new Image();
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

downloadBtn.addEventListener("click", function (e) {
    link.click();
})

copyBtn.addEventListener("click", function (e) {
    copyToClipboard(link.href);
})

form.addEventListener('submit', (e) => {
    e.preventDefault();
    downloadBtn.style.display = "none"
        copyBtn.style.display = "none"
    if (document.querySelector('.iframe')) {
        document.querySelector('.iframe').remove()
    }
    const iframe = document.createElement('iframe')
    iframe.className = "iframe"
    iframe.style.display = "none"
    const place = document.querySelector(".iframe-place")
    place.append(iframe)
    generateImg()
});

form.oninput = function(event) { 
    if (event.target.type == "checkbox") { 
        let t = event.target; 
        switch (t.className) {
            case 'checkboxCard':
                t.checked ? localStorage.setItem("SaveCard", JSON.stringify({checked: true, lastvalue: card.value})) : localStorage.setItem("SaveCard", JSON.stringify({checked: false, lastvalue: ''}))
                break
            case 'checkboxSaldo':
                t.checked ? localStorage.setItem("SaveSaldo", JSON.stringify({checked: true, lastvalue: saldo.value})) : localStorage.setItem("SaveSaldo", JSON.stringify({checked: false, lastvalue: ''}))
                break
      }
    }

    if (event.target.type == "text") { 
        let t = event.target;
        let checkbox; 
        switch (t.className) {
            case 'input card':
                checkbox = JSON.parse(localStorage.getItem("SaveCard")).checked
                checkbox ? localStorage.setItem("SaveCard", JSON.stringify({ ...JSON.parse(localStorage.getItem("SaveCard")), lastvalue: card.value })) : ''
                break
            case 'input saldo':
                checkbox = JSON.parse(localStorage.getItem("SaveSaldo")).checked
                checkbox ? localStorage.setItem("SaveSaldo", JSON.stringify({ ...JSON.parse(localStorage.getItem("SaveSaldo")), lastvalue: saldo.value })) : ''
                break
      }
    }
};

async function copyToClipboard(src) {
    const image = await writeToCanvas(src);
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          [image.type]: image,
        })
      ]);
  
      console.log("Success copy");
    } catch(e) {
      console.log("Copy failed: " + e);
    }
}

function writeToCanvas(src) {
    return new Promise((res, rej) => {
      img.src = src;
      img.onload = function() {
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        ctx.drawImage(img,0,0)
        canvas.toBlob((blob) => {
          res(blob);
        }, 'image/png');
      }
    });
}

function initDate() {
    const input = document.querySelector(".date")
    let d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    input.value = [year, month, day].join('-');
}

function getNumber(n) {
    let number = '';
    for(let i = 0; i < n; i++) {
        number += Math.floor(Math.random() * 10);
    }
    return number;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min; //Максимум не включается, минимум включается
}

function formatDateToScreen(date) {
    var d = new Date(date),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

    if (month.length < 2) 
        month = '0' + month;
    if (day.length < 2) 
        day = '0' + day;

    return [day, month, year].join('.');
}