package fi.haagahelia.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long projectId;
    private String projectName;
    private String projectCode; // 6 numbers code for the project
    private int createdBy; // user id of the creator
    private LocalDateTime createdAt;
    private String projectDescription;

    // constructors
    public Project() {}

    public Project(Long projectId, String projectName, String projectCode, int createdBy, LocalDateTime createdAt, String projectDescription) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectCode = projectCode;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.projectDescription = projectDescription;
    }

    // getters and setters
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

    public int getCreatedBy() {
        return createdBy;
    }

    public void setCreatedBy(int createdBy) {
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

    @Override
    public String toString() {
        return "Project [projectId=" + projectId + ", projectName=" + projectName + ", projectCode=" + projectCode
                + ", createdBy=" + createdBy + ", createdAt=" + createdAt + ", projectDescription=" + projectDescription
                + "]";
    }
}
