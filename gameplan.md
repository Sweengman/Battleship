#Functionality
##minimum viable product

###GA project requirements.
    - Render in browser.
    - Include win/loss logic and render win/loss messages in HTML.
    - Include separate HTML, CSS, and JavaScript files.
    - Use vanilaa JavaScript
    - Have properly indented code.
    - Contain no un-used/commented out code.
    - Functions and variables named sensibly.
    - Coded in a consistant manner.
    - Be deployed online using GitHub pages.

###battleship rules
each player selects where their ships go.
then take turns selecting one tile to shoot on a 10x10 grid, their choice will be marked with a hit or miss,
in order to help them infer where they should shoot next. 


###nice to have
powerups or special shots
difficulty mode
fancy gameboard
rendered images

#Design
what are the colors?
red and blue for each enemy, gray for the grid? 

what is the style?
minesweeper-esque tiles, and a ui to the side

where are you getting your sounds and img? 


#UI Wireframe
![Alt text](image.png)



#Psuedocode
constants

##classes
boat class


##variables
grid array

##cached DOM
message
grid div
images?

##on load

render
    controls
    visuals
    messages


##functions-eventlisteners

determine winner
    if 