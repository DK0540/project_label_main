import React, { useState } from "react";
import "./AnimatedCard.css";

const AnimatedCard = ({ imageSrc, text }) => {
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  return (
    <div
      className={`card ${isHovered ? "hovered" : ""}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="image-container">
        <img
          src={imageSrc}
          alt="Card"
          className={`card-image ${isHovered ? "zoomed" : ""}`}
        />
      </div>
      {isHovered && (
        <div className="overlay">
          <p className="overlay-text">{text}</p>
        </div>
      )}
    </div>
  );
};

export default AnimatedCard;

// import React, { useState } from "react";
// import "./AnimatedCard.css"; // Create this CSS file for styling

// const AnimatedCard = ({ imageSrc, text }) => {
//   const [isHovered, setIsHovered] = useState(false);

//   const handleMouseEnter = () => {
//     setIsHovered(true);
//   };

//   const handleMouseLeave = () => {
//     setIsHovered(false);
//   };

//   return (
//     <div
//       className={`card ${isHovered ? "hovered" : ""}`}
//       onMouseEnter={handleMouseEnter}
//       onMouseLeave={handleMouseLeave}
//     >
//       <img src={imageSrc} alt="Card" className="card-image" />
//       {isHovered && (
//         <div className="overlay">
//           <p className="overlay-text">{text}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default AnimatedCard;
