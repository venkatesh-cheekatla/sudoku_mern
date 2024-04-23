# Sudoku
This is my implementation of Sudoku Game using the MERN Stack
Demo Link: https://drive.google.com/drive/folders/1EtT3taMv6xfdShwhCJWUVQyxRSLvHIbg?usp=sharing

## Running instructions
1. Setup a MongoDB database and add it connection URL to .env file in backend folder
2. Add port on which backend server will be running in .env file
3. Add backend server URL and PORT in frontend/src/App.js line 16 and 17
4. Add your own JWT Secret key in backend .env file
5. Run `npm install` in both backend and frontend folders
6. Run `npm start` in both backend and frontend folders in separate terminals

## Features
- You can Register/Login to save your data
- Leaderboards which show Top 5 players based on Scores, Number of Games played and Time taken to solve current game.
- Load game using text file (Game string format: a txt file containing 81 comma separated integers between 1 to 9. Enter -1 for empty space)
- Automatic Solver built-in