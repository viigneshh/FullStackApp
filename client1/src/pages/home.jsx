import TokenCard from '../components/tokencard';
import CreateTokenModal from '../components/createTokenModel';
import '../css/home.css';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';

function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const[memberlist, setMemberlist] = useState([]);

  // ✅ Fetch projects for the logged-in user
  useEffect(() => {
    const loadProjects = async () => {
      if (!user || !user.userid) return;

      try {
        const res = await axios.get(`http://localhost:5000/api/user/${user.userid}/projects`);
        setProjects(res.data);
      } catch (err) {
        console.error("Failed to load projects:", err);
      }
    };

    loadProjects();
  }, [user]);

  // ✅ Fetch tokens for selected project
  const handleProjectSelect = async (project) => {
    setSelectedProject(project);
    try {
      const res = await axios.get(`http://localhost:5000/api/tokens/${project.projectid}`);
      setTokens(res.data);
      const memberRes=await axios.get(`http://localhost:5000/api/members/${project.projectid}`);
      setMemberlist(memberRes.data);
    } catch (err) {
      console.error("Unable to fetch tokens:", err);
      setTokens([]);
    }
  };

  const fetchTokens = async (projectId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/tokens/${projectId}`);
      setTokens(res.data);
    } catch (err) {
      console.error("Unable to fetch tokens:", err);
    }
  };

  return (
    <div className="contentWrap">
      {/* Left Sidebar */}
      <div className="leftDis">
        <input className='searchin' type='text' placeholder='Search project' />
        <ul className="listpfPro">
          {projects.map((pro) => (
            <li
              key={pro.projectid}
              className={`project-item ${selectedProject?.projectid === pro.projectid ? 'active' : ''}`}
              onClick={() => handleProjectSelect(pro)}
            >
              {pro.projectname}
            </li>
          ))}
        </ul>
      </div>

      <div className="centerDis">
        {!selectedProject ? (
          <button className="createpro" onClick={() => navigate('/project/create')}>
            Create New Project
          </button>
        ) : (
          <>
            {/* Button to trigger Create Token Modal */}
            <div className="top-btn-container">
              <button className="btn primary-btn" onClick={() => setShowModal(true)}>
                + Create Token
              </button>
            </div>
            <div className='tokenList'>
            {/* Token List */}
            {tokens.length > 0 ? (
              tokens.map((t, idx) => <TokenCard key={idx} token={t} />)
            ) : (
              <p className="setit">No tokens in this project</p>
            )}</div>
          </>
        )}
      </div>

      {/* Create Token Modal (conditionally shown) */}
      {showModal && selectedProject && (
        <CreateTokenModal
          projectId={selectedProject.projectid}
          onClose={() => {
            setShowModal(false);
            fetchTokens(selectedProject.projectid);
          }}
        />
      )}
      {/* Right Sidebar */}
      <div className='rightside'>
        <button className='btn adduser' >+ Add Member</button>

      </div>
    </div>
  );
}

export default Home;
