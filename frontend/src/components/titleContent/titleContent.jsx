import React from "react";
import "./titleContent.css"

const DashboardHeader = ({ icon: IconComponent, title, description }) => {
  return (
    <div className="dashboard-header">
      <div className="header-content">
        <div className="header-left">
          <div className="header-icon">
            {IconComponent && <IconComponent />}
          </div>
          <div className="header-text">
            <h1 className="header-title">{title}</h1>
            <p className="header-subtitle">{description}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader;
