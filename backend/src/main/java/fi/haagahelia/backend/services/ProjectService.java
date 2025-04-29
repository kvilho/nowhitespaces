package fi.haagahelia.backend.services;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.model.ProjectMember;
import fi.haagahelia.backend.model.ProjectRole;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.ProjectMemberRepository;
import fi.haagahelia.backend.repositories.ProjectRepository;
import fi.haagahelia.backend.model.Entry;
import fi.haagahelia.backend.repositories.EntryRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final EntryRepository entryRepository;

    public ProjectService(ProjectRepository projectRepository, ProjectMemberRepository projectMemberRepository, EntryRepository entryRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.entryRepository = entryRepository;
    }

    public Project createProject(Project project, User creator) {
        // generate project code
        String projectCode = generateProjectCode();
        project.setProjectCode(projectCode);
        project.setCreatedBy(creator);
        project.setCreatedAt(LocalDateTime.now());
        
        Project savedProject = projectRepository.save(project);
        
        ProjectMember projectMember = new ProjectMember();
        projectMember.setProject(savedProject);
        projectMember.setUser(creator);
        projectMember.setRole(ProjectRole.OWNER);
        projectMember.setJoinedAt(LocalDateTime.now());
        projectMemberRepository.save(projectMember);

        return savedProject;
    }

    public void joinProjectByCode(String projectCode, User user) {
        Project project = projectRepository.findByProjectCode(projectCode)
            .orElseThrow(() -> new RuntimeException("Project not found with code: " + projectCode));

        // check if user is already a member of the project
        boolean alreadyMember = project.getMembers().stream()
                .anyMatch(member -> member.getUser().getId().equals(user.getId()));
                
        if (alreadyMember) {
            throw new RuntimeException("User is already a member of this project");
        }

        ProjectMember member = new ProjectMember();
        member.setProject(project);
        member.setUser(user);
        member.setRole(ProjectRole.EMPLOYEE);
        member.setJoinedAt(LocalDateTime.now());
        projectMemberRepository.save(member);
    }

    public Project getProjectById(Long id, User user) {
        Project project = projectRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Project not found"));

        boolean isMember = project.getMembers().stream()
            .anyMatch(member -> member.getUser().getId().equals(user.getId()));

        if (!isMember) {
            throw new RuntimeException("User is not a member of this project");
        }

        return project;
    }

    public List<ProjectMember> getProjectMembers(Long projectId, User user) {
        Project project = getProjectById(projectId, user);
        return projectMemberRepository.findByProject(project);
    }

    public List<Entry> getProjectEntries(Long projectId, User user) {
        Project project = getProjectById(projectId, user);
        
        // Check if user is a member of the project
        ProjectMember member = projectMemberRepository.findByProjectAndUser(project, user)
            .orElseThrow(() -> new RuntimeException("User is not a member of this project"));
        
        // If user is the project creator (owner) or a member, return all project entries
        return entryRepository.findByProject(project);
    }

    @Transactional
    public void removeMemberFromProject(Long projectId, Long memberId, User currentUser) {
        Project project = getProjectById(projectId, currentUser);

        // Ensure the current user is the project owner
        ProjectMember currentUserMember = projectMemberRepository.findByProjectAndUser(project, currentUser)
            .orElseThrow(() -> new RuntimeException("User is not a member of this project"));

        if (currentUserMember.getRole() != ProjectRole.OWNER) {
            throw new RuntimeException("Only the project owner can remove members");
        }

        // Find the member to remove
        ProjectMember member = projectMemberRepository.findById(memberId)
            .orElseThrow(() -> new RuntimeException("Project member not found"));

        // Remove the member
        projectMemberRepository.delete(member);
    }

    private String generateProjectCode() {
        // Generate a random 6-character numeric code
        String code;
        do {
            code = String.valueOf((int) (Math.random() * 900000) + 100000); // 6 digit code
        } while (projectRepository.findByProjectCode(code).isPresent()); // Check if code already exists 
        return code;
    }
    
    public List<Project> getUserProjects(User user) {
        List<ProjectMember> projectMembers = projectMemberRepository.findByUserId(user.getId());
        return projectMembers.stream()
                .map(ProjectMember::getProject)
                .distinct()  // Ensure no duplicate projects
                .toList();
    }

    // Update project name and description only
    public Optional<Project> updateProject(Long id, Project updatedProject) {
        return projectRepository.findById(id).map(project -> {
            project.setProjectName(updatedProject.getProjectName());
            project.setProjectDescription(updatedProject.getProjectDescription());
            return projectRepository.save(project);
        });
    }

    // Method to delete project
    public boolean deleteProject(Long id) {
        if (projectRepository.existsById(id)) {
            projectRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
