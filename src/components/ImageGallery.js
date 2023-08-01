import React from "react";
import image1 from "./images/bar2.jpg";
import image2 from "./images/bar3.jpg";
import image3 from "./images/bar4.png";
import image4 from "./images/bar5.jpg";
import image5 from "./images/bar6.png";
import image6 from "./images/bar7.png";
import "./ImageGallery.css";

const ImageGallery = () => {
  // Replace these URLs with the actual image URLs you want to showcase
  const imageUrls = [image1, image2, image3, image4, image5, image6];

  // const imageUrls = imageFilenames.map((filename) => `/images/${filename}`);

  return (
    <>
      <div className="work">
        <h2>Our works</h2>
      </div>
      <div className="imgback">
        <div style={galleryStyle}>
          {imageUrls.map((imageUrl, index) => (
            <div key={index} style={imageContainerStyle}>
              <img
                src={imageUrl}
                alt={`Image ${index + 1}`}
                style={imageStyle}
              />
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const galleryStyle = {
  display: "grid",
  gridTemplateColumns: "repeat(3, 1fr)",
  gap: "10px",
  width: "100%", // Set the grid width to 100% of its parent container
  maxWidth: "800px", // You can adjust the max width as needed
  margin: "6px",
};

const imageContainerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const imageStyle = {
  width: "380px",
  height: "283px",
  backgroundColor: "red",
  margin: "10px",
};

export default ImageGallery;

// import React from "react";

// const ImageGallery = () => {
//   // Replace these URLs with the actual image URLs you want to showcase
//   const imageUrls = [
//     "https://5.imimg.com/data5/SELLER/Default/2021/3/YK/MF/AY/44434785/printed-mrp-barcode-label-500x500.jpg",
//     "https://media.istockphoto.com/id/1329146072/vector/shipping-label-barcode-template-vector.jpg?s=612x612&w=0&k=20&c=3PG2-APP6wBnqaVBT_QlAgPTsRIjH-ISdD6EZ2lBi5s=",
//     "https://cdn2.vectorstock.com/i/1000x1000/23/96/shipping-barcode-label-vector-11602396.jpg",
//     "https://5.imimg.com/data5/SELLER/Default/2021/1/BZ/JV/FW/4323755/barcode-label-500x500.jpg",
//     "https://x6t6s6a2.rocketcdn.me/wp-content/uploads/2018/10/Amazon-shipping-label.png",
//     "https://docs.developer.amazonservices.com/en_UK/fba_guide/ShippingLabel.png",
//   ];

//   return (
//     <>
// <div className="work">
//   <h2>Our works</h2>
// </div>
//       <div style={galleryStyle}>
//         {imageUrls.map((imageUrl, index) => (
//           <div key={index} style={imageContainerStyle}>
//             <img src={imageUrl} alt={`Image ${index + 1}`} style={imageStyle} />
//           </div>
//         ))}
//       </div>
//     </>
//   );
// };

// const galleryStyle = {
//   display: "grid",
//   gridTemplateColumns: "repeat(3, 1fr)",
//   gap: "10px",
//   width: "100%", // Set the grid width to 100% of its parent container
//   maxWidth: "800px", // You can adjust the max width as needed
//   margin: "6px",
// };

// const imageContainerStyle = {
//   display: "flex",
//   justifyContent: "center",
//   alignItems: "center",
// };

// const imageStyle = {
//   width: "420px",
//   height: "332px",
// };

// export default ImageGallery;
