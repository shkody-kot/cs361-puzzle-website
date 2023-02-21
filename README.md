CS361
Puzzle Library includes:
- Slide Puzzles
  - 3x3
  - 4x4
- Sudoku Puzzle
- Memory Matching Game
- Scoreboard


Microservice communication contract:
- How to send data:
  - Open communication file titled color-change.txt
  - If file is not empty, clear it
  - Add hexcode into the file WITHOUT #
  - Close file
- How to receive data:
  - Check the file periodically to see if hexcode changed to rgb values
  - When changed, take the rgb values
  - Clear file

The file is now ready for different conversions. 

![image](https://user-images.githubusercontent.com/49286300/217630220-68355cf3-62ac-4b23-a544-647f38e58518.png)
