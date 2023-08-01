import React from "react";
import "./ContentSection.css";

const ContentSection = ({ sectionId, title, content }) => {
  return (
    <section id={sectionId} className="content-section">
      <h2>{title}</h2>
      <p>{content}</p>
    </section>
  );
};

export default ContentSection;
