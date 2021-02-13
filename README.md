# SpaceInvaders

This was a college assignment (so between 2014-15) in which the objective was to create a game in an object oriented language. I went with a JavaScript game made with [ImpactJS](https://github.com/phoboslab/impact), although does not use its level functionality, instead drawing straight to the canvas. A little hacky perhaps but it does the job. Programmer art, of course. If you press 'B' you'll see some borders and such that should go towards conveying how the swarm moves and behaves. Essentially the swarm is one entity and when a bullet collides with it, it will test to see whether the bullet has hit an (alive) alien within it, if so then kill the alien. If the bottom most row of aliens is killed, then that row is removed. The game can be paused and reset on demand using the buttons on the top right. The concept of bullet scarcity was an attempt to stop the player from just mindlessly spamming shots as there are no protections as the aliens do not fight back.

## Controls

Action | Key(s)
----|----
Move Left | A / Left Arrow
Move Right | D / Right Arrow
Shoot | W / Up Arrow / Space / Enter
Play / Pause | P / Left Click Pause Button
Reset | R / Left Click Reset Button
Debug | B

## Git History

Sadly the git history, if this ever had one, is lost to time.