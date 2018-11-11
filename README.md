# Nibbler - Twisted Tale

The object of the game is to maneuver a square across the screen, leaving a trail behind. Avoid your tail and maze walls. Force opponent to collide with your tail or theirs. Pick up food and powerups to increase your length, strength and special abilities.

### Todo (in order of importance):

* Improved graphics for pellets
* Make enemies face the direction they are moving
* Add character names for computer depending on dificulty settings
* Read animations and music in from a json file
* Read wave/level information in from json file
* Fix edge bug where edges are too close in from the border
* Change style on score when player dies
* Add Game Over screen with results
* Add graph weighting incentives for pellets in A*
* Need to calculate closest target and best path with Wall Wrap
* Grid creation for A* is inefficient, should be updated with tail update
* Maze creates a copy of the Grid, want to create one grid and pass it in
* Game Options
	* Maze - Need to determine best algorithm to use
	* Waves/Levels
	* Dificulty level
* Add power ups from pellets
    * Must be bitten multiple times to be eaten
    * Random direction change
	* Ability to pause movement
	* Increase speed
	* Slow speed
	* Tail eating ability
	* Infinite tail
	* no-wrap
	* Loose tail
	* Erase ability - Need to better define this
	* Jump ability
	* Teleportation (Random/Directional?)
	* Incorporate Benchmark into Messagelog
* Improve Pause/Menu User Process/Optioning
* Apply dark theme to menu
* Initializations are a bit clunky and should be improved
* Enhance description
* Better mouse controls - The mouse is currently just a "suggestion" as to which direction to go for Nibbler
* Joystick support
* Center the playfield - it is pretty good but could be better
* Correct player and pellet size on resize
* Implement sounds using Howler.js with sprites? https://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library?

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

* Added a modal window with some fading/blurring and some inputs
* Wired up existing menu options
* Re-order Todo list
* Timer is working but must trigger next wave
* Added no-wrap game option support
* Added deadly walls and reduced player lives
* Stopped computer loop if player is dead (Lives = 0)
* Stopped game if all players are dead (Lives = 0)
* Stopped AI calculations if paused
* Began Power ups
	
* Better AI collision detection - Added an A* pathfinder algorithm for Nibblers to use.
* Converted some functions to classes
* Split up files for better maintainability/readability

* Evaluated A* for passing in Grid with Walls and improving efficiency
* Added Mute, volume up, and volume down controls
* Fixed an end game bug regarding togglePause.... broke Pause out to two functions
* Added Color Pickers for players
* Added a color picker on Scoreboard to help identify players
* Added blinking when Nibbler lives get to 0

* Added Diagonal Movement
* Added enemies
* Added a simple logging/debug messaging routine

* Added an Animation class with an animation loop
* Added an explosion/splat when Brainspawn kill a player
* Added splat sound effect when a player is killed by a Brainspawn
* Added music
* Fixed bug where player hits own tail while going in straight line
* Fixed spawning bug where player isn't being drawn

* Improved Menu layout
* Added volume controls to menu
* Added a sprite for Brainspawn
* Cleaned up arrays on new game start
* Fixed nonstop reversal
* Sorted sprite array in order of zIndex
* Improved image loading a little
* Added a yet to be used tint function that may be removed later
* Changed dificulty level to arena size selector
* Added counters for kills and suicides
* Decreased overall speed
* Animated all deaths
* Added Infinite tails
* Fixed bug with mute getting out of sync with checkboxes

* Maze is now generated fast and accounts for even or odd rows.
* Added a quick Benchmark timer
* Bots honor the maze... for the most part, still a bit buggy though


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
