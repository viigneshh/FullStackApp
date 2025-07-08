import { useParams } from "react-router-dom";
function ProjectDashboard(){
    const {projectId}=useParams();
    return(
        <div>u r in project no {projectId}</div>
    )
}
export default ProjectDashboard;