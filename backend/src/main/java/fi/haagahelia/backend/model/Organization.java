package fi.haagahelia.backend.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;

@Entity
public class Organization {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-generate primary key
    private Long organizationId;

    private String organizationName;

    @OneToMany(mappedBy = "organization", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    private List<Entry> entries;

    public Organization(Long organizationId, String organizationName, List<Entry> entries) {
        this.organizationId = organizationId;
        this.organizationName = organizationName;
        this.entries = entries;
    }

    public Organization() {
    }

    public Long getOrganizationId() {
        return organizationId;
    }

    public void setOrganizationId(Long organizationId) {
        this.organizationId = organizationId;
    }

    public String getOrganizationName() {
        return organizationName;
    }

    public void setOrganizationName(String organizationName) {
        this.organizationName = organizationName;
    }

    public List<Entry> getEntries() {
        return entries;
    }

    public void setEntry(List<Entry> entries) {
        this.entries = entries;
    }

    @Override
    public String toString() {
        return "Organization [organizationId=" + organizationId + ", organizationName=" + organizationName + ", entry="
                + entries + "]";
    }
}
