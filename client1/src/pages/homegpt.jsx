// src/pages/home.jsx
import React, { useState } from "react";
import "../css/homegpt.css";

export default function Home() {
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { name: "Alpha Project", id: 1 },
    { name: "Beta Project", id: 2 },
    { name: "Zeta Project", id: 3 }
  ];

  const handleSelectProject = (project) => {
    setSelectedProject(project);
  };

  return (
    <div className="home-wrapper">
      {/* Left Sidebar */}
      <aside className="left-sidebar">
        <h3>Your Projects</h3>
        <input
          type="text"
          className="search-box"
          placeholder="Search projects..."
        />
        <ul className="project-list">
          {projects.map((proj) => (
            <li
              key={proj.id}
              className={`project-item ${selectedProject?.id === proj.id ? "active" : ""}`}
              onClick={() => handleSelectProject(proj)}
            >
              {proj.name}
            </li>
          ))}
        </ul>
      </aside>

      {/* Center */}
      <main className="center-content">
        <button className="create-btn">+ Create Project</button>

        {selectedProject && (
          <div className="token-display">
            <h2>{selectedProject.name}</h2>
            <div className="token-columns">
              <div className="token-category">
                <h4>Background Tokens</h4>
                {/* placeholder */}
              </div>
              <div className="token-category">
                <h4>Button Tokens</h4>
              </div>
              <div className="token-category">
                <h4>Input Box Tokens</h4>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Right Sidebar */}
      <aside className="right-sidebar">
        <h3>Project Members</h3>
        {selectedProject ? (
          <div className="members-list">
            <p>(To be populated)</p>
          </div>
        ) : (
          <p>Select a project to view members</p>
        )}
      </aside>
    </div>
  );
}



