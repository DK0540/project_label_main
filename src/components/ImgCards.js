import React from "react";
import { Link } from "react-scroll";
import "./imgcards.css";

import CardGrid from "./CardGrid";
const ImgCards = () => {
  return (
    <Link to="our-work" smooth={true} duration={500}>
      <div className="cardtitle">
        <h1 className="card-head">Our Work</h1>
        <CardGrid />
      </div>
    </Link>
  );
};

export default ImgCards;
//===============================================================>>ok2



