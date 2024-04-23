import React from "react";

const IModal = () =>{
  return <div className="modal fade" id="InstructionsModal" tabIndex="-1" aria-labelledby="InstructionsModalLabel" aria-hidden="true">
    <div className="modal-dialog">
      <div className="modal-content">
        <div className="modal-header">
          <h1 className="modal-title fs-5" id="InstructionsModalLabel">Instructions</h1>
          <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div className="modal-body">
          <h3>How to play?</h3>
          Sudoku is played on a grid of 9 x 9 spaces. Within the rows and columns are 9 “squares” (made up of 3 x 3 spaces). Each row, column and square (9 spaces each) needs to be filled out with the numbers 1-9, without repeating any numbers within the row, column or square.
          <br></br>
          <br></br>
          <h3>Points System</h3>
          If the number of solutions of a given puzzle is 
          <br></br>
          =&gt; greater than 5 — points scored is 10.
          <br></br>
          =&gt; greater than equal to 2 and less than equal to 5 — points scored is 20.
          <br></br>
          =&gt; exactly 1— points scored is 30.
          <br></br>
          <br></br>
          <h3>File upload format</h3>
          Upload a txt file containing 81 comma separated integers between 1 to 9. Enter -1 for empty space.

        </div>
      </div>
    </div>
  </div>
}


export default IModal;