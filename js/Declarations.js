// #region Constants
const canvArena = document.getElementById("canArena");
const ctxArena = canvArena.getContext("2d");

const oDivScoreboard = document.getElementById('divScoreboard');

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

const oDivTime = document.getElementById('divTime');
const oDivHighScore = document.getElementById('divHighScore');

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

const iPointsLostForTailCollision = 5;
const iPointsLostForWallCollision = 5;
// #endregion

// #region Globals
var giGameLoopSpeed;
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

// #endregion

giVerbosity = goVerbosityEnum.Debug;