package fi.haagahelia.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long projectMemberId;

    @ManyToOne
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    private String role;
    
    private LocalDateTime joinedAt;
    
    // constructors
    public ProjectMember() {}

    public ProjectMember(long projectMemberId, Project project, User user, String role, LocalDateTime joinedAt) {
        this.projectMemberId = projectMemberId;
        this.project = project;
        this.user = user;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    public long getProjectMemberId() {
        return projectMemberId;
    }

    public void setProjectMemberId(long projectMemberId) {
        this.projectMemberId = projectMemberId;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
    
    // getters and setters
    @Override
    public String toString() {
        return "ProjectMember{" +
                "projectMemberId=" + projectMemberId +
                ", project=" + project +
                ", user=" + user +
                ", role='" + role + '\'' +
                ", joinedAt=" + joinedAt +
                '}';
    }
    
}
