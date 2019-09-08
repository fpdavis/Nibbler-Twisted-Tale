class Gamepad {
    constructor(oGamepad) {
        this.Gamepad = oGamepad;
        this.CenterAxis = [];
        this.Player = -1;

        for (let j = this.Gamepad.axes.length; j--;) {
            this.CenterAxis[j] = this.Gamepad.axes[j];
            MessageLog(`Axes ${j} Center: ` + this.CenterAxis[j], goVerbosityEnum.Debug);
        }
    }
}
class PlayerControl {
    constructor(SelectedControllerType, Up, Down, Left, Right) {
        this.SelectedControllerType = SelectedControllerType;
        this.Left = Left;
        this.Up = Up;
        this.Right = Right;
        this.Down = Down;
    }
}
function GamepadConnectedEvent(oEvent) {
    MessageLog(`Gamepad connected at index ${oEvent.gamepad.index}: ${oEvent.gamepad.id}. ${oEvent.gamepad.buttons.length} buttons, ${oEvent.gamepad.axes.length} axes.`, goVerbosityEnum.Information);

    gaGamepads[oEvent.gamepad.index] = new Gamepad(oEvent.gamepad);

    if (hasClass(oDivControllerMenu, "showGameMenu")) { PopulateControllerMenu(); }
}
function GamepadDisonnectedEvent(oEvent) {
    MessageLog(`Gamepad disconnected at index ${oEvent.gamepad.index}: ${oEvent.gamepad.id}.`, goVerbosityEnum.Information);

    gaGamepads.splice(oEvent.gamepad.index, 1);

    if (hasClass(oDivControllerMenu, "showGameMenu")) { PopulateControllerMenu(); }
}
function GamepadCheck() {

    for (let i = gaGamepads.length; i--;) {
        // Refresh the gamepad data
        gaGamepads[i].Gamepad = navigator.getGamepads()[i];

        for (let j = gaGamepads[i].Gamepad.axes.length; j--;) {
            if (gaGamepads[i].Gamepad.axes[j] !== gaGamepads[i].CenterAxis[j]) {
                MessageLog(`${gaGamepads[i].Gamepad.index}: ` + gaGamepads[i].Gamepad.axes[j], goVerbosityEnum.Debug);
            }
        }
        for (let j = gaGamepads[i].Gamepad.buttons.length; j--;) {
            if (gaGamepads[i].Gamepad.buttons[j] === 1.0 || (typeof (gaGamepads[i].Gamepad.buttons[j]) === "object" && gaGamepads[i].Gamepad.buttons[j].pressed)) {
                MessageLog(`${gaGamepads[i].Gamepad.index}: Button ${j} pressed`, goVerbosityEnum.Debug);
            }
        }
    }
}
function ShowControllerMenu(iPlayer) {

    removeClass(oDivGameMenu, "showGameMenu");
    addClass(oDivControllerMenu, "showGameMenu");

    giControllerMenuPlayer = iPlayer;
    oControllerMenuPlayerName.innerText = oTxtPlayerName[giControllerMenuPlayer].value.length > 0 ? oTxtPlayerName[giControllerMenuPlayer].value : "Player " + (giControllerMenuPlayer + 1);

    PopulateControllerMenu();
}
function PopulateControllerMenu() {

    oSelectControllerType.options.length = 2;

    if (gaGamepads.length === 0) {
        oSpanControllerMenuStatusBar.innerHTML = "No controllers detected. Press a button on any controller!";
        addClass(oDivControllerMenuStatusBar, "marquee");
    }
    else {
        for (let i = gaGamepads.length; i--;) {
            let oOption = document.createElement('option');
            oOption.value = i;
            oOption.innerHTML = gaGamepads[i].Gamepad.id;
            oOption.selected = gaGamepads[i].Player === giControllerMenuPlayer;
            oSelectControllerType.appendChild(oOption);
        }

        oSpanControllerMenuStatusBar.innerHTML = "Select the input method and configure.";
        removeClass(oDivControllerMenuStatusBar, "marquee");        
    }

    oTxtControllerMenuUp.value = keyCodes[gaPlayerControls[giControllerMenuPlayer].Up];
    oTxtControllerMenuDown.value = keyCodes[gaPlayerControls[giControllerMenuPlayer].Down];
    oTxtControllerMenuLeft.value = keyCodes[gaPlayerControls[giControllerMenuPlayer].Left];
    oTxtControllerMenuRight.value = keyCodes[gaPlayerControls[giControllerMenuPlayer].Right];
    
}
function HideControllerMenu(bSaveChanges) {

    removeClass(oDivControllerMenu, "showGameMenu");
    addClass(oDivGameMenu, "showGameMenu");

    for (let i = gaGamepads.length; i--;) {
        if (aGamepads[oSelectControllerType.value].Player === giControllerMenuPlayer) {
            aGamepads[oSelectControllerType.value].Player = -1;
        }
    }

    if (bSaveChanges) {
        if (!isNaN(oSelectControllerType.value)) {
            // Gamepad
            gaPlayerControls[giControllerMenuPlayer] = new PlayerControl(oSelectControllerType.value, oTxtControllerMenuUp.value.charCodeAt(0), oTxtControllerMenuDown.value.charCodeAt(0), oTxtControllerMenuLeft.value.charCodeAt(0), oTxtControllerMenuRight.value.charCodeAt(0));
            gaGamepads[oSelectControllerType.value].Player = giControllerMenuPlayer;
        }
        else {
            // Keyboard or Mouse
            gaPlayerControls[giControllerMenuPlayer] = new PlayerControl(oSelectControllerType.value,
                ConvertTextToKeycode(oTxtControllerMenuUp.value),
                ConvertTextToKeycode(oTxtControllerMenuDown.value),
                ConvertTextToKeycode(oTxtControllerMenuLeft.value),
                ConvertTextToKeycode(oTxtControllerMenuRight.value)
            );
        }
    }
}
function ConvertTextToKeycode(sString) {

    for (let iLoop = 0; iLoop < 256; iLoop++) {
        if (keyCodes[iLoop] === sString) return iLoop;
    }

    // In case we didn't find a match
    return sString.charCodeAt(0);
}
