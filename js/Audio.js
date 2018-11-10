// Define Sounds
var Sounds = {
    Volume: .8,
    NotMuted: true,
    Effects: new Object()
}

Sounds.Effects["Bite"] = new Audio('Sounds/Bite-SoundBible.com-2056759375.mp3');
Sounds.Effects["Pause"] = new Audio('Sounds/Splat And Squirt-SoundBible.com-2136633229.mp3');
Sounds.Effects["Crawlig"] = new Audio('Sounds/termites_and_ants-mike-koenig.mp3');
Sounds.Effects["Splat"] = new Audio('Sounds/Lava.flac');

var Music = {
    Volume: .5,
    NotMuted: true,
    Songs: new Object
}

Music.Songs["BossTheme"] = new Audio('Music/BossTheme.mp3');
