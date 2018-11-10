function hasClass(ele, cls) {
    return !!ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}
function addClass(ele, cls) {
    if (!hasClass(ele, cls)) ele.className += ` ${cls}`;
}
function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
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
