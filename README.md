# Nibbler - Twisted Tale

The object of the game is to maneuver a square across the screen, leaving a trail behind. Avoid your tail and maze walls. 
Force opponent to collide with your tail or theirs. Pick up food and powerups to increase your length, strength and special abilities.

**Play it online at https://fpdavis.github.io/Nibbler-Twisted-Tale** 
**View the [Changelog](https://fpdavis.github.io/Nibbler-Twisted-Tale/Changelog.md).**

### Todo (in order of importance):

* Add more game states to know when the player is in the setup and controller menus?
* Refactor to create a game object, would it be possible to run multiple games at once?
* Joystick support
   * Can't give focus to txtControllerMenu* direction text boxes if they are empty
* Better mouse click/tap control - The old mouse click code is currently just a "suggestion" as to which direction to go for Nibbler.
		Make it set a point for the Pathfinder algorythm. Will need to get coordinates from tap.
* Maybe add a new type of Brainspawn to camp out around pellets
* Read wave/level information in from json file
* Need to calculate closest target and best path with Wall Wrap
* Grid creation for A* is inefficient, should be updated with tail update
* Maze creates a copy of the Grid, want to create one grid and pass it in
* Add graph weighting incentives for pellets in A*
* Add Nibbler body shortest movement/body drag
* Add credits
* Add neon sounds
* Game Options
	* Capture the Flag
	* Waves/Levels
	* Dificulty level
	* Add power ups from pellets
		* Weapons for Nibblers and Brainspawn
		* Must be bitten multiple times to be eaten
		* Random direction change
		* Ability to pause movement
		* Increase speed
		* Slow speed
		* Tail eating ability
		* Infinite tail
		* no-wrap
		* Erase ability - Need to better define this
		* Jump ability
		* Teleportation (Random/Directional?)
* Enhance description
* Add additional fields (such as title and author) in json files for credits and notifications
* Help Menu
* Have it remember and report the overall winner from multiple games
* If there is a tie between more than two people or if a player has a really long name it will not fit on the Game Over screen
* Improved graphics for pellets
* Improved graphics for Nibbler
	* https://jsfiddle.net/m1erickson/2d7ZN/
	* https://stackoverflow.com/questions/23830471/convert-image-color-without-changing-its-transparent-background
* Add character names for computer depending on dificulty settings
* Make the Nibbler more inteligent about pellet selection, weight distance to pellet along with type of pellet
* Changing Arena Size after first game doesn't always work properly. Specifically when resiszing browser or
      going from small arena to medium/large.
* Fix edge bug where edges are too close in from the border
* Center the playfield - it is pretty good but could be better
* Correct player and pellet size on resize
* Implement sounds using Howler.js with sprites? https://goldfirestudios.com/blog/104/howler.js-Modern-Web-Audio-Javascript-Library?



### Creative Commons License Attributions

File: Splat And Squirt-SoundBible.com-2136633229.mp3
Title: Splat And Squirt
About: Sound of something spatting and the squirting. great wet, water, slime, or goo sound effect.
Uploaded: 10.09.09
Recorded by: Mike Koenig

File: Bite-SoundBible.com-2056759375.mp3
Title: Bite
About: The sound of a monster bite or biting someone. great for those zombie games, or some cool sci fi monster scene. grrrr!
Uploaded: 09.03.09
Recorded by: Mike Koenig 

File: termites_and_ants-mike-koenig.mp3
Title: Termites and Ants
About: Sound of termites and ants crawling around and chewing on things. could be used for any small bug sound really like a beetlw or spider.
Uploaded: 03.18.16
Recorded by: Mike Koenig 
URL: https://soundbible.com/2113-Termites-and-Ants.html

File: Most Stereotypical Boss Theme Ever.ogg 
Title: Most Stereotypical Boss Theme Ever
About: Yeah, pwetty much what the title says.
Uploaded: Saturday, August 12, 2017 - 10:11
Recorded by: Spring
URL: https://opengameart.org/content/most-stereotypical-boss-theme-ever

File: Boss Theme.mp3
Title:  Boss Theme

File: Boss Battle 2 V1.wav, Boss Battle 2 V2.wav
Title: Boss Battle
About: Various versions, loopable
Uploaded: Wednesday, May 16, 2018 - 13:32
Recorded by: Nene (https://opengameart.org/users/nene)
URL: https://opengameart.org/content/boss-battle-2-8-bit-re-upload

File: Boss Battle 5 V1.wav, Boss Battle 5 V2.wav
Title: Boss Battle
About: Various versions
Uploaded: Friday, May 18, 2018 - 18:32
Recorded by: Nene (https://opengameart.org/users/nene)
URL: https://opengameart.org/content/boss-battle-5-8-bit

File: Boss Battle 3 V1.wav, Boss Battle 3 V2.wav
Title: Boss Battle
About: Various versions, loopable, V3 also available
Uploaded: Wednesday, May 16, 2018 - 13:38
Recorded by: Nene (https://opengameart.org/users/nene)
URL: https://opengameart.org/content/boss-battle-3-8-bit-re-upload

File: Hold The Line (Boss Theme).ogg
Title: Hold The Line (Boss Theme)
About: A boss theme inspired by 16-bit JPRGs.
Uploaded: Friday, October 23, 2009 - 23:13
Recorded by: Bart Kelsey (https://opengameart.org/user/1) (https://www.patreon.com/opengameart)
URL: https://opengameart.org/content/hold-line-boss-theme

File: Hold The Line (Orchestral Remix).flac
Title: Hold The Line (Orchestral Remix)
About: Another great tune by Bart with new orchestral instrumentation.
Uploaded: Saturday, October 24, 2009 - 13:59
Recorded by: Bart Kelsey (https://opengameart.org/user/1) https://www.patreon.com/opengameart
             Remaxim (https://opengameart.org/users/remaxim)
URL: https://opengameart.org/content/hold-the-line-orchestral-remix