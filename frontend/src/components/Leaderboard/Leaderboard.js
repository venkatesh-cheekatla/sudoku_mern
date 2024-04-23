import React, { useState } from "react";
import "./Leaderboard.css"
import Tab from 'react-bootstrap/Tab';
import Tabs from 'react-bootstrap/Tabs';

const Leaderboard = (props) => {

  return (
    <div className="leaderboardContainer">
        <Tabs
        defaultActiveKey="Scores"
        id="uncontrolled-tab-example"
        className="mb-3"
        >
            <Tab eventKey="Scores" title="Scores" tabClassName="tabHead">
                <table className="table">
                    <thead key={"thead"}>
                        <tr key={"head"}>
                            <th scope="col">Rank</th>
                            <th scope="col">Name</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody key={"tbody"}>
                        {props.Scores.map((ele, i) => {
                            return <tr key={i}>
                                <td>{i+1}</td>
                                <td>{ele.username}</td>
                                <td>{ele.Score}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </Tab>
            <Tab eventKey="Games" title="Games" tabClassName="tabHead">
            <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Name</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.Games.map((ele, i) => {
                            return <tr key={i}>
                                <td>{i+1}</td>
                                <td>{ele.username}</td>
                                <td>{ele.Games}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </Tab>
            <Tab eventKey="Times" title="Times" tabClassName="tabHead">
            <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Rank</th>
                            <th scope="col">Name</th>
                            <th scope="col">Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        {props.Times.map((ele, i) => {
                            return <tr key={i}>
                                <td>{i+1}</td>
                                <td>{ele.username}</td>
                                <td>{ele.Time}</td>
                            </tr>
                        })}
                    </tbody>
                </table>
            </Tab>
        </Tabs>



    </div>
  );
};

export default Leaderboard;
