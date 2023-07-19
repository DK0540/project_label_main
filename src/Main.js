import React, { useState, useRef, useEffect } from "react";
import grapesjs from "grapesjs";
import plugin from "grapesjs-preset-newsletter";
import { saveAs } from "file-saver";
import ChildComponent from "./ChildComponent";
import Popup from "./Popup";
import "./main.css";
import { Link } from "react-router-dom";

const Main = () => {
  const [editor, setEditor] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [htmlCode, setHtmlCode] = useState(""); // New state for HTML code
  const [isEditing, setIsEditing] = useState(false); // New state for editing mode

  const editorRef = useRef(null);

  useEffect(() => {
    const initEditor = () => {
      const editor = grapesjs.init({
        container: editorRef.current,
        plugins: [plugin],
        pluginsOpts: {
          [plugin]: {
            /* options */
          },
        },
      });

      editor.Commands.add("my-command", {
        run: (editor, sender) => {
          sender && sender.set("active", 0);
          setShowPopup(true);
        },
      });

      editor.Panels.addButton("options", {
        id: "my-button",
        className: "my-button-class",
        label: "My Button",
        command: "my-command",
        attributes: {
          title: "Click me",
        },
      });

      setEditor(editor);
    };

    initEditor();
  }, []);

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleDownload = () => {
    const code = editor.getHtml();
    console.log(code);
    setHtmlCode(code); // Update the htmlCode state

    const blob = new Blob([code], { type: "text/html" });
    saveAs(blob, "generated_code.html");
  };

  const handleSave = () => {
    const updatedHtmlCode = editor.getHtml();
    setHtmlCode(updatedHtmlCode); // Update the htmlCode state
    setIsEditing(false); // Disable editing mode
  };

  const handleEdit = () => {
    setIsEditing(true); // Enable editing mode
  };

  return (
    <div className="App">
      <header className="mheader">
        <nav className="mmain"></nav>
        <Link to="/">
          <button className="mback">Back</button>
        </Link>
        {!isEditing && (
          <button className="medit" onClick={handleEdit}>
            Edit
          </button>
        )}
        {isEditing && (
          <button className="msave" onClick={handleSave}>
            Save
          </button>
        )}
        <button className="mdownload" onClick={handleDownload}>
          Download
        </button>
      </header>
      <div ref={editorRef} id="gjs"></div>
      {showPopup && <Popup onClose={handleClosePopup} />}
      {htmlCode && (
        <ChildComponent
          htmlCode={htmlCode}
          setHtmlCode={setHtmlCode}
          isEditing={isEditing}
        />
      )}
    </div>
  );
};

export default Main;
