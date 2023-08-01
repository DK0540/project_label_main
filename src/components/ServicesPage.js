import React from "react";

import { FcPrivacy } from "react-icons/fc";
import { CgEditMarkup, CgUserlane } from "react-icons/cg";
import { ImBarcode } from "react-icons/im";
import { TbMoodShare } from "react-icons/tb";
import { MdPriceChange } from "react-icons/md";
import "./service.css";

const servicesData = [
  {
    id: 1,
    title: "Barcode Customization",
    description:
      "We provide inbuilt templates and also, provide the ability for users to customize their barcodes, such as changing size, color, font, and adding text or a logo to the barcode.",
    icon: <CgEditMarkup size={30} color="rgb(50, 219, 198)" />,
    link: "https://www.google.co.in/",
  },
  {
    id: 2,
    title: "High-Quality Graphics",
    description:
      "Our barcode generator utilizes advanced algorithms to ensure that each barcode is sharp, clear, and precise, whether displayed on screens or printed on various materials.",
    icon: <ImBarcode size={30} color="rgb(50, 219, 198)" />,
    link: "https://www.google.co.in/",
  },
  {
    id: 3,
    title: "User Friendly",
    description:
      "We have designed every step with you in mind, making barcode generation a breeze for everyone. Join thousands of satisfied users who trust Barcode Generator for its user-friendly approach to barcoding. Experience the ease and efficiency – try it today!",
    icon: <CgUserlane size={30} color="rgb(50, 219, 198)" />,
    link: "https://www.google.co.in/",
  },
  {
    id: 4,
    title: "Easy Sharing",
    description:
      "With just a few clicks, you can create single or multiple barcodes in various formats, ready for digital or print use. Share your barcodes via email, social media, or simply download and embed them into your documents and websites.",
    icon: <TbMoodShare size={30} color="rgb(50, 219, 198)" />,
    link: "https://www.google.co.in/",
  },
  {
    id: 5,
    title: "Pricing and Plans",
    description:
      "Providing our valuable customers with our available plans, such as a free version, trial period, or different tiers with varying features.Boost your online sales with our customized barcode solutions.",
    icon: <MdPriceChange size={30} color="rgb(50, 219, 198)" />,
    link: "https://www.google.co.in/",
  },
  {
    id: 6,
    title: "Security and Privacy",
    description:
      "Our barcode generator application utilizes industry-leading encryption protocols to secure user data during transmission and storage. We do not store any personally identifiable information (PII) related to the generated barcodes, ensuring that your data remains anonymous and confidential.",
    icon: <FcPrivacy size={30} />,
    link: "https://www.google.co.in/",
  },
];

const ServicesPage = () => {
  return (
    <div className="services-page">
      <h1>Our Services</h1>
      <div className="services-container">
        {servicesData.map((service) => (
          <div key={service.id} className="service-item">
            {service.icon}
            <h3>{service.title}</h3>
            <p>{service.description}</p>
            <p>
              <a href={service.link} className="learn-more">
                Learn More
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ServicesPage;
