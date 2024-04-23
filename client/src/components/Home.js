import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import Navbar from './Navbar/Navbar';
import '../css/index.css';

const Home = () => {
    const navigate = useNavigate();

    const modes = ["easy", "medium", "hard", "extreme"];
    const modeColors = [
        "rgb(0, 174, 239)", // easy
        "rgb(255, 200, 0)", // medium
        "red", //hard
        "black" //extreme
    ];

    const [mode, setMode] = useState(0);

    let resumeMode = JSON.parse(sessionStorage.getItem('currentSudoku'))?.mode;

    const changeMode = () => {
        setMode((prev) => ((prev + 1) % modes.length));
    };

    const handleResumeButton = () => {
        navigate('/game?mode=' + resumeMode);
    };

    const handlePlayButton = () => {
        sessionStorage.removeItem('currentSudoku');
        navigate('/game?mode=' + modes[mode]);
    };

    const HowToPlay = () => {
        const [isDropdownOpen, setIsDropdownOpen] = useState(false);

        const toggleDropdown = () => {
            setIsDropdownOpen(prevState => !prevState);
        };

        return (
            <div>
                <h2 className="head" onClick={toggleDropdown}>HOW TO PLAY?</h2>
                {isDropdownOpen && (
                   <div className="how-to-play-container">
                   <div className="how-to-play-text">
                       <p>A Sudoku puzzle begins with a grid where some numbers are already placed, depending on the difficulty level. The goal is to complete the grid so that each row, column, and 3x3 block contains each number from 1 to 9 exactly once. To play, select a cell and tap a number to fill it in. You can use the clear button to erase a number from a cell. The reset button clears all user inputs, returning the puzzle to its original state. If you need help, you can use the hint option. It provides a quiz question related to the cell, the answer to the question is the number you should put in that cell.</p>
                   </div>
               </div>
               
                )}
            </div>
        );
    };

    return (
        <>
            <Navbar />
            <div className="main">
                <div className="screen">
                    <div className="center-view active">
                        <div className="btn" style={{ backgroundColor: modeColors[mode] }} id="btn-level" onClick={changeMode}>
                            Mode: {modes[mode]}
                        </div>
                        <div className="btn" style={{ backgroundColor: modeColors[mode] }} id="btn-play" onClick={handlePlayButton}>Play!</div>
                        {
                            sessionStorage.getItem('currentSudoku') ? (
                                <div className="btn" id="btn-play" onClick={handleResumeButton}>{'Resume (' + resumeMode + ')'}</div>
                            ) : (
                                <></>
                            )
                        }
                        <HowToPlay />
                    </div>
                </div>
            </div>
        </>
    );
};

export default Home;
