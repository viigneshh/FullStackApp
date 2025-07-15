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
  const [memberlist, setMemberlist] = useState([]);

  // Load user projects
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

  // Select project and fetch tokens + members
  const handleProjectSelect = async (project) => {
    setSelectedProject(project);

    try {
      // Fetch tokens
      const tokenRes = await axios.get(`http://localhost:5000/api/tokens/${project.projectid}`);
      setTokens(tokenRes.data);

      // Fetch member userids
      const memberRes = await axios.get(`http://localhost:5000/api/members/${project.projectid}`);
      const userIds = memberRes.data.map(m => m.userid);

      // Fetch each user's full details
      const memberDetailsPromises = userIds.map(id =>
        axios.get(`http://localhost:5000/api/member/${id}`).then(res => res.data)
      );

      const fullMembers = await Promise.all(memberDetailsPromises);
      setMemberlist(fullMembers);
    } catch (err) {
      console.error("Unable to fetch project data:", err);
      setTokens([]);
      setMemberlist([]);
    }
  };

  // Reload tokens when a new token is added
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

      {/* Center Content */}
      <div className="centerDis">
        {!selectedProject ? (
          <button className="createpro" onClick={() => navigate('/project/create')}>
            Create New Project
          </button>
        ) : (
          <>
            <div className="top-btn-container">
              <button className="btn primary-btn" onClick={() => setShowModal(true)}>
                + Create Token
              </button>
            </div>
            <div className='tokenList'>
              {tokens.length > 0 ? (
                tokens.map((t, idx) => <TokenCard key={idx} token={t} />)
              ) : (
                <p className="setit">No tokens in this project</p>
              )}
            </div>
          </>
        )}
      </div>

      {/* Right Sidebar (Members) */}
      <div className='rightside'>
        <button className='btn adduser'>+ Add Member</button>
        <h3 className="member-header">Members</h3>
        <ul className="member-list">
          {memberlist.length > 0 ? (
            memberlist.map((m, idx) => (
              <li key={idx} className="member-item">
                <strong>{m.username}</strong><br />
                <span style={{ fontSize: '13px', color: '#555' }}>{m.email}</span>
              </li>
            ))
          ) : (
            <p className="setit">No members found</p>
          )}
        </ul>
      </div>

      {/* Create Token Modal */}
      {showModal && selectedProject && (
        <CreateTokenModal
          projectId={selectedProject.projectid}
          onClose={() => {
            setShowModal(false);
            fetchTokens(selectedProject.projectid);
          }}
        />
      )}
    </div>
  );
}

export default Home;
