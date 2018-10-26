# Nibbler - Twisted Tale

The object of the game is to maneuver a square across the screen, leaving a trail behind. Avoid your tail and maze walls. Force opponent to collide with your tail or theirs. Pick up food and powerups to increase your length, strength and special abilities.

### Todo (in order of importance):

* Menu with Legend
* Initializations are a bit clunky and should be improved
* Need a logging/debug framework of some sort?
* Add power ups from pellets
    * Random direction change
    * Multiple spawns
	* Ability to pause movement
	* Increase speed
	* Slow speed
	* Tail eating ability
	* no-wrap
		* Bounce/Change Direction/Follow Wall
		* Loose tail
		* Loose Point
	* Erase ability - Need to better define this
	* Jump ability
	* Teleportation (Random/Directional?)
* Game Options
    * Timer
	* no-wrap
	* Diagonal Movement
	* Maze
	* Waves
	* Enemies
* Enhance description
* Improved graphics
* Better mouse controls - The mouse is currently just a "suggestion" as to which direction to go for Nibbler
* Joystick support
* Center the playfield - it is pretty good but could be better
* Correct player and pellet size on resize
* Implement sounds using Howler.js with sprites https://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library?

### Changes (oldest to newest):

* Make sure spawn points are not the same
* Created a class for the player in preparation for multi-player
* Added explosion to grab pellet
* Added crawling noise
* Added pause sound
* Sorted and enhanced Todo list
* Added Attributions

* Added multi-player support, currently hard coded for two players
* Added space bar and "P" key for pause
* Tightened up bite sound

* Standardized function and variable names
* Made the Pellet into a class
* Each pellet has their own sound so they can play at the same time
* Moved Players into their own array for true multi-player support
* Added an initialization method for players 2-N
* Changed pellet spawn so it doesn't move the Nibblers during game play
* Added native support for up to four players, more are possible by assigning keys through a menu

* Converted vars to lets
* Created an array for the Pellets so we can add more!
* Added rudimentary scoring
* Added a countdown timer
* Added a scoreboard
* More efficient game pause
* Cleaned up some for loops with foreach

### Creative Commons License Attribution 3.0 

File: Splat And Squirt-SoundBible.com-2136633229.mp3
About: Sound of something spatting and the squirting. great wet, water, slime, or goo sound effect.
Title: Splat And Squirt
Uploaded: 10.09.09
Recorded by: Mike Koenig

File: Bite-SoundBible.com-2056759375.mp3
About: The sound of a monster bite or biting someone. great for those zombie games, or some cool sci fi monster scene. grrrr!
Title: Bite
Uploaded: 09.03.09
Recorded by: Mike Koenig 

File: termites_and_ants-mike-koenig.mp3
About: Sound of termites and ants crawling around and chewing on things. could be used for any small bug sound really like a beetlw or spider.
Title: Termites and Ants
Uploaded: 03.18.16
Recorded by: Mike Koenig 
