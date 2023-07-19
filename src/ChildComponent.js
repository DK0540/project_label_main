import React, { useState, useEffect, useRef } from "react";
import grapesjs from "grapesjs";
import plugin from "grapesjs-preset-newsletter";
import { saveAs } from "file-saver";
import domtoimage from "dom-to-image";
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

  const handleSendForReview = () => {
    captureImage();
    setShowForm(true);
  };

  // const handleFormSubmit = (e) => {
  //   e.preventDefault();

  //   const formData = new FormData();
  //   formData.append("name", name);
  //   formData.append("email", email);
  //   formData.append("message", message);
  //   formData.append("image", imageDataUrl, "design.jpg");

  //   // Send the formData to the server or handle the submission as needed
  //   // Example: axios.post("/send-email", formData);

  //   console.log("Form data:", formData);

  //   // Reset the form fields
  //   setName("");
  //   setEmail("");
  //   setMessage("");
  //   setImageDataUrl(null);

  //   setShowForm(false); // Close the form popup
  // };

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
        {!showEditor ? (
          <button className="cbtntwo" onClick={handleEdit}>
            Edit
          </button>
        ) : (
          <div>
            <button className="cbtnthree" onClick={() => setShowEditor(false)}>
              Done
            </button>
            <button className="cbtnfour" onClick={handleSave}>
              Save
            </button>
          </div>
        )}
      </div>
      {/* <div>
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
      </div> */}
      {showEditor && <div id="gjs"></div>}
      {showForm && (
        <div className="form-popup">
          <form>
            <h3 className="headtit">Send HTML Code for Review</h3>
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
            {imageDataUrl && (
              <div className="image-preview">
                <h4>Design Preview:</h4>
                <img src={imageDataUrl} alt="Design Preview" />
              </div>
            )}
            <button
              onClick={() => {
                alert("Success alert (updating)");
              }}
              className="cbtnfive"
            >
              Send
            </button>
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
