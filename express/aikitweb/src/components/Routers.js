import React from "react";
import { BrowserRouter, Route,Routes } from "react-router-dom";
import ImageUpdate from "../routers/ImageUpdate"
import Loading from "../routers/Loading";
import MoveCar from "../routers/MoveCar";
import Machinelearning from "../routers/Machinelearning"


function Routers() {

    return (
        <BrowserRouter>
            <Routes>
                <Route exact path="/" element={<Loading />} />
                <Route exact path="/moveCar" element={<MoveCar />} />
                <Route exact path="/imageUpdate" element={<ImageUpdate />} />
                <Route exact path="/machinelearning" element={<Machinelearning />} />
            </Routes>
        </BrowserRouter>
    )
}

export default Routers;