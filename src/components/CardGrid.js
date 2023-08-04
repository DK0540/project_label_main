import React from "react";
import AnimatedCard from "./AnimatedCard";
import img1 from "./images/bar2.jpg";
import img2 from "./images/bar3.jpg";
import img3 from "./images/bar4.png";
import img4 from "./images/bar5.jpg";
import img5 from "./images/bar6.png";
import img6 from "./images/bar7.png";
import "./CardGrid.css";

const cardData = [
  {
    id: 1,
    imageSrc: img1,
    text: "Sample One",
  },
  {
    id: 2,
    imageSrc: img2,
    text: "Sample two",
  },
  {
    id: 3,
    imageSrc: img3,
    text: "Sample three",
  },
  {
    id: 4,
    imageSrc: img4,
    text: "Sample foure",
  },
  {
    id: 5,
    imageSrc: img5,
    text: "Sample five",
  },
  {
    id: 6,
    imageSrc: img6,
    text: "Sample six",
  },
  // Add more card data as needed
];

const CardGrid = () => {
  return (
    <div className="card-grid">
      {cardData.map((card) => (
        <AnimatedCard key={card.id} imageSrc={card.imageSrc} text={card.text} />
      ))}
    </div>
  );
};

export default CardGrid;
