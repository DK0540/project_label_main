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
// import React from "react";
// import { Link } from "react-scroll";
// import AnimatedCard from "./AnimatedCard";
// import img1 from "./images/bar2.jpg";
// const ImgCards = () => {
//   return (
//     <div className="imgcard">
//       <AnimatedCard imageSrc={img1} text="Hovered Text" />
//     </div>
//   );
// };

// export default ImgCards;
//============================================================================>>>ok2
// import React from "react";
// import { Link } from "react-scroll";
// import "./imgcards.css";

// const ImgCards = () => {
//   return (
//     <div>
//       <Link to="our-work" smooth={true} duration={500}>
// <div className="imgt">
//   <h1>Our work</h1>
// </div>
//         <div className="imggrid">
//           <div> a</div>
//           <div>b</div>
//           <div>c</div>
//           <div>d</div>
//           <div>e</div>
//           <div>f</div>
//         </div>
//       </Link>
//     </div>
//   );
// };

// export default ImgCards;
