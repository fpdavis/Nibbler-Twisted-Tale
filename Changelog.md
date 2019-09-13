
# Changes (newest to oldest):

## Sep 12, 2019  
* Completed Credits
* Added methods to save and restore user settings to local storage
* Converting HTML menus to better responsive design

## Sep 10, 2019  
* Added method to identify the Current UI state (CurrentDiv())
* Adding Credits

## Sep 9, 2019  
* Updated timer to implement elapsed time when a timed game is not selected
* Formatted time to minutes and seconds
* Corrected calculations on number of lives/extra lives remaining
* Added a skull for dead player's remaining lives
* Added end game detection
* Fixed end game lock up issue?
* Notification countdown to next game/game beginning
* Mobile & mouse support added for first player

## Sep 8, 2019  
* Added a real Pause screen
* Added a Game Over Screen
* Added neon font to scoreboard
* Added Notification method
* Added Notifications to Mute, Volume, Speed, and Music selections
* Fixed issue with volume not working due to invalid javascript call
* Now showing name of song that is playing
* Created Changelog.md
* Added a GameState variable in place of GamePaused variable
* If all players are bots then it will play another game after a short pause on the Game Over screen

## Sep 7, 2019
* Added " hit "`" to cycle through debugging levels." to console ment
* Added tab and focus to canvas
* Fixed keyboard input for humans
* Added some of the attributions for newly uploaded files
* Enabled GitPages - https://fpdavis.github.io/Nibbler-Twisted-Tale/
* Renamed main HTML file to index.html

## May 31, 2019 
* Added Custom Speed in Speed Select drop down when using Page Up/Page Down
* Inform user when they try to bind to a custom key that the key is reserved
* Unbound the "P" key in favor of the "Pause/Break" key
* Added help text to marque scroller

## May 12, 2019 
* Incorporated basic timing into Messagelog. It now shows the miliseconds since the MessageLog was lat called.
* Optional ResetMessageLogTimer() method to reset the timer. 
* Utilities has a method for Benchmarking.
* Joystick support has been started. Reading from controllers is working, just requires the plumbing! 
* Added Loose Tail power up pellet
* Moved animation/image definitions into their own js file. Didn't make it json as the json file I originally
     created was actually harder to edit and read than the js file is. I feel the Music and Sound json files
	 are about as hard as an equivilant js file would be to edit so not much advantage to them. My opinion on
	 this may change if/when we start to load entire levels in from a json file.

## May 8, 2019 
* Fixed issues with maze generation!
* Nibblers don't get traped as much due to:
  * Fixed maze generation dead ends
  * Assign null target when path to current target can't be calculated (this can be improved)
  * Kill Nibbler after it can't calculate a path after X number of tries 
  * Increased chance of using dumb pathfinding algorythm that foces movement

## May 7, 2019 
* Refined the debug path highlighting
* Added Page Up/Page Down speed control for game loop (must unpause, not Start, for new speed to take effect)
* Added routine to generate an empty maze primarily for use in debug mode.
* Added routine to pad out maze so it is always the same size as the grid, before empty nodes (cells with no walls)
  at the bottom of the grid were not represented in the maze.

## May 5, 2019 
* Pellets can no longer spawn on Nibblers
* Nibblers can no longer spawn on Brainspawn
* Added ability to change loggin level on the fly using the ` key
* Added ability to change the song being played using the , and . keys
* Reading sounds and music in from json data files located in Data directory

## May 4, 2019 
* Each animation direction has its own frame count
* Dead Nibblers are no longer deadly
* Dead Nibblers are no longer obsticles in the pathfinder algorythim

## May 3, 2019 
* Fixed bug where giVerbosity was always being set to goVerbosityEnum.Debug
* Changed image naming conventions to remove 0s from index numbers
* Enemies now face the direction they are moving

## Nov 12, 2018 
* Added additional Neighbors routine
* Cleaned up North, South, East West code
* Fixed a few maze bugs but plenty still remain

## Nov 11, 2018 
* Bots honor the maze... for the most part
* Added click events to labels on menu
* Changed mouse icon on input fields on menu

## Nov 10, 2018 
* Maze is now generated fast and accounts for even or odd rows.
* Added a quick Benchmark timer
* Working on MazeGenerator.js 
* Separated files into their own directories
* Generating maze with no dead ends, flipping and mirroring.

## Nov 4, 2018 
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
* Added an Animation class with an animation loop
* Added an explosion/splat when Brainspawn kill a player
* Added splat sound effect when a player is killed by a Brainspawn
* Added music
* Fixed bug where player hits own tail while going in straight line
* Fixed spawning bug where player isn't being drawn
* Added Diagonal Movement
* Added enemies
* Added a simple logging/debug messaging routine

## Nov 2, 2018 
* Evaluated A* for passing in Grid with Walls and improving efficiency
* Added Mute, volume up, and volume down controls
* Fixed an end game bug regarding togglePause.... broke Pause out to two functions
* Added Color Pickers for players
* Added a color picker on Scoreboard to help identify players
* Added blinking when Nibbler lives get to 0

## Oct 31, 2018 
* Better AI collision detection - Added an A* pathfinder algorithm for Nibblers to use.
* Converted some functions to classes
* Split up files for better maintainability/readability

## Oct 28, 2018 
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

## Oct 25, 2018 
* Converted vars to lets
* Created an array for the Pellets so we can add more!
* Added rudimentary scoring
* Added a countdown timer
* Added a scoreboard
* More efficient game pause
* Cleaned up some for loops with foreach
* Standardized function and variable names
* Made the Pellet into a class
* Each pellet has their own sound so they can play at the same time
* Moved Players into their own array for true multi-player support
* Added an initialization method for players 2-N
* Changed pellet spawn so it doesn't move the Nibblers during game play
* Added native support for up to four players, more are possible by assigning keys through a menu

## Oct 23, 2018 
* Path finding algorythm should take into account when tails are not deadly (for when a path can't be calculated multiple times)
* Added multi-player support, currently hard coded for two players
* Added space bar and "P" key for pause
* Tightened up bite sound
* Intelligently assign a different target if a path can't be calculate to target
* For non-stop calculate a new (valid/random?) direction when a maze wall is hit

## Oct 21, 2018 
* Make sure spawn points are not the same
* Created a class for the player in preparation for multi-player
* Added explosion to grab pellet
* Added crawling noise
* Added pause sound
* Sorted and enhanced Todo list
* Added Attributions

## Oct 20, 2018 
* Created README.md
