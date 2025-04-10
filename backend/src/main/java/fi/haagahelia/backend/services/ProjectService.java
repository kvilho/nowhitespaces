package fi.haagahelia.backend.services;

import java.time.LocalDateTime;

import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;

import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.model.ProjectMember;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.ProjectMemberRepository;
import fi.haagahelia.backend.repositories.ProjectRepository;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;

    @Autowired
    public ProjectService(ProjectRepository projectRepository, ProjectMemberRepository projectMemberRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
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
        projectMember.setRole("employer");
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
        member.setRole("employee");
        member.setJoinedAt(LocalDateTime.now());
        projectMemberRepository.save(member);
    }

    private String generateProjectCode() {
        // Generate a random 6-character numeric code
        String code;
        do {
            code = String.valueOf((int) (Math.random() * 900000) + 100000); // 6 digit code
        } while (projectRepository.findByProjectCode(code).isPresent()); // Check if code already exists 
        return code;
    }
}
