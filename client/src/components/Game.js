import React, { useEffect, useState } from 'react';
import { getSudoku, updateStatistics } from '../actions/sudoku';
import { useSelector, useDispatch, connect } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import Navbar from './Navbar/Navbar';
import '../css/index.css';

const Game = ({ sudoku }) => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();
    const { search } = location;

    const [timer, setTimer] = useState(0);
    const [isRunning, setIsRunning] = useState(true);
    const [mistakes, setMistakes] = useState(0); // Add mistakes state
    const [hintChances, setHintChances] = useState(3);
   

    const [solvedPuzzle, setSolvedPuzzle] = useState(null);

    // Modified solve function to return the solved puzzle
    // const solve = (i, j, game) => {
    //     if (i === 9) {
    //         i = 0;
    //         j++;
    //         if (j === 9) {
    //             // Store solved puzzle
    //             setSolvedPuzzle(deepCopy(game));
    //             return game; // Return the solved puzzle
    //         }
    //     }
    //     if (game[i][j] !== -1)
    //         return solve(i + 1, j, game);

    //     for (let val = 1; val <= 9; ++val) {
    //         if (checkValid(i, j, val, game)) {
    //             game[i][j] = val;
    //             let result = solve(i + 1, j, game);
    //             if (result) return result; // If a solution is found, return it
    //         }
    //     }
    //     game[i][j] = -1;
    //     return null; // If no solution is found, return null
    // };


    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(() => {
                setTimer(prevTimer => prevTimer + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isRunning]);

    // Function to format time
    const formattedTime = () => {
        const minutes = Math.floor(timer / 60);
        const seconds = timer % 60;
        return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    let mode = "";

    if (!search) {
        mode = "easy"; // if no mode is specified, set the mode to easy
    } else {
        const searchParams = new URLSearchParams(search);
        let modeParam = searchParams.get('mode');
        if (modeParam == "easy" || modeParam == "medium" || modeParam == "hard" || modeParam == "extreme") mode = modeParam;
        else navigate('/');
    }

    const [selectedCellIdx, setSelectedCellIdx] = useState(0);

    useEffect(() => {
        if (!sessionStorage.currentSudoku) {
            dispatch(getSudoku(mode));
        } else {
            let savedSudoku = JSON.parse(sessionStorage.currentSudoku);
            if (mode == savedSudoku.mode)
                dispatch({ type: "SET_SUDOKU", data: savedSudoku });
            else navigate('/');
        }
    }, [dispatch]);

    const handleSelected = (idx) => {
        setSelectedCellIdx(idx);
        const row = Math.floor(idx / 9);
        const col = idx % 9;
        console.log("Selected cell value:", sudoku?.gridToBeFilled[row][col]);
    }

    const UpdateSudokuGrid = (number) => {
        let row = Math.floor(selectedCellIdx / 9);
        let col = selectedCellIdx % 9;
    
        if (number !== 0 && (checkRow(row, number) || checkColumn(col, number) || checkGrid(row, col, number))) {
            // Show invalid entry popup
            alert('Invalid entry! Number already exists in this row, column, or 3x3 grid.');
            setMistakes(prev => prev + 1); // Increment mistakes counter
    
            if (mistakes >= 3) { // Change the condition to check if mistakes equal 3
                dispatch({ type: "CLEAR_USER_ENTRIES" });
                setMistakes(0);
                clearSudokuGrid(); // Clear the sudoku grid if mistakes reach 3
            }
        } else {
            if (sudoku?.gridWithBlanks[row][col] == 0) {
                dispatch({ type: "UPDATE_SUDOKU", data: { number, row, col } });
                
            }
    
            if (sudokuIsCompleted() && sudokuIsRight()) {
                document.querySelector("#game-screen").classList.remove('active');
                document.querySelector("#result-screen").classList.add('active');
                sessionStorage.removeItem('currentSudoku');
                if (localStorage.getItem('sudokuUser'))
                    dispatch(updateStatistics({ mode, user: localStorage.getItem('sudokuUser') }));
            } else if (sudokuIsCompleted() && !sudokuIsRight()) {
                document.querySelector("#game-screen").classList.remove('active');
                document.querySelector("#error-screen").classList.add('active');
            }
        }
    }
    

    const checkRow = (row, num) => {
        for (let i = 0; i < 9; i++) {
            if (sudoku?.gridToBeFilled[row][i] === num) {
                return true;
            }
        }
        return false;
    }

    const checkColumn = (col, num) => {
        for (let i = 0; i < 9; i++) {
            if (sudoku?.gridToBeFilled[i][col] === num) {
                return true;
            }
        }
        return false;
    }

    const checkGrid = (row, col, num) => {
        const startRow = Math.floor(row / 3) * 3;
        const startCol = Math.floor(col / 3) * 3;
        for (let i = startRow; i < startRow + 3; i++) {
            for (let j = startCol; j < startCol + 3; j++) {
                if (sudoku?.gridToBeFilled[i][j] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    const sudokuIsCompleted = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudoku?.gridToBeFilled[i][j] == 0) return false;
            }
        }
        return true;
    }

    const sudokuIsRight = () => {
        for (let i = 0; i < 9; i++) {
            for (let j = 0; j < 9; j++) {
                if (sudoku?.gridToBeFilled[i][j] != sudoku?.grid[i][j]) return false;
            }
        }
        return true;
    }

    const handleKeyPress = (e) => {
        if (e.keyCode >= 49 && e.keyCode <= 57) {
            let number = e.keyCode - 48;
            UpdateSudokuGrid(number);
        } else if (e.keyCode === 8) {
            UpdateSudokuGrid(0);
        } else if (e.keyCode == 37) {
            if (selectedCellIdx % 9 != 0) setSelectedCellIdx((prev) => --prev);
        } else if (e.keyCode == 38) {
            if (selectedCellIdx > 8) setSelectedCellIdx((prev) => prev - 9);
        } else if (e.keyCode == 39) {
            if (selectedCellIdx % 9 != 8) setSelectedCellIdx((prev) => ++prev);
        } else if (e.keyCode == 40) {
            if (selectedCellIdx < 72) setSelectedCellIdx((prev) => prev + 9);
        }
    }

    useEffect(() => {
        window.addEventListener("keydown", handleKeyPress);
        return () => {
            window.removeEventListener("keydown", handleKeyPress);
        }
    }, [selectedCellIdx]);

    const keepTrying = () => {
        document.querySelector('#error-screen').classList.remove('active');
        document.querySelector('#game-screen').classList.add('active');
    }

    const newGame = () => {
        navigate('/');
    }

    const clearSudokuGrid = () => {
        const clearedGrid = sudoku.gridToBeFilled.map((row, i) =>
            row.map((number, j) =>
                sudoku.gridWithBlanks[i][j] === 0 ? 0 : number
            )
        );
        dispatch({ type: "SET_SUDOKU", data: { ...sudoku, gridToBeFilled: clearedGrid } });
        setTimer(0);
    };

    const [showHint, setShowHint] = useState(false);

    // Function to generate a question based on the value of the selected cell
    const generateHintQuestion = (answer) => {
        switch (answer) {
            case 1:
                alert( 'What is the first natural number?');
                break;
            case 2:
                alert( '_ x 3 = 6,what should be in the blank?');
                break;
            case 3:
                alert( 'What is the value of pi (π) rounded to two decimal places?');
                break;
            case 4:
                alert( 'How many chambers are there in the human heart?');
                break;
            case 5:
                alert( 'How many Olympic rings are there?');
                break;
            case 6:
                alert( 'How many faces does a cube have?');
                break;
            case 7:
                alert( 'How many continents are there on Earth?');
                break;
            case 8:
                alert( 'What is the difference between the largest and smallest numbers in a complete Sudoku grid?');
                break;
            case 9:
                alert( 'What is the highest single-digit number?');
                break;
            default:
                alert( 'How many sides does a triangle have?');
                break;
        }
    };

function getNumberForLocation(grid, x, y) {
    // Check if the given coordinates are within the grid's bounds
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
        alert( "Coordinates out of bounds");
        return 
    }
    
    
    // Check if the cell is already filled
    if (grid[x][y] !== 0) {
        alert("Cell already filled");
        return
    }
    
    // Check row, column, and 3x3 square to find possible numbers
    let possibleNumbers = [];
    let size = Math.sqrt(grid.length);
    let row = Math.floor(x / size) * size;
    let col = Math.floor(y / size) * size;
    
    for (let num = 1; num <= grid.length; num++) {
        let valid = true;
        // Check row
        for (let i = 0; i < grid.length; i++) {
            if (grid[x][i] === num) {
                valid = false;
                break;
            }
        }
        // Check column
        if (valid) {
            for (let i = 0; i < grid.length; i++) {
                if (grid[i][y] === num) {
                    valid = false;
                    break;
                }
            }
        }
        // Check 3x3 square
        if (valid) {
            for (let i = row; i < row + size; i++) {
                for (let j = col; j < col + size; j++) {
                    if (grid[i][j] === num) {
                        valid = false;
                        break;
                    }
                }
                if (!valid) {
                    break;
                }
            }
        }
        // If the number is valid, add it to the list of possible numbers
        if (valid) {
            possibleNumbers.push(num);
        }
    }
    
    return possibleNumbers;
}
const handleHintClick = () => {
    // Check if hint chances are available
    if (hintChances > 0) {
        const selectedRow = Math.floor(selectedCellIdx / 9);
        const selectedCol = selectedCellIdx % 9;
        const possibleNumbers = getNumberForLocation(sudoku.gridToBeFilled, selectedRow, selectedCol);

        if (possibleNumbers.length > 0) {
            const val = possibleNumbers.splice(",")[0];
            generateHintQuestion(val);
            // Decrement hint chances after using hint
            setHintChances(prevChances => prevChances - 1);
            return;
        } else {
            alert('No possible numbers for this cell.');
        }
    } else {
        alert('You have exhausted all hint chances.');
    }
};
function getNumberForLocation(grid, x, y) {
    // Check if the given coordinates are within the grid's bounds
    if (x < 0 || x >= grid.length || y < 0 || y >= grid[0].length) {
        alert("Coordinates out of bounds");
        return;
    }

    // Check if the cell is already filled
    if (grid[x][y] !== 0) {
        alert("Cell already filled");
        return;
    }

    // Check row, column, and 3x3 square to find possible numbers
    let possibleNumbers = [];
    let size = Math.sqrt(grid.length);
    let row = Math.floor(x / size) * size;
    let col = Math.floor(y / size) * size;

    for (let num = 1; num <= grid.length; num++) {
        let valid = true;
        // Check row
        for (let i = 0; i < grid.length; i++) {
            if (grid[x][i] === num) {
                valid = false;
                break;
            }
        }
        // Check column
        if (valid) {
            for (let i = 0; i < grid.length; i++) {
                if (grid[i][y] === num) {
                    valid = false;
                    break;
                }
            }
        }
        // Check 3x3 square
        if (valid) {
            for (let i = row; i < row + size; i++) {
                for (let j = col; j < col + size; j++) {
                    if (grid[i][j] === num) {
                        valid = false;
                        break;
                    }
                }
                if (!valid) {
                    break;
                }
            }
        }
        // If the number is valid, add it to the list of possible numbers
        if (valid) {
            possibleNumbers.push(num);
        }
    }

    return possibleNumbers;
}

    return (
        <>
            <Navbar />
            <div className='main'>
                <div className='screen'>
                    <div className="main-game active" id="game-screen">
                        <div className="game-mode">
                            Mode: {mode == "easy" ? <span className="easy-color-text">{mode}</span> : mode == "medium" ? <span className="medium-color-text">{mode}</span> : mode == "hard" ? <span className="hard-color-text">{mode}</span> : mode == "extreme" ? <span className="extreme-color-text">{mode}</span> : <></>}
                        </div>
                        <div className="timer">Timer: {formattedTime()}
                        <div className="mistake-count" id="mistake">
                            Mistakes: {mistakes}
                        </div></div>
                        <div className="main-sudoku-grid">
                            {sudoku?.gridToBeFilled?.map((elem, row) => (
                                elem.map((number, col) => (<div
                                    className={"main-grid-cell "
                                        .concat((row % 3 == 0) ? "border-top " : "")
                                        .concat((row % 3 == 2) ? "border-bottom " : "")
                                        .concat((col % 3 == 0) ? "border-left " : "")
                                        .concat((col % 3 == 2) ? "border-right " : "")
                                        .concat((row * 9 + col == selectedCellIdx) ? "selected " : "")
                                        .concat((number && sudoku?.gridWithBlanks[row][col] != 0) ? "given " : "")
                                        .concat((number && sudoku?.gridWithBlanks[row][col] == 0) ? "inserted " : "")
                                        .concat((row == Math.floor(selectedCellIdx / 9)) ? "highlighted " : "")
                                        .concat((col == selectedCellIdx % 9) ? "highlighted " : "")
                                        .concat(((Math.floor(row / 3) == Math.floor(Math.floor(selectedCellIdx / 9) / 3)) && (Math.floor(col / 3) == Math.floor((selectedCellIdx % 9) / 3))) ? "highlighted " : "")
                                    }
                                    key={row * 9 + col}
                                    onClick={() => handleSelected(row * 9 + col)}>{number ? number : ''}</div>))
                            ))}
                        </div>
                        <div className="numbers">
                            <div className="number" onClick={() => UpdateSudokuGrid(1)}>1</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(2)}>2</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(3)}>3</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(4)}>4</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(5)}>5</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(6)}>6</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(7)}>7</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(8)}>8</div>
                            <div className="number" onClick={() => UpdateSudokuGrid(9)}>9</div>
                            <div className="delete" id="btn-delete" onClick={() => UpdateSudokuGrid(0)}>Erase</div>
                            <div className='clear' onClick={clearSudokuGrid}>Reset</div>
                            <button onClick={handleHintClick } className='hint'>Hint</button>
                        </div>
                    </div>
                    <div className="result-screen" id="result-screen">
                        <div className="congrate">Sudoku Completed!</div>
                        <div className="btn btn-blue" onClick={() => newGame()}>New game</div>
                    </div>
                    <div className="error-screen" id="error-screen">
                        <div className="congrate">Your solution has some errors!</div>
                        <div className="btn btn-new-game" onClick={() => keepTrying()}>Keep trying</div>
                        <div className="btn btn-new-game" onClick={() => newGame()}>New game</div>
                    </div>
                </div>
            </div>
        </>
    );
}

const mapStateToProps = (state) => {
    let sudoku = state.sudoku;
    return {
        sudoku
    };
}

export default connect(mapStateToProps)(Game);
