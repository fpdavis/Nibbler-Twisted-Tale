// Define Sounds
var Sounds = {
    Volume: .8,
    NotMuted: true,
    Effects: new Object()
};

var Music = {
    Volume: .5,
    NotMuted: false,
    Songs: new Array()
};

function LoadSounds(SoundData) {
    for (let iLoop = 0; iLoop < SoundData.length; iLoop++) {
        MessageLog(`Loading Sound "` + SoundData[iLoop]['name'] + '" from ' + SoundData[iLoop]['src'], goVerbosityEnum.Verbose);
        Sounds.Effects[SoundData[iLoop]['name']] = new Audio(encodeURI(SoundData[iLoop]['src']));
    }
}

function LoadMusic(MusicData) {
    for (let iLoop = 0; iLoop < MusicData.length; iLoop++) {        
        MessageLog(`Loading Song "` + MusicData[iLoop]['src'].split("/").pop().split(".")[0] + '" from ' + MusicData[iLoop]['src'], goVerbosityEnum.Verbose);
        Music.Songs[iLoop] = new Audio(encodeURI(MusicData[iLoop]['src']));
        Music.Songs[iLoop].addEventListener('ended', function () { ChangeCurrentSong(1); });
    }
}

function ChangeCurrentSong(iIncrement) {  

    if (Music.NotMuted) {

    Music.Songs[giCurrentSong].pause();
    giCurrentSong += iIncrement;

        if (giCurrentSong < 0) {
            giCurrentSong = Music.Songs.length - 1;
        }
        else if (giCurrentSong >= Music.Songs.length) {
            giCurrentSong = 0;
        }

        Music.Songs[giCurrentSong].volume = Music.Volume;


        Music.Songs[giCurrentSong].currentTime = 0;
        Music.Songs[giCurrentSong].play();

        MessageLog(`Now playing ` + decodeURIComponent(Music.Songs[giCurrentSong].currentSrc.split("/").pop().split(".")[0]), goVerbosityEnum.Information);
    }
}