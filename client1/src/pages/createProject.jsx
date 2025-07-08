import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useUser } from "../context/userContext";
import "../css/createproject.css"; // ✅ Import the CSS styling

function CreateProject() {
  const [projectName, setProjectName] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { user } = useUser();

  const createProject = async () => {
    if (!user || !user.userid) {
      setMessage("❌ You must be logged in to create a project");
      console.log("User context is null:", user);
      return;
    }

    try {
      const res = await axios.post("http://localhost:5000/api/projects", {
        name: projectName,
        description: description,
        userid: user.userid,
      });

      setMessage("✅ Project created!");
      const projectId = res.data.projectid;

      setTimeout(() => navigate("/home"), 1000);
    } catch (err) {
      console.error(err);
      setMessage("❌ Failed to create project");
    }
  };

  return (
    <div className="create-project-container">
      <h1>Create a New Project</h1>
      <input
        type="text"
        className="pron"
        placeholder="Project Name"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
      />
      <textarea
        placeholder="Project Description"
        className="proD"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />
      <button onClick={createProject}>Create Project</button>
      {message && <p className={message.includes("✅") ? "text-green-600" : "text-red-600"}>{message}</p>}
    </div>
  );
}

export default CreateProject;
