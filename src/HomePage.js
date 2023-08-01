import React from "react";
import { Link } from "react-router-dom";
import "./HomePage2.css";
import Footer from "./components/Footer";
import ImageGallery from "./components/ImageGallery";
import ServicesPage from "./components/ServicesPage";
import Header from "./Header";

const HomePage = () => {
  return (
    <div className="homea">
      <Header />
      <div className="container">
        <Link to="/app">
          <button className="button">Click Me</button>
        </Link>
      </div>
      <ServicesPage />
      <ImageGallery />
      <Footer />
    </div>
  );
};

export default HomePage;
//===================================================================>>>Last update
// import React from "react";
// import { Link } from "react-router-dom";
// import "./HomePage2.css";
// import Footer from "./components/Footer";
// import ImageGallery from "./components/ImageGallery";
// import ServicesPage from "./components/ServicesPage";

// const HomePage = () => {
//   return (
//     <div className="homea">
//       <header className="header">
//         <div className="left-logo">
//           <h2>Label360</h2>
//         </div>
//         <nav className="right-nav">
//           <ul>
//             <li>
//               <a href="/">Home</a>
//             </li>
//             <li>
//               <a href="/about">About</a>
//             </li>
//             <li>
//               <a href="/contact">Contact</a>
//             </li>
//             <li>
//               <a href="/services">Services</a>
//             </li>
//           </ul>
//         </nav>
//       </header>
//       <div className="container">
//         <Link to="/app">
//           <button className="button">Click Me</button>
//         </Link>
//       </div>
//       <div className="homeb">main</div>
//       <ServicesPage />
//       <ImageGallery />
//       <Footer />
//     </div>
//   );
// };

// export default HomePage;

//===================================================================>>>>>Original
// import React from "react";
// import { Link } from "react-router-dom";
// import "./homepage.css";

// const HomePage = () => {
//   return (
//     <div>
//       <h1>Welcome to the Home Page</h1>
// <Link to="/app">
//   <button className="button-3">Create Label Button</button>
// </Link>
//     </div>
//   );
// };

// export default HomePage;
