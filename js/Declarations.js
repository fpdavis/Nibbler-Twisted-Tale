// #region Constants
const canvArena = document.getElementById("canArena");
const ctxArena = canvArena.getContext("2d");

const oDivScoreboard = document.getElementById('divScoreboard');
const oDivPaused = document.getElementById('divPaused');

const oColorPlayer = new Array(4);
oColorPlayer[0] = document.getElementById('colorPlayer1');
oColorPlayer[1] = document.getElementById('colorPlayer2');
oColorPlayer[2] = document.getElementById('colorPlayer3');
oColorPlayer[3] = document.getElementById('colorPlayer4');

const oSpanPlayer = new Array(4);
oSpanPlayer[0] = document.getElementById('spanPlayer1');
oSpanPlayer[1] = document.getElementById('spanPlayer2');
oSpanPlayer[2] = document.getElementById('spanPlayer3');
oSpanPlayer[3] = document.getElementById('spanPlayer4');

const oSpanTime = document.getElementById('spanTime');
const oSpanHighScore = document.getElementById('spanHighScore');

const oDivGameMenu = document.getElementById('divGameMenu');

const oColorMenuPlayer = new Array(4);
oColorMenuPlayer[0] = document.getElementById('colorMenuPlayer1');
oColorMenuPlayer[1] = document.getElementById('colorMenuPlayer2');
oColorMenuPlayer[2] = document.getElementById('colorMenuPlayer3');
oColorMenuPlayer[3] = document.getElementById('colorMenuPlayer4');

const oSelectPlayer = new Array(4);
oSelectPlayer[0] = document.getElementById('selectPlayer1');
oSelectPlayer[1] = document.getElementById('selectPlayer2');
oSelectPlayer[2] = document.getElementById('selectPlayer3');
oSelectPlayer[3] = document.getElementById('selectPlayer4');

const oTxtPlayerName = new Array(4);
oTxtPlayerName[0] = document.getElementById('txtPlayer1Name');
oTxtPlayerName[1] = document.getElementById('txtPlayer2Name');
oTxtPlayerName[2] = document.getElementById('txtPlayer3Name');
oTxtPlayerName[3] = document.getElementById('txtPlayer4Name');

const oNumberLives = document.getElementById('numberLives');
const chkTime = document.getElementById('chkTime');
const chkMuteMusic = document.getElementById('chkMuteMusic');
const rangeMusicVolume = document.getElementById('rangeMusicVolume');
const chkMuteEffects = document.getElementById('chkMuteEffects');
const rangeEffectsVolume = document.getElementById('rangeEffectsVolume');

const oNumberTime = document.getElementById('numberTime');
const chkWallWrap = document.getElementById('chkWallWrap');
const chkDeadlyWalls = document.getElementById('chkDeadlyWalls');
const chkDeadlyTails = document.getElementById('chkDeadlyTails');
const chkDiagonalMovement = document.getElementById('chkDiagonalMovement');
const chkMaze = document.getElementById('chkMaze');
const chkEnemies = document.getElementById('chkEnemies');
const oSelectDificulty = document.getElementById('selectDificulty');
const selectArenaSize = document.getElementById('selectArenaSize');
const selectSpeed = document.getElementById('selectSpeed');
const chkNonStop = document.getElementById('chkNonStop');
const chkInfiniteTails = document.getElementById('chkInfiniteTails');

const oBtnStart = document.getElementById('btnStart');

const oDivControllerMenu = document.getElementById('divControllerMenu');
const oControllerMenuPlayerName = document.getElementById('spanControllerMenuPlayerName');
const oSelectControllerType = document.getElementById('selectControllerType');
const oSpanControllerMenuStatusBar = document.getElementById('spanControllerMenuStatusBar');
const oDivControllerMenuStatusBar = document.getElementById('divControllerMenuStatusBar');
const oTxtControllerMenuUp = document.getElementById('txtControllerMenuUp');
const oTxtControllerMenuDown = document.getElementById('txtControllerMenuDown');
const oTxtControllerMenuLeft = document.getElementById('txtControllerMenuLeft');
const oTxtControllerMenuRight = document.getElementById('txtControllerMenuRight');

const iPointsLostForTailCollision = 5;
const iPointsLostForWallCollision = 5;
const iSpawnTimeOut = 2000; // Miliseconds
// #endregion

// #region Globals
var giGameLoopSpeed = 100;
var gaGrid = [];
var gaMaze = [];
var giGridSize;
var giGridSizeHalf;
var giGridHeight = window.innerHeight - oDivScoreboard.offsetHeight;
var giMaxDistanceToPellet;
var gbSpaceBarHit;

var gbGamePaused = true;
var gaNibblers;
var gaPellets;
var gaBrainspawns;
var gaSprites = [];
var goCountDownTime;
var giTimeRemaining;
var goGameLoop;

var giArenaSquaresX;
var giArenaSquaresY;

var giMinimumTailLength = 3;
var gbWallWrap;
var gbDeadlyWalls;
var gbDeadlyTails;
var gbDiagonalMovement;
var gbStopAfterEachMove;
var gbInfiniteTails;

var giCurrentSong = 0;
var gaAnimations = new Object();

var gaGamepads = [];
var gaPlayerControls = [];
var giControllerMenuPlayer;

const goWalls = {
    Lookup: ["North", "South", "East", "West"],
    North: 0,
    South: 1,
    East: 2,
    West: 3
};

const keyCodes = {
    0: 'That key has no keycode',
    3: 'Break',
    8: 'Backspace / Delete',
    9: 'Tab',
    12: 'Clear',
    13: 'Enter',
    16: 'Shift',
    17: 'Control',
    18: 'Alt',
    19: 'Pause/Break',
    20: 'Caps Lock',
    21: 'Hangul',
    25: 'Hanja',
    27: 'Escape',
    28: 'Conversion',
    29: 'Con-Conversion',
    32: 'Spacebar',
    33: 'Page Up',
    34: 'Page Down',
    35: 'End',
    36: 'Home',
    37: 'Left Arrow',
    38: 'Up Arrow',
    39: 'Right Arrow',
    40: 'Down Arrow',
    41: 'Select',
    42: 'Print',
    43: 'Execute',
    44: 'Print Screen',
    45: 'Insert',
    46: 'Delete',
    47: 'Help',
    48: '0',
    49: '1',
    50: '2',
    51: '3',
    52: '4',
    53: '5',
    54: '6',
    55: '7',
    56: '8',
    57: '9',
    58: ':',
    59: 'Semicolon (Firefox), equals',
    60: '<',
    61: 'Equals (Firefox)',
    63: 'ß',
    64: '@ (Firefox)',
    65: 'a',
    66: 'b',
    67: 'c',
    68: 'd',
    69: 'e',
    70: 'f',
    71: 'g',
    72: 'h',
    73: 'i',
    74: 'j',
    75: 'k',
    76: 'l',
    77: 'm',
    78: 'n',
    79: 'o',
    80: 'p',
    81: 'q',
    82: 'r',
    83: 's',
    84: 't',
    85: 'u',
    86: 'v',
    87: 'w',
    88: 'x',
    89: 'y',
    90: 'z',
    91: 'Windows Key / Left ⌘ / Chromebook Search key',
    92: 'Right Window Key',
    93: 'Windows Menu / Right ⌘',
    95: 'Sleep',
    96: 'Numpad 0',
    97: 'Numpad 1',
    98: 'Numpad 2',
    99: 'Numpad 3',
    100: 'Numpad 4',
    101: 'Numpad 5',
    102: 'Numpad 6',
    103: 'Numpad 7',
    104: 'Numpad 8',
    105: 'Numpad 9',
    106: 'Numpad *',
    107: 'Numpad +',
    108: 'Numpad period (firefox)',
    109: 'Numpad -',
    110: 'Numpad .',
    111: 'Numpad /',
    112: 'f1',
    113: 'f2',
    114: 'f3',
    115: 'f4',
    116: 'f5',
    117: 'f6',
    118: 'f7',
    119: 'f8',
    120: 'f9',
    121: 'f10',
    122: 'f11',
    123: 'f12',
    124: 'f13',
    125: 'f14',
    126: 'f15',
    127: 'f16',
    128: 'f17',
    129: 'f18',
    130: 'f19',
    131: 'f20',
    132: 'f21',
    133: 'f22',
    134: 'f23',
    135: 'f24',
    144: 'Number Lock',
    145: 'Scroll Lock',
    160: '^',
    161: '!',
    162: '؛ (arabic semicolon)',
    163: '#',
    164: '$',
    165: 'ù',
    166: 'Page Backward',
    167: 'Page Forward',
    168: 'Refresh',
    169: 'Closing Paren (AZERTY)',
    170: '*',
    171: '~ + * key',
    172: 'Home Key',
    173: 'Minus (Firefox), mute/unmute',
    174: 'Decrease Volume Level',
    175: 'Increase Volume Level',
    176: 'Next',
    177: 'Previous',
    178: 'Stop',
    179: 'Play/Pause',
    180: 'e-mail',
    181: 'Mute/Unmute (Firefox)',
    182: 'Decrease Volume Level (Firefox)',
    183: 'Increase Volume Level (Firefox)',
    186: 'Semi-Colon / ñ',
    187: '=',
    188: ',',
    189: '-',
    190: '.',
    191: 'Forward Slash / ç',
    192: 'Grave Accent / ñ / æ / ö',
    193: '?, / or °',
    194: 'Numpad . (chrome)',
    219: 'Open Bracket',
    220: 'Back Slash',
    221: 'Close Bracket / å',
    222: 'Single Quote / ø / ä',
    223: '`',
    224: 'Left or Right ⌘ Key (Firefox)',
    225: 'Altgr',
    226: '< /git >, Left Back Slash',
    230: 'GNOME Compose Key',
    231: 'ç',
    233: 'XF86Forward',
    234: 'XF86Back',
    235: 'Non-Conversion',
    240: 'Alphanumeric',
    242: 'Hiragana/Katakana',
    243: 'Half-Width/Full-Width',
    244: 'Kanji',
    251: "Unlock Trackpad (Chrome/Edge)",
    255: 'Toggle Touchpad'
};
// #endregion
