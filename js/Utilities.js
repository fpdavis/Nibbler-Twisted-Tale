function hasClass(ele, cls) {
    if (ele) {
        return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
    }
    else {
        return false;
    }
}
function addClass(ele, cls) {
     if (ele && !hasClass(ele, cls)) ele.className += ` ${cls}`;
}
function removeClass(ele, cls) {
    if (ele && hasClass(ele, cls)) {
        let reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

function tintImage(imgElement, tintColor) {
    // create hidden canvas (using image dimensions)
    let canvas = document.createElement("canvas");
    canvas.width = imgElement.offsetWidth;
    canvas.height = imgElement.offsetHeight;

    let ctx = canvas.getContext("2d");
    ctx.drawImage(imgElement, 0, 0);

    let map = ctx.getImageData(0, 0, 320, 240);
    let imdata = map.data;

    // convert image to grayscale
    var r, g, b, avg;
    var alphas = [];
    for (var p = 0, len = imdata.length; p < len; p += 4) {
        r = imdata[p];
        g = imdata[p + 1];
        b = imdata[p + 2];
        alphas[p + 3] = imdata[p + 3];

        avg = Math.floor((r + g + b) / 3);

        imdata[p] = imdata[p + 1] = imdata[p + 2] = avg;
    }

    ctx.putImageData(map, 0, 0);

    // overlay filled rectangle using lighter composition
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5;
    ctx.fillStyle = tintColor;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //Replace alpha channel over remastered images
    map = ctx.getImageData(0, 0, canvas.width, canvas.height);
    imdata = map.data;
    for (let p = 0, len = imdata.length; p < len; p += 4) {
        imdata[p + 3] = alphas[p + 3];
    }
    ctx.putImageData(map, 0, 0);

    // replace image source with canvas data
    imgElement.src = canvas.toDataURL();
}

// https://www.taniarascia.com/how-to-use-local-storage-with-javascript/
function RestoreFormElements(sForm) {  

    let oElements = document.getElementById(sForm);
    MessageLog(`RestoreFormElements: ${oElements.length} elements found.`, goVerbosityEnum.Debug);

    for (var i = 0; i < oElements.length; i++) {
        switch (oElements[i].type) {
            case "color":
            case "text":
                if (localStorage.getItem(oElements[i].id) !== null && localStorage.getItem(oElements[i].id) !== "" ) {
                    oElements[i].value = localStorage.getItem(oElements[i].id);
                    MessageLog(`RestoreFormElements: ${oElements[i].id} = ` + localStorage.getItem(oElements[i].id), goVerbosityEnum.Debug);
                }
                break;
            case "number":
            case "range":
                if (localStorage.getItem(oElements[i].id) !== null) {
                    oElements[i].value = localStorage.getItem(oElements[i].id);
                }                
                break;
            case "checkbox":
                
                if (localStorage.getItem(oElements[i].id) !== null) {                    
                    oElements[i].checked = (localStorage.getItem(oElements[i].id) == "true");
                    // https://heyjavascript.com/javascript-string-to-boolean/
                    MessageLog(`RestoreFormElements: ${oElements[i].id} = ` + (localStorage.getItem(oElements[i].id) == "true"), goVerbosityEnum.Debug);
                }
                break;
            default:
                if (oElements[i].nodeName === "SELECT"
                    && localStorage.getItem(oElements[i].id) !== null) {
                    oElements[i].value = localStorage.getItem(oElements[i].id);
                    MessageLog(`RestoreFormElements: ${oElements[i].id} = ` + localStorage.getItem(oElements[i].id), goVerbosityEnum.Debug);
                }
        }
    }
}
function SaveFormElements(sForm) {

    //oElements = document.querySelectorAll(`#frmGameMenu input[type=text]`);
    //oElements = document.querySelectorAll(`#frmGameMenu input[type=number]`);
    //oElements = document.querySelectorAll(`#frmGameMenu input[type=checkbox]`);
    //oElements = document.querySelectorAll(`#frmGameMenu select`);
    //oElements = document.querySelectorAll(`#frmGameMenu input[type=range]`);
    //oElements = document.querySelectorAll(`#frmGameMenu input[type=color]`);
    
    let oElements = document.getElementById(sForm);
    MessageLog(`SaveFormElements: ${oElements.length} elements found.`, goVerbosityEnum.Debug);

    for (var i = 0; i < oElements.length; i++) {        
        switch (oElements[i].type) {
            case "color":
            case "text":
            case "number":
            case "range":
                localStorage.setItem(oElements[i].id, oElements[i].value);
                MessageLog(`SaveFormElements: ${oElements[i].id} = ${oElements[i].value}`, goVerbosityEnum.Debug);
                break;
            case "checkbox":
                localStorage.setItem(oElements[i].id, oElements[i].checked);
                MessageLog(`SaveFormElements: ${oElements[i].id} = ${oElements[i].checked}`, goVerbosityEnum.Debug);
                break;
            default:
                if (oElements[i].nodeName === "SELECT") {
                    localStorage.setItem(oElements[i].id, oElements[i].value);
                    MessageLog(`SaveFormElements: ${oElements[i].id} = ${oElements[i].value}`, goVerbosityEnum.Debug);
                }
        }
    }
}

var oBenchmark;
function Benchmark(name) {
    let oStartDate = new Date();
    return {
        stop: function () {
            let oEndDate = new Date();
            let iDuration = oEndDate.getTime() - oStartDate.getTime();

            let iSeconds = Math.floor((iDuration / 1000) % 60);
            let iMilliseconds = Math.floor(iDuration - (iSeconds * 1000));
            let iMinutes = Math.floor((iDuration / 1000 / 60) % 60);
            let iHours = Math.floor((iDuration / (1000 * 60 * 60)) % 24);
            let iDays = Math.floor(iDuration / (1000 * 60 * 60 * 24));

            MessageLog(`Timer: ${name} finished in ${iDays}:${iHours}:${iMinutes}:${iSeconds}.${iMilliseconds}`, goVerbosityEnum.Verbose);
        }
    };
}
