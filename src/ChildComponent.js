import React, { useState, useEffect, useRef, useCallback } from "react";
import grapesjs from "grapesjs";
import plugin from "grapesjs-preset-newsletter";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
import axios from "axios";
import { useDropzone } from "react-dropzone";
import cheerio from "cheerio";
import { HtmlToReact } from "html-to-react";
import "./childcomponent.css";

const ChildComponent = ({ htmlCode }) => {
  const [editor, setEditor] = useState(null);
  const [showEditor, setShowEditor] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
  const designContainerRef = useRef(null);
  const captureContainerRef = useRef(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [imageDataUrl, setImageDataUrl] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [extractedData, setExtractedData] = useState({}); 

 


  // ... (rest of the code remains the same)
  useEffect(() => {
    const initializeEditor = () => {
      const editor = grapesjs.init({
        container: "#gjs",
        plugins: [plugin],
        pluginsOpts: {
          [plugin]: {
            /* options */
          },
        },
        storageManager: false,
      });

      setEditor(editor);
    };

    initializeEditor();
  }, []);

  useEffect(() => {
    if (editor) {
      editor.setComponents(updatedHtmlCode);
    }
  }, [editor, updatedHtmlCode]);

  const handleEdit = () => {
    setShowEditor(true);
  };




  const handleSave = () => {
    const updatedHtmlCode = editor.getHtml();
    console.log("Updated HTML code:", updatedHtmlCode);
    setUpdatedHtmlCode(updatedHtmlCode);
    const blob = new Blob([updatedHtmlCode], { type: "text/html" });
    saveAs(blob, "design.html");
  };

  const handleImageUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await axios.post(
        "http://localhost:5500/upload-image",
        formData
      );
      const imageUrl = response.data.imageUrl;
      console.log("Image URL:", imageUrl);

      setImageDataUrl(imageUrl);
    } catch (error) {
      console.error("Error uploading image:", error);
      // Handle error here
    }
  };

  //send for review function
  const onDrop = useCallback((acceptedFiles) => {
    setImageFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ onDrop });

  const handleSendForReview = () => {
    captureImage();
    setShowForm(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();

    if (imageFile) {
      handleImageUpload(imageFile);
    } else {
      submitFormData();
    }
  };

  const submitFormData = () => {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("message", message);
    formData.append("image", imageDataUrl);

    axios
      .post("http://localhost:5500/send-email", formData)
      .then((response) => {
        console.log(response.data);
        setName("");
        setEmail("");
        setMessage("");
        setImageDataUrl(null);
        setShowForm(false);
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        // Handle error here
      });
  };

  const captureImage = () => {
    domtoimage
      .toJpeg(captureContainerRef.current)
      .then(function (dataUrl) {
        setImageDataUrl(dataUrl);
      })
      .catch(function (error) {
        console.error("Error capturing the image:", error);
      });
  };


  const extractDataFromHTML = () => {
    try {
      const $ = cheerio.load(updatedHtmlCode);

      // Extract the text content from the element with the class "data-container-text"
      const textElements = $(".data-container-text");
      const extractedText =
        textElements.length > 0
          ? textElements
              .map((index, element) => $(element).text().trim())
              .get()
              .join("\n")
          : "No text data found";

      // Extract image URLs from elements with class "data-container-image"
      const imageElements = $(".data-container-image");
      const extractedImages =
        imageElements.length > 0
          ? imageElements.map((index, element) => $(element).attr("src")).get()
          : [];

      // Combine extracted data into a single object
      const extractedData = {
        text: extractedText,
        images: extractedImages,
      };

      setExtractedData(extractedData);
    } catch (error) {
      console.error("Error extracting data:", error);
      // Handle the error here if necessary
      setExtractedData({
        text: "Error extracting text data",
        images: [],
      });
    }
  };

  return (
    <div className="cmain">
    <nav className="cnav">
    <h2 className="ctitle">Saved Templates</h2>
  </nav>
  <div className="capture-container" ref={captureContainerRef}>
    <div
      id="design-container"
      ref={designContainerRef}
      dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
    ></div>
  </div>
  <div className="cbtns">
    {!showEditor && (
      <div className="fixed-buttons">
        <button className="csend" onClick={handleSendForReview}>
          Send for Review
        </button>
        <button className="csave" onClick={handleSave}>
          Save
        </button>
      </div>
    )}
  </div>
  <div>
    {!showEditor ? (
      <button className="cbtntwo" onClick={handleEdit}>
        Edit
      </button>
    ) : (
      <div>
        <button onClick={() => setShowEditor(false)}>Done</button>
        <button onClick={handleSave}>Save</button>
      </div>
    )}
  </div>
  <button onClick={extractDataFromHTML}>Show Data</button>
  {extractedData && extractedData.text && (
    <div className="data-card">
      <h3>Extracted Text:</h3>
      <p>{extractedData.text}</p>
    </div>
  )}
  {extractedData && extractedData.images && extractedData.images.length > 0 && (
    <div className="data-card">
      <h3>Extracted Images:</h3>
      {extractedData.images.map((imageUrl, index) => (
        <img key={index} src={imageUrl} alt={`Image ${index + 1}`} />
      ))}
    </div>
  )}  
  {showEditor && <div id="gjs"></div>}
  {showForm && (
    <div className="form-popup">
      <form onSubmit={handleFormSubmit}>
        <h3>Send HTML Code for Review</h3>
        <label>Name:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label>Message:</label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        ></textarea>
        <div {...getRootProps()} className="dropzone">
          <input {...getInputProps()} />
          <p>Drag 'n' drop an image here, or click to select an image</p>
        </div>
        {imageDataUrl && (
          <div className="image-preview">
            <h4>Design Preview:</h4>
            <img src={imageDataUrl} alt="Design Preview" />
            <p>Text (HTML)</p>
          </div>
        )}
        <button type="submit">Send</button>
        <button
          type="button"
          className="cancel-button"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
      </form>
    
    </div>
  )}
    
   
    </div>
  );
};

export default ChildComponent;



// import React, { useState, useEffect, useRef, useCallback } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [extractedData, setExtractedData] = useState(null); 

//   const extractDataFromHTML = () => {
//     try {
//       // Create a temporary DOM element to hold the HTML code
//       const tempElement = document.createElement("div");
//       tempElement.innerHTML = updatedHtmlCode;

//       // Extract text content
//       const textContainerElements = tempElement.querySelectorAll(".data-container-text");
//       const extractedText = Array.from(textContainerElements).map((el) => el.innerText.trim()).join("\n");

//       // Extract images
//       const imageContainerElements = tempElement.querySelectorAll(".data-container-image");
//       const extractedImages = Array.from(imageContainerElements).map((el) => el.getAttribute("src"));

//       // Combine text and images into a single data object
//       const extractedData = {
//         text: extractedText,
//         images: extractedImages,
//       };

//       setExtractedData(extractedData);
//     } catch (error) {
//       console.error("Error extracting data:", error);
//       // Handle the error here if necessary
//       setExtractedData("Error extracting data");
//     }
//   };
  // useEffect(() => {
  //   const initializeEditor = () => {
  //     const editor = grapesjs.init({
  //       container: "#gjs",
  //       plugins: [plugin],
  //       pluginsOpts: {
  //         [plugin]: {
  //           /* options */
  //         },
  //       },
  //       storageManager: false,
  //     });

  //     setEditor(editor);
  //   };

  //   initializeEditor();
  // }, []);

  // useEffect(() => {
  //   if (editor) {
  //     editor.setComponents(updatedHtmlCode);
  //   }
  // }, [editor, updatedHtmlCode]);

  // const handleEdit = () => {
  //   setShowEditor(true);
  // };

  // const handleSave = () => {
  //   const updatedHtmlCode = editor.getHtml();
  //   console.log("Updated HTML code:", updatedHtmlCode);
  //   setUpdatedHtmlCode(updatedHtmlCode);
  //   const blob = new Blob([updatedHtmlCode], { type: "text/html" });
  //   saveAs(blob, "design.html");
  // };

  // const handleImageUpload = async (file) => {
  //   try {
  //     const formData = new FormData();
  //     formData.append("image", file);

  //     const response = await axios.post(
  //       "http://localhost:5500/upload-image",
  //       formData
  //     );
  //     const imageUrl = response.data.imageUrl;
  //     console.log("Image URL:", imageUrl);

  //     setImageDataUrl(imageUrl);
  //   } catch (error) {
  //     console.error("Error uploading image:", error);
  //     // Handle error here
  //   }
  // };

  // //send for review function
  // const onDrop = useCallback((acceptedFiles) => {
  //   setImageFile(acceptedFiles[0]);
  // }, []);

  // const { getRootProps, getInputProps } = useDropzone({ onDrop });

  // const handleSendForReview = () => {
  //   captureImage();
  //   setShowForm(true);
  // };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();

  //   if (imageFile) {
  //     handleImageUpload(imageFile);
  //   } else {
  //     submitFormData();
  //   }
  // };

  // const submitFormData = () => {
  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  //   formData.append("message", message);
  //   formData.append("image", imageDataUrl);

  //   axios
  //     .post("http://localhost:5500/send-email", formData)
  //     .then((response) => {
  //       console.log(response.data);
  //       setName("");
  //       setEmail("");
  //       setMessage("");
  //       setImageDataUrl(null);
  //       setShowForm(false);
  //     })
  //     .catch((error) => {
  //       console.error("Error sending email:", error);
  //       // Handle error here
  //     });
  // };

  // const captureImage = () => {
  //   domtoimage
  //     .toJpeg(captureContainerRef.current)
  //     .then(function (dataUrl) {
  //       setImageDataUrl(dataUrl);
  //     })
  //     .catch(function (error) {
  //       console.error("Error capturing the image:", error);
  //     });
  // };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       <button onClick={extractDataFromHTML}>Show Data</button>
//       {extractedData && (
//         <div className="data-card">
//           <h3>Extracted Data:</h3>
//           <p>{extractedData}</p>
//         </div>
//       )}
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             <div {...getRootProps()} className="dropzone">
//               <input {...getInputProps()} />
//               <p>Drag 'n' drop an image here, or click to select an image</p>
//             </div>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [generatedTemplateHTML, setGeneratedTemplateHTML] = useState("");
//   const [showGeneratedTemplate, setShowGeneratedTemplate] = useState(false);
//   const [extractedTextData, setExtractedTextData] = useState([]); // New state variable for extracted text data
//   const [extractedImageData, setExtractedImageData] = useState([]); // New state variable for extracted image data

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleImageUpload = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await axios.post(
//         "http://localhost:5500/upload-image",
//         formData
//       );
//       const imageUrl = response.data.imageUrl;
//       console.log("Image URL:", imageUrl);

//       setImageDataUrl(imageUrl);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       // Handle error here
//     }
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     setImageFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     if (imageFile) {
//       handleImageUpload(imageFile);
//     } else {
//       submitFormData();
//     }
//   };

//   const submitFormData = () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     axios
//       .post("http://localhost:5500/send-email", formData)
//       .then((response) => {
//         console.log(response.data);
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false);
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   // Function to extract text and image data from the user-entered HTML code
//  useEffect(() => {
//     const extractedData = extractTextAndImageData(updatedHtmlCode);
//     setExtractedTextData(extractedData.textData);
//     setExtractedImageData(extractedData.imageData);
//   }, [updatedHtmlCode]);

//   const extractTextAndImageData = (htmlCode) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlCode, "text/html");

//     const textSet = new Set(); // Use a Set to store unique text data
//     const imageData = [];

//     const processElement = (element) => {
//       const tagName = element.tagName.toLowerCase();
//       if (
//         [
//           "h1",
//           "h2",
//           "h3",
//           "p",
//           "span",
//           "div",
//           "label",
//           "a",
//           "td",
//           "th",
//         ].includes(tagName)
//       ) {
//         if (element.textContent) {
//           const textContent = element.textContent.trim();
//           if (textContent) {
//             textSet.add(textContent); // Store unique text data in the Set
//           }
//         }
//       } else if (tagName === "img") {
//         const src = element.src;
//         if (src) {
//           imageData.push(src);
//         }
//       }

//       // Process child elements
//       for (let i = 0; i < element.children.length; i++) {
//         processElement(element.children[i]);
//       }
//     };

//     processElement(doc.body);

//     // Convert the Set back to an array
//     const textData = Array.from(textSet);

//     return { textData, imageData };
//   };

//   // Function to generate a new template HTML based on the extracted data
//  const generateNewTemplateHTML = () => {
//     // Modify this section based on how you want to structure the new template
//     let newHTMLCode = "<div>";

//     // Add extracted text data
//     extractedTextData.forEach((text) => {
//       newHTMLCode += `<p>${text}</p>`;
//     });

//     // Add extracted image data
//     extractedImageData.forEach((src) => {
//       newHTMLCode += `<img src="${src}" alt="Image">`;
//     });

//     newHTMLCode += "</div>";
//     return newHTMLCode;
//   };

//   const handleCreateNewTemplate = () => {

//      const extractedData = extractTextAndImageData(updatedHtmlCode);
//     setExtractedTextData(extractedData.textData);
//     setExtractedImageData(extractedData.imageData);
//     // Generate a new HTML code based on the extracted data
//      const newTemplateHTML = generateNewTemplateHTML();

//     // Set the generated HTML code in the state
//     setGeneratedTemplateHTML(newTemplateHTML);
//     setShowGeneratedTemplate(true); // Show the generated template

//     // ... The rest of the code ...
//   };

//   return (
//     <div className="cmain">
//       {/* ... (previous code) ... */}
//             <nav className="cnav">
//       <h2 className="ctitle">Saved Templates</h2>
//     </nav>
//     <div className="capture-container" ref={captureContainerRef}>
//       <div
//         id="design-container"
//         ref={designContainerRef}
//         dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//       ></div>
//     </div>
//     <div className="cbtns">
//       {!showEditor && (
//         <div className="fixed-buttons">
//           <button className="csend" onClick={handleSendForReview}>
//             Send for Review
//           </button>
//           <button className="csave" onClick={handleSave}>
//             Save
//           </button>
//         </div>
//       )}
//     </div>
//     <div>
//       {!showEditor ? (
//         <button className="cbtntwo" onClick={handleEdit}>
//           Edit
//         </button>
//       ) : (
//         <div>
//           <button onClick={() => setShowEditor(false)}>Done</button>
//           <button onClick={handleSave}>Save</button>
//         </div>
//       )}
//     </div>
//     {showEditor && <div id="gjs"></div>}
//     {showForm && (
//       <div className="form-popup">
//         <form onSubmit={handleFormSubmit}>
//           <h3>Send HTML Code for Review</h3>
//           <label>Name:</label>
//           <input
//             type="text"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//           />
//           <label>Email:</label>
//           <input
//             type="email"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//           />
//           <label>Message:</label>
//           <textarea
//             value={message}
//             onChange={(e) => setMessage(e.target.value)}
//           ></textarea>
//           <div {...getRootProps()} className="dropzone">
//             <input {...getInputProps()} />
//             <p>Drag 'n' drop an image here, or click to select an image</p>
//           </div>
//           {imageDataUrl && (
//             <div className="image-preview">
//               <h4>Design Preview:</h4>
//               <img src={imageDataUrl} alt="Design Preview" />
//               <p>Text (HTML)</p>
//             </div>
//           )}
//           <button type="submit">Send</button>
//           <button
//             type="button"
//             className="cancel-button"
//             onClick={() => setShowForm(false)}
//           >
//             Cancel
//           </button>
//         </form>
//       </div>
//     )}
//     {/* "View Template" button to display the generated new template */}
//     {!showGeneratedTemplate && (
//       <button className="view-template-btn" onClick={handleCreateNewTemplate}>
//         View Template
//       </button>
//     )}
//       {/* "View Template" button to display the generated new template */}
//       {!showGeneratedTemplate && (
//         <button className="view-template-btn" onClick={handleCreateNewTemplate}>
//           View Template
//         </button>
//       )}

//       {/* Display the extracted text and image data from the user-entered HTML code */}
//       {showGeneratedTemplate && (
//         <div>
//           <h3>Extracted Text Data from User-Entered HTML:</h3>
//           <ul>
//             {extractedTextData.map((text, index) => (
//               <li key={index}>{text}</li>
//             ))}
//           </ul>
//           <h3>Extracted Image Data from User-Entered HTML:</h3>
//           <ul>
//             {extractedImageData.map((src, index) => (
//               <li key={index}>
//                 <img src={src} alt={`Image ${index + 1}`} />
//               </li>
//             ))}
//           </ul>
//         </div>
//       )}

//       {/* Display the generated new template inside the child component */}
//       {showGeneratedTemplate && (
//         <div className="card">
//           <h3>Generated New Template:</h3>
//           <div dangerouslySetInnerHTML={{ __html: generatedTemplateHTML }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//------------------------------------------------------------------------------->>>>>>>>>>>>>>>>

/////////////////////////////////////////////////////////////////////////////getting templateI⬇️
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [generatedTemplateHTML, setGeneratedTemplateHTML] = useState("");
//   const [showGeneratedTemplate, setShowGeneratedTemplate] = useState(false); // New state variable
//   const [extractedData, setExtractedData] = useState(null); // New state variable for extracted data

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleImageUpload = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await axios.post(
//         "http://localhost:5500/upload-image",
//         formData
//       );
//       const imageUrl = response.data.imageUrl;
//       console.log("Image URL:", imageUrl);

//       setImageDataUrl(imageUrl);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       // Handle error here
//     }
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     setImageFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     if (imageFile) {
//       handleImageUpload(imageFile);
//     } else {
//       submitFormData();
//     }
//   };

//   const submitFormData = () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     axios
//       .post("http://localhost:5500/send-email", formData)
//       .then((response) => {
//         console.log(response.data);
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false);
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   // Function to extract all data from the HTML code
//   useEffect(() => {
//     const extractedData = extractAllDataFromHTML(htmlCode);
//     setExtractedData(extractedData);
//   }, [htmlCode]);

//   // Function to extract all data from the HTML code
//   const extractAllDataFromHTML = (htmlCode) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlCode, "text/html");

//     // Extract the relevant data from the DOM
//     // Modify this section based on your specific data extraction requirements
//     const extractedData = {
//       title: doc.querySelector("title")?.textContent || "",
//       paragraphs: Array.from(doc.querySelectorAll("p")).map((p) => p.textContent),
//       images: Array.from(doc.querySelectorAll("img")).map((img) => img.src),
//       // Add other extracted data properties here...
//     };

//     return extractedData;
//   };

//   // Function to generate a new template HTML based on the extracted data
//   const generateNewTemplateHTML = (data) => {
//     // Modify this section based on how you want to structure the new template
//     const newHTMLCode = `
//       <div>
//         <h1>${data.title}</h1>
//         <div>
//           ${data.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
//         </div>
//         <!-- Add images to the new template -->
//         ${data.images.map((imgSrc) => `<img src="${imgSrc}" alt="Image">`).join("")}
//         <!-- Add more elements based on data as needed... -->
//       </div>
//     `;
//     return newHTMLCode;
//   };

//   const handleCreateNewTemplate = () => {
//     // Generate a new HTML code based on the extracted data
//     const newTemplateHTML = generateNewTemplateHTML(extractedData);

//     // Set the generated HTML code in the state
//     setGeneratedTemplateHTML(newTemplateHTML);
//     setShowGeneratedTemplate(true); // Show the generated template

//     // ... The rest of the code ...
//   };

//   return (
//     <div className="cmain">
//       {/* ... All the existing JSX ... */}
// <nav className="cnav">
//   <h2 className="ctitle">Saved Templates</h2>
// </nav>
// <div className="capture-container" ref={captureContainerRef}>
//   <div
//     id="design-container"
//     ref={designContainerRef}
//     dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//   ></div>
// </div>
// <div className="cbtns">
//   {!showEditor && (
//     <div className="fixed-buttons">
//       <button className="csend" onClick={handleSendForReview}>
//         Send for Review
//       </button>
//       <button className="csave" onClick={handleSave}>
//         Save
//       </button>
//     </div>
//   )}
// </div>
// <div>
//   {!showEditor ? (
//     <button className="cbtntwo" onClick={handleEdit}>
//       Edit
//     </button>
//   ) : (
//     <div>
//       <button onClick={() => setShowEditor(false)}>Done</button>
//       <button onClick={handleSave}>Save</button>
//     </div>
//   )}
// </div>
// {showEditor && <div id="gjs"></div>}
// {showForm && (
//   <div className="form-popup">
//     <form onSubmit={handleFormSubmit}>
//       <h3>Send HTML Code for Review</h3>
//       <label>Name:</label>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <label>Email:</label>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <label>Message:</label>
//       <textarea
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       ></textarea>
//       <div {...getRootProps()} className="dropzone">
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop an image here, or click to select an image</p>
//       </div>
//       {imageDataUrl && (
//         <div className="image-preview">
//           <h4>Design Preview:</h4>
//           <img src={imageDataUrl} alt="Design Preview" />
//           <p>Text (HTML)</p>
//         </div>
//       )}
//       <button type="submit">Send</button>
//       <button
//         type="button"
//         className="cancel-button"
//         onClick={() => setShowForm(false)}
//       >
//         Cancel
//       </button>
//     </form>
//   </div>
// )}

//       {/* "View Template" button to display the generated new template */}
//       {!showGeneratedTemplate && (
//         <button className="view-template-btn" onClick={handleCreateNewTemplate}>
//           View Template
//         </button>
//       )}

//       {/* Display the extracted data from the original HTML code */}
//       {showGeneratedTemplate && (
//         <div>
//           <h3>Extracted Data from Original HTML:</h3>
//           <div>
//             <h4>Title:</h4>
//             <p>{extractedData.title}</p>
//           </div>
//           <div>
//             <h4>Paragraphs:</h4>
//             {extractedData.paragraphs.map((paragraph, index) => (
//               <p key={index}>{paragraph}</p>
//             ))}
//           </div>
//           <div>
//             <h4>Images:</h4>
//             {extractedData.images.map((imageSrc, index) => (
//               <img key={index} src={imageSrc} alt={`Image ${index + 1}`} />
//             ))}
//           </div>
//         </div>
//       )}

//       {/* Display the generated new template inside the child component */}
//       {showGeneratedTemplate && (
//         <div className="card">
//           <h3>Generated New Template:</h3>
//           <div dangerouslySetInnerHTML={{ __html: generatedTemplateHTML }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;
/////////////////////////////////////////////////////////////////////////////getting template

// import React, { useState, useEffect, useRef, useCallback } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);
//   const [imageFile, setImageFile] = useState(null);
//   const [generatedTemplateHTML, setGeneratedTemplateHTML] = useState("");
//   const [showGeneratedTemplate, setShowGeneratedTemplate] = useState(false); // New state variable

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleImageUpload = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await axios.post(
//         "http://localhost:5500/upload-image",
//         formData
//       );
//       const imageUrl = response.data.imageUrl;
//       console.log("Image URL:", imageUrl);

//       setImageDataUrl(imageUrl);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       // Handle error here
//     }
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     setImageFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     if (imageFile) {
//       handleImageUpload(imageFile);
//     } else {
//       submitFormData();
//     }
//   };

//   const submitFormData = () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     axios
//       .post("http://localhost:5500/send-email", formData)
//       .then((response) => {
//         console.log(response.data);
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false);
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   // Function to extract data from the HTML code
//   const extractDataFromHTML = (htmlCode) => {
//     const parser = new DOMParser();
//     const doc = parser.parseFromString(htmlCode, "text/html");

//     // Extract the relevant data from the DOM
//     // Modify this section based on your specific data extraction requirements
//     const title = doc.querySelector("title")?.textContent || "";
//     const paragraphs = Array.from(doc.querySelectorAll("p")).map((p) => p.textContent);

//     return {
//       title,
//       paragraphs,
//       // Add other extracted data properties here...
//     };
//   };

//   // Function to generate a new template HTML based on the extracted data
//   const generateNewTemplateHTML = (data) => {
//     // Modify this section based on how you want to structure the new template
//     const newHTMLCode = `
//       <div>
//         <h1>${data.title}</h1>
//         <div>
//           ${data.paragraphs.map((paragraph) => `<p>${paragraph}</p>`).join("")}
//         </div>
//         <!-- Add more elements based on data as needed... -->
//       </div>
//     `;
//     return newHTMLCode;
//   };

//   const handleCreateNewTemplate = () => {
//     // Extract data from the existing HTML code
//     const extractedData = extractDataFromHTML(htmlCode);

//     // Generate a new HTML code based on the extracted data
//     const newTemplateHTML = generateNewTemplateHTML(extractedData);

//     // Set the generated HTML code in the state
//     setGeneratedTemplateHTML(newTemplateHTML);
//     setShowGeneratedTemplate(true); // Show the generated template

//     // Here, you can use the newTemplateHTML in any way you desire.
//     // For example, you can set it in the editor to allow further modifications or display it separately.

//     // Example: Set the new HTML code in the editor to allow further editing
//     if (editor) {
//       editor.setComponents(newTemplateHTML);
//     }
//   };

//   return (
//     <div className="cmain">
// <nav className="cnav">
//   <h2 className="ctitle">Saved Templates</h2>
// </nav>
// <div className="capture-container" ref={captureContainerRef}>
//   <div
//     id="design-container"
//     ref={designContainerRef}
//     dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//   ></div>
// </div>
// <div className="cbtns">
//   {!showEditor && (
//     <div className="fixed-buttons">
//       <button className="csend" onClick={handleSendForReview}>
//         Send for Review
//       </button>
//       <button className="csave" onClick={handleSave}>
//         Save
//       </button>
//     </div>
//   )}
// </div>
// <div>
//   {!showEditor ? (
//     <button className="cbtntwo" onClick={handleEdit}>
//       Edit
//     </button>
//   ) : (
//     <div>
//       <button onClick={() => setShowEditor(false)}>Done</button>
//       <button onClick={handleSave}>Save</button>
//     </div>
//   )}
// </div>
// {showEditor && <div id="gjs"></div>}
// {showForm && (
//   <div className="form-popup">
//     <form onSubmit={handleFormSubmit}>
//       <h3>Send HTML Code for Review</h3>
//       <label>Name:</label>
//       <input
//         type="text"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <label>Email:</label>
//       <input
//         type="email"
//         value={email}
//         onChange={(e) => setEmail(e.target.value)}
//       />
//       <label>Message:</label>
//       <textarea
//         value={message}
//         onChange={(e) => setMessage(e.target.value)}
//       ></textarea>
//       <div {...getRootProps()} className="dropzone">
//         <input {...getInputProps()} />
//         <p>Drag 'n' drop an image here, or click to select an image</p>
//       </div>
//       {imageDataUrl && (
//         <div className="image-preview">
//           <h4>Design Preview:</h4>
//           <img src={imageDataUrl} alt="Design Preview" />
//           <p>Text (HTML)</p>
//         </div>
//       )}
//       <button type="submit">Send</button>
//       <button
//         type="button"
//         className="cancel-button"
//         onClick={() => setShowForm(false)}
//       >
//         Cancel
//       </button>
//     </form>
//   </div>
// )}

//       {/* "View Template" button to display the generated new template */}
//       {!showGeneratedTemplate && (
//         <button className="view-template-btn" onClick={handleCreateNewTemplate}>
//           View Template
//         </button>
//       )}

//       {/* Display the generated new template inside the child component */}
//       {showGeneratedTemplate && (
//         <div className="card">
//           <h3>Generated New Template:</h3>
//           <div dangerouslySetInnerHTML={{ __html: generatedTemplateHTML }} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//////////////////////////////To do //////////////////////////////////////////ok bellow code
// import React, { useState, useEffect, useRef, useCallback } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import { useDropzone } from "react-dropzone";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);
//   const [imageFile, setImageFile] = useState(null);

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleImageUpload = async (file) => {
//     try {
//       const formData = new FormData();
//       formData.append("image", file);

//       const response = await axios.post(
//         "http://localhost:5500/upload-image",
//         formData
//       );
//       const imageUrl = response.data.imageUrl;
//       console.log("Image URL:", imageUrl);

//       setImageDataUrl(imageUrl);
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       // Handle error here
//     }
//   };

//   const onDrop = useCallback((acceptedFiles) => {
//     setImageFile(acceptedFiles[0]);
//   }, []);

//   const { getRootProps, getInputProps } = useDropzone({ onDrop });

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     if (imageFile) {
//       handleImageUpload(imageFile);
//     } else {
//       submitFormData();
//     }
//   };

//   const submitFormData = () => {
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     axios
//       .post("http://localhost:5500/send-email", formData)
//       .then((response) => {
//         console.log(response.data);
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false);
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             <div {...getRootProps()} className="dropzone">
//               <input {...getInputProps()} />
//               <p>Drag 'n' drop an image here, or click to select an image</p>
//             </div>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//======================================================================OK2

// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     // Form submission logic
//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     // Convert FormData object to a JSON object
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//       formDataObject[key] = value;
//     });

//     axios
//       .post("http://localhost:5500/send-email", formDataObject)
//       .then((response) => {
//         console.log(response.data);
//         // Reset the form fields
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false); // Close the form popup
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//======================================================================>>>>>>ok today
// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   // ... Your existing state and ref declarations ...
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   // ... Your existing useEffect hooks ...
//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//         // Log the form data after imageDataUrl is set
//         console.log("Form Data:", {
//           name: name,
//           email: email,
//           message: message,
//           imageDataUrl: dataUrl, // Use dataUrl instead of imageDataUrl
//         });
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("imageDataURL", imageDataUrl); // Use imageDataURL instead of image

//     // Convert FormData object to a JSON object
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//       formDataObject[key] = value;
//     });

//     axios
//       .post("http://localhost:5500/send-email", formDataObject)
//       .then((response) => {
//         console.log(response.data);
//         // Reset the form fields
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false); // Close the form popup
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//======================================================================>>below code is good
// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   // ... Your existing state and ref declarations ...
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   // ... Your existing useEffect hooks ...
//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     console.log(formData);

//     // Log the form data to the console
//     console.log("Form Data:", {
//       name: name,
//       email: email,
//       message: message,
//       imageDataUrl: imageDataUrl,
//     });

//     // Convert FormData object to a JSON object
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//       formDataObject[key] = value;
//     });

//     axios
//       .post("http://localhost:5500/send-email", formDataObject)
//       .then((response) => {
//         console.log(response.data);
//         // Reset the form fields
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false); // Close the form popup
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;
/////////////////////////////////////////////////////////////////////////////////////////////////tryng new

// //==============================================================>>>>ok
// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   // ... Your existing state and ref declarations ...
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   const captureImage = () => {
//     domtoimage
//       .toBlob(captureContainerRef.current) // Use toBlob() to get a Blob object instead of a data URL
//       .then(function (blob) {
//         // Create a temporary URL from the Blob object
//         const imageUrl = URL.createObjectURL(blob);
//         setImageDataUrl(imageUrl); // Set the image URL as the state
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   // ... Your existing useEffect hooks ...
//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     console.log(formData);

//     // Log the form data to the console
//     console.log("Form Data:", {
//       name: name,
//       email: email,
//       message: message,
//       imageDataUrl: imageDataUrl,
//     });

//     // Convert FormData object to a JSON object
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//       formDataObject[key] = value;
//     });

//     axios
//       .post("http://localhost:5500/send-email", formDataObject)
//       .then((response) => {
//         console.log(response.data);
//         // Reset the form fields
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false); // Close the form popup
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   useEffect(() => {
//     captureImage();
//   }, []);

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//======================================================================>>>>>>>>>>everuthing fin below code
// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   // ... Your existing state and ref declarations ...
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   // ... Your existing useEffect hooks ...
//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl);

//     console.log(formData);

//     // Log the form data to the console
//     console.log("Form Data:", {
//       name: name,
//       email: email,
//       message: message,
//       imageDataUrl: imageDataUrl,
//     });

//     // Convert FormData object to a JSON object
//     const formDataObject = {};
//     formData.forEach((value, key) => {
//       formDataObject[key] = value;
//     });

//     axios
//       .post("http://localhost:5500/send-email", formDataObject)
//       .then((response) => {
//         console.log(response.data);
//         // Reset the form fields
//         setName("");
//         setEmail("");
//         setMessage("");
//         setImageDataUrl(null);
//         setShowForm(false); // Close the form popup
//       })
//       .catch((error) => {
//         console.error("Error sending email:", error);
//         // Handle error here
//       });
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

//------------------------------------------------------------------------>>>>>>>>>>>>>>>mail 1
// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import axios from "axios";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   const handleFormSubmit = async (e) => {
//     e.preventDefault();

//     const formData = new FormData();
//     formData.append("name", name);
//     formData.append("email", email);
//     formData.append("message", message);
//     formData.append("image", imageDataUrl, "design.jpg");

//     try {
//       await axios.post("http://localhost:3001/send-email", formData);
//       console.log("Form data sent successfully");
//       // Reset the form fields
//       setName("");
//       setEmail("");
//       setMessage("");
//       setImageDataUrl(null);
//       setShowForm(false); // Close the form popup
//     } catch (error) {
//       console.error("Error sending form data:", error);
//     }
//   };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };

//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div>
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form onSubmit={handleFormSubmit}>
//             <h3>Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <h4>Design Preview:</h4>
//                 <img src={imageDataUrl} alt="Design Preview" />
//                 <p>Text (HTML)</p>
//               </div>
//             )}
//             <button type="submit">Send</button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;

// import React, { useState, useEffect, useRef } from "react";
// import grapesjs from "grapesjs";
// import plugin from "grapesjs-preset-newsletter";
// import { saveAs } from "file-saver";
// import domtoimage from "dom-to-image";
// import "./childcomponent.css";

// const ChildComponent = ({ htmlCode }) => {
//   const [editor, setEditor] = useState(null);
//   const [showEditor, setShowEditor] = useState(false);
//   const [showForm, setShowForm] = useState(false);
//   const [updatedHtmlCode, setUpdatedHtmlCode] = useState(htmlCode);
//   const designContainerRef = useRef(null);
//   const captureContainerRef = useRef(null);
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [message, setMessage] = useState("");
//   const [imageDataUrl, setImageDataUrl] = useState(null);

//   useEffect(() => {
//     const initializeEditor = () => {
//       const editor = grapesjs.init({
//         container: "#gjs",
//         plugins: [plugin],
//         pluginsOpts: {
//           [plugin]: {
//             /* options */
//           },
//         },
//         storageManager: false,
//       });

//       setEditor(editor);
//     };

//     initializeEditor();
//   }, []);

//   useEffect(() => {
//     if (editor) {
//       editor.setComponents(updatedHtmlCode);
//     }
//   }, [editor, updatedHtmlCode]);

//   const handleEdit = () => {
//     setShowEditor(true);
//   };

//   const handleSave = () => {
//     const updatedHtmlCode = editor.getHtml();
//     console.log("Updated HTML code:", updatedHtmlCode);
//     setUpdatedHtmlCode(updatedHtmlCode);
//     const blob = new Blob([updatedHtmlCode], { type: "text/html" });
//     saveAs(blob, "design.html");
//   };

//   const handleSendForReview = () => {
//     captureImage();
//     setShowForm(true);
//   };

//   // const handleFormSubmit = (e) => {
//   //   e.preventDefault();

//   //   const formData = new FormData();
//   //   formData.append("name", name);
//   //   formData.append("email", email);
//   //   formData.append("message", message);
//   //   formData.append("image", imageDataUrl, "design.jpg");

//   //   // Send the formData to the server or handle the submission as needed
//   //   // Example: axios.post("/send-email", formData);

//   //   console.log("Form data:", formData);

//   //   // Reset the form fields
//   //   setName("");
//   //   setEmail("");
//   //   setMessage("");
//   //   setImageDataUrl(null);

//   //   setShowForm(false); // Close the form popup
//   // };

//   const captureImage = () => {
//     domtoimage
//       .toJpeg(captureContainerRef.current)
//       .then(function (dataUrl) {
//         setImageDataUrl(dataUrl);
//       })
//       .catch(function (error) {
//         console.error("Error capturing the image:", error);
//       });
//   };
//   return (
//     <div className="cmain">
//       <nav className="cnav">
//         <h2 className="ctitle">Saved Templates</h2>
//       </nav>
//       <div className="capture-container" ref={captureContainerRef}>
//         <div
//           id="design-container"
//           ref={designContainerRef}
//           dangerouslySetInnerHTML={{ __html: updatedHtmlCode }}
//         ></div>
//       </div>
//       <div className="cbtns">
//         {!showEditor && (
//           <div className="fixed-buttons">
//             <button className="csend" onClick={handleSendForReview}>
//               Send for Review
//             </button>
//             <button className="csave" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button className="cbtnthree" onClick={() => setShowEditor(false)}>
//               Done
//             </button>
//             <button className="cbtnfour" onClick={handleSave}>
//               Save
//             </button>
//           </div>
//         )}
//       </div>
//       {/* <div>
//         {!showEditor ? (
//           <button className="cbtntwo" onClick={handleEdit}>
//             Edit
//           </button>
//         ) : (
//           <div>
//             <button onClick={() => setShowEditor(false)}>Done</button>
//             <button onClick={handleSave}>Save</button>
//           </div>
//         )}
//       </div> */}
//       {showEditor && <div id="gjs"></div>}
//       {showForm && (
//         <div className="form-popup">
//           <form>
//             <h3 className="headtit">Send HTML Code for Review</h3>
//             <label>Name:</label>
//             <input
//               className="ina"
//               type="text"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//             <label>Email:</label>
//             <input
//               className="inb"
//               type="email"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//             />
//             <label>Message:</label>
//             <textarea
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//             ></textarea>
//             {imageDataUrl && (
//               <div className="image-preview">
//                 <img src={imageDataUrl} alt="Design Preview" />
//               </div>
//             )}
//             <button
//               onClick={() => {
//                 alert("Success alert (updating)");
//               }}
//               className="cbtnfive"
//             >
//               Send
//             </button>
//             <button
//               type="button"
//               className="cancel-button"
//               onClick={() => setShowForm(false)}
//             >
//               Cancel
//             </button>
//           </form>
//         </div>
//       )}
//     </div>
//   );
// };

// export default ChildComponent;
