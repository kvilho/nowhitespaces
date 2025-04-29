package fi.haagahelia.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long projectMemberId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "project_id", nullable = false)
    @JsonIgnoreProperties("members")
    private Project project;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnoreProperties({"projectMembers", "passwordHash"})
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private ProjectRole role;

    private LocalDateTime joinedAt;

    // Constructors
    public ProjectMember() {}

    public ProjectMember(long projectMemberId, Project project, User user, ProjectRole role, LocalDateTime joinedAt) {
        this.projectMemberId = projectMemberId;
        this.project = project;
        this.user = user;
        this.role = role;
        this.joinedAt = joinedAt;
    }

    // Getters and Setters
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

    public ProjectRole getRole() {
        return role;
    }

    public void setRole(ProjectRole role) {
        this.role = role;
    }

    public LocalDateTime getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(LocalDateTime joinedAt) {
        this.joinedAt = joinedAt;
    }
}
