package fi.haagahelia.backend.model;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.Column;
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

    @Column(length = 6, nullable = false)
    private String projectCode; // 6 numbers code for the project

    private int createdBy; // user id of the creator to be added later

    private LocalDateTime createdAt;

    private String projectDescription;

    private List<ProjectMember> members = new ArrayList<>();

    // constructors
    public Project() {}

    public Project(Long projectId, String projectName, String projectCode, int createdBy, LocalDateTime createdAt, String projectDescription, List<ProjectMember> members) {
        this.projectId = projectId;
        this.projectName = projectName;
        this.projectCode = projectCode;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.projectDescription = projectDescription;
        this.members = members;
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

    public List<ProjectMember> getMembers() {
        return members;
    }

    public void setMembers(List<ProjectMember> members) {
        this.members = members;
    }
    @Override
    public String toString() {
        return "Project [projectId=" + projectId + ", projectName=" + projectName + ", projectCode=" + projectCode
                + ", createdBy=" + createdBy + ", createdAt=" + createdAt + ", projectDescription=" + projectDescription
                + ", members=" + members + "]";
    }
}
