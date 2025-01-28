package fi.haagahelia.backend.model;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;

@Entity
public class Entry {

    // enum for entryStatus
    
    enum Status {
        APPROVED,
        PENDING,
        DECLINED
    }
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Auto-generate primary key
    private Long entryId;
    private LocalDateTime entryStart;
    private LocalDateTime entryEnd;
    private Status entryStatus;
    private String entryDescription;

    @ManyToOne
    @JoinColumn(name = "userId") //many-to-one relationship with User
    private User user;

    @ManyToOne
    @JoinColumn(name = "organizationId") //many-to-one relationship with Organization
    private Organization organization;

    public Entry(long entryId, LocalDateTime entryStart, LocalDateTime entryEnd, Status entryStatus, String entryDescription, User user, Organization organization) {
        this.entryId = entryId;
        this.entryStart = entryStart;
        this.entryEnd = entryEnd;
        this.entryStatus = entryStatus;
        this.entryDescription = entryDescription;
        this.user = user;
        this.organization = organization;
    }

    public Entry() {
    }

    // getters n setters 

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

    public Status getEntryStatus() {
        return entryStatus;
    }

    public void setEntryStatus(Status entryStatus) {
        this.entryStatus = entryStatus;
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

    @Override
    public String toString() {
        return "Entry [entryId=" + entryId + ", entryStart=" + entryStart + ", entryEnd=" + entryEnd + ", entryStatus="
                + entryStatus + ", entryDescription=" + entryDescription + ", user=" + user + ", organization="
                + organization + "]";
    }
    
    



}
