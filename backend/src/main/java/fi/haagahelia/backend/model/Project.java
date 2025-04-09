package fi.haagahelia.backend.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;

    private String projectName;

    @Column(length = 6, nullable = false)
    private String projectCode;

    @ManyToOne
    @JoinColumn(name = "createdBy")
    private User createdBy;

    private LocalDateTime createdAt;

    private String projectDescription;

    @OneToMany(mappedBy = "project", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProjectMember> members = new ArrayList<>();

    // Constructors, getters, and setters
    public Project() {}

    public Project(Long projectId, String projectName, String projectCode, User createdBy, LocalDateTime createdAt, String projectDescription, List<ProjectMember> members) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectCode = projectCode;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.projectDescription = projectDescription;
        this.members = members;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getProjectName() {
        return projectName;
    }

    public void setProjectName(String projectName) {
        this.projectName = projectName;
    }

    public String getProjectCode() {
        return projectCode;
    }

    public void setProjectCode(String projectCode) {
        this.projectCode = projectCode;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public String getProjectDescription() {
        return projectDescription;
    }

    public void setProjectDescription(String projectDescription) {
        this.projectDescription = projectDescription;
    }

    public List<ProjectMember> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMember> members) {
        this.members = members;
    }
}
