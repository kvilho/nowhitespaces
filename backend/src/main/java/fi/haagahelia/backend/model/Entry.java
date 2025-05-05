package fi.haagahelia.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Transient;
import jakarta.persistence.Column;

@Entity
public class Entry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long entryId;
    
    private LocalDateTime entryStart;
    private LocalDateTime entryEnd;
    private String entryDescription;

    @ManyToOne
    @JoinColumn(name = "userId", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "organizationId", nullable = false)
    private Organization organization;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Status status;

    @ManyToOne
    @JoinColumn(name = "projectId", nullable = false)
    private Project project;

    @Transient
    private Long userId;

    @Transient
    private Long projectId;

    @Column(length = 500)
    private String declineComment;

    public Entry() {
    }

    // Getters and Setters
    public Long getEntryId() {
        return entryId;
    }

    public void setEntryId(Long entryId) {
        this.entryId = entryId;
    }

    public LocalDateTime getEntryStart() {
        return entryStart;
    }

    public void setEntryStart(LocalDateTime entryStart) {
        this.entryStart = entryStart;
    }

    public LocalDateTime getEntryEnd() {
        return entryEnd;
    }

    public void setEntryEnd(LocalDateTime entryEnd) {
        this.entryEnd = entryEnd;
    }

    public String getEntryDescription() {
        return entryDescription;
    }

    public void setEntryDescription(String entryDescription) {
        this.entryDescription = entryDescription;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Project getProject() {
        return project;
    }

    public void setProject(Project project) {
        this.project = project;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public void setProjectId(Long projectId) {
        this.projectId = projectId;
    }

    public String getDeclineComment() {
        return declineComment;
    }

    public void setDeclineComment(String declineComment) {
        this.declineComment = declineComment;
    }

    @Override
    public String toString() {
        return "Entry [entryId=" + entryId + ", entryStart=" + entryStart + ", entryEnd=" + entryEnd + ", entryStatus="
                + status + ", entryDescription=" + entryDescription + ", user=" + user + ", organization="
                + organization + "]";
    }
}