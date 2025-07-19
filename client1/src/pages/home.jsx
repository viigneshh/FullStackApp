import { useState, useEffect } from 'react';
import axios from 'axios';
import { useUser } from '../context/userContext';
import { useNavigate } from 'react-router-dom';
import TokenCard from '../components/tokencard';
import CreateTokenModal from '../components/createTokenModel';
import AddMemberModal from '../components/addmember';
import '../css/home.css';

const exportFormats = [
  "jsonFlat", "cssVar", "cssProp", "scssFlat", "scssMap",
  "tailwind", "raw", "jsCJS", "jsESM", "jsonNested"
];

function Home() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState(null);
  const [tokens, setTokens] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberlist, setMemberlist] = useState([]);

  const [isExporting, setIsExporting] = useState(false);
  const [selectedTokens, setSelectedTokens] = useState([]);
  const [selectedFormat, setSelectedFormat] = useState("");
  const [exportOutput, setExportOutput] = useState("");

  const [showProfile, setShowProfile] = useState(false);

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

  const handleProjectSelect = async (project) => {
    setSelectedProject(project);
    setIsExporting(false);
    setSelectedTokens([]);
    try {
      const tokenRes = await axios.get(`http://localhost:5000/api/tokens/${project.projectid}`);
      setTokens(tokenRes.data);
      await fetchMembers(project.projectid);
    } catch (err) {
      console.error("Unable to fetch project data:", err);
      setTokens([]);
      setMemberlist([]);
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

  const fetchMembers = async (projectId) => {
    try {
      const memberRes = await axios.get(`http://localhost:5000/api/members/${projectId}`);
      const userIds = memberRes.data.map(m => m.userid);
      const fullMembers = await Promise.all(
        userIds.map(id =>
          axios.get(`http://localhost:5000/api/member/${id}`).then(res => res.data)
        )
      );
      setMemberlist(fullMembers);
    } catch (err) {
      console.error("Unable to fetch members:", err);
    }
  };

  const toggleTokenSelect = (token) => {
    const alreadySelected = selectedTokens.find(t => t.tokenid === token.tokenid);
    if (alreadySelected) {
      setSelectedTokens(selectedTokens.filter(t => t.tokenid !== token.tokenid));
    } else {
      setSelectedTokens([...selectedTokens, token]);
    }
  };

  const handleExport = async () => {
    if (!selectedFormat || selectedTokens.length === 0) return;

    try {
      const res = await axios.get(`http://localhost:5000/api/token/keywords`);
      const mappings = res.data;

      const outputLines = selectedTokens.map(token => {
        const match = mappings.find(m => m.subcategory === token.token_subcategory);
        if (!match || !match[selectedFormat]) return null;

        const keyword = match[selectedFormat];
        const value = token.token_value;
        return `${keyword}: ${value};`;
      }).filter(Boolean);

      setExportOutput(outputLines.join('\n'));
    } catch (err) {
      console.error("Export failed:", err);
      setExportOutput("// Failed to generate export");
    }
  };

  return (
    <div className="contentWrap">
      <div className="topbar">
        <img
          src="/profile-icon.png"
          alt="Profile"
          className="profile-icon"
          onClick={() => setShowProfile(true)}
        />
      </div>

      <div className="leftDis">
        <input className='searchin' type='text' placeholder='Search project' />
        <ul className="listpfPro">
          {projects.map((pro) => (
            <li
              key={pro.projectid}
              className={`project-item ${selectedProject?.projectid === pro.projectid ? 'active' : ''}`}
              onClick={() => handleProjectSelect(pro)}
            >
              <p>Name: {pro.projectname}</p>
              <p>Role: {pro.role}</p>
                {!isExporting && (selectedProject?.role === 'Admin') && (      
                      <button
                        className="btn danger-btn"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Are you sure you want to delete this project?")) {
                            try {
                              await axios.delete(`http://localhost:5000/api/project/${pro.projectid}`);
                              if (selectedProject?.projectid === pro.projectid) {
                                setSelectedProject(null);
                                setTokens([]);
                                setMemberlist([]);
                              }
                              const res = await axios.get(`http://localhost:5000/api/user/${user.userid}/projects`);
                              setProjects(res.data);
                            } catch (err) {
                              console.error("Failed to delete project:", err);
                            }
                          }
                        }}
                      >Delete</button>
                )}
                      
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
            <div className="top-btn-container">
              {!isExporting ? (
                <>
                  <button className="btn primary-btn" onClick={() => setShowModal(true)}>
                    + Create Token
                  </button>
                  <button className="btn export-btn" onClick={() => setIsExporting(true)}>
                    Export Tokens
                  </button>
                </>
              ) : (
                <button className="btn cancel-btn" onClick={() => {
                  setIsExporting(false);
                  setSelectedTokens([]);
                  setExportOutput("");
                }}>
                  Cancel Export
                </button>
              )}
            </div>
            <div className='tokenList'>
              {tokens.length > 0 ? (
                tokens.map((t, idx) => (
                  <div
                    key={idx}
                    className={`token-select-card ${isExporting && selectedTokens.some(sel => sel.tokenid === t.tokenid) ? 'selected' : ''}`}
                    onClick={() => isExporting && toggleTokenSelect(t)}
                  >
                    <TokenCard token={t} />
                    {!isExporting && (selectedProject?.role === 'Admin' || selectedProject?.role === 'Editor') && (
                      <button
                        className="btn small danger delete-token"
                        onClick={async (e) => {
                          e.stopPropagation();
                          if (window.confirm("Delete this token?")) {
                            try {
                              await axios.delete(`http://localhost:5000/api/token/delete/${t.tokenid}`);
                              fetchTokens(selectedProject.projectid);
                            } catch (err) {
                              console.error("Failed to delete token:", err);
                            }
                          }
                        }}
                      >×</button>
                    )}
                  </div>
                ))
              ) : (
                <p className="setit">No tokens in this project</p>
              )}
            </div>
          </>
        )}
      </div>

      <div className='rightside'>
        {selectedProject && !isExporting && (
          <button className='btn adduser' onClick={() => setShowAddMember(true)}>+ Add Member</button>
        )}
        <h3 className="member-header">Members</h3>
        <ul className="member-list">
          {memberlist.length > 0 ? (
            memberlist.map((m, idx) => (
              <li key={idx} className="member-item">
                <strong>{m.username}</strong><br />
                <span style={{ fontSize: '13px', color: '#555' }}>{m.email}</span>
                {m.userid !== user.userid && (
                  <button
                    className="btn small danger"
                    onClick={async () => {
                      if (window.confirm(`Remove ${m.username} from project?`)) {
                        try {
                          await axios.delete(`http://localhost:5000/api/members/${selectedProject.projectid}/${m.userid}`);
                          fetchMembers(selectedProject.projectid);
                        } catch (err) {
                          console.error("Failed to remove member:", err);
                        }
                      }
                    }}
                  >Remove</button>
                )}
              </li>
            ))
          ) : (
            <p className="setit">No members found</p>
          )}
        </ul>

        {isExporting && (
          <div className="export-overlay">
            <h4>Export Format</h4>
            <select
              className="format-dropdown"
              value={selectedFormat}
              onChange={(e) => setSelectedFormat(e.target.value)}
            >
              <option value="">Select format</option>
              {exportFormats.map((format, idx) => (
                <option key={idx} value={format}>{format}</option>
              ))}
            </select>
            <button
              className="btn export-btn"
              onClick={handleExport}
              disabled={selectedTokens.length === 0 || !selectedFormat}
            >
              Export
            </button>

            {exportOutput && (
              <textarea
                className="export-output"
                rows={8}
                value={exportOutput}
                readOnly
              />
            )}
          </div>
        )}
      </div>

      {showModal && selectedProject && (
        <CreateTokenModal
          projectId={selectedProject.projectid}
          onClose={() => {
            setShowModal(false);
            fetchTokens(selectedProject.projectid);
          }}
        />
      )}

      {showAddMember && selectedProject && (
        <AddMemberModal
          projectId={selectedProject.projectid}
          onClose={() => setShowAddMember(false)}
          onMemberAdded={() => fetchMembers(selectedProject.projectid)}
        />
      )}

      {showProfile && (
        <>
          <div className="overlay" onClick={() => setShowProfile(false)}></div>
          <div className="profile-slider">
            <button className="close-btn" onClick={() => setShowProfile(false)}>×</button>
            <h3>Profile</h3>
            <p><strong>Name:</strong> {user?.username}</p>
            <p><strong>Email:</strong> {user?.email}</p>
            <p><strong>User ID:</strong> {user?.userid}</p>
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
