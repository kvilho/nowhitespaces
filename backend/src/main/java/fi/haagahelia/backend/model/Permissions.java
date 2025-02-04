package fi.haagahelia.backend.model;

import jakarta.persistence.*;

@Entity
public class Permissions {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Auto-generate primary key
    private Long permissionsId;
    
    private String permissionsDescription;

    public Permissions(Long permissionsId, String permissionsDescription) {
        this.permissionsId = permissionsId;
        this.permissionsDescription = permissionsDescription;
    }

    public Permissions(){
    }


    public Long getPermissionsId() {
        return permissionsId;
    }


    public void setPermissionsId(Long permissionsId) {
        this.permissionsId = permissionsId;
    }


    public String getPermissionsDescription() {
        return permissionsDescription;
    }


    public void setPermissionsDescription(String permissionsDescription) {
        this.permissionsDescription = permissionsDescription;
    }

    @Override
    public String toString() {
        return "Permissions [permissonsId=" + permissionsId + ", permissionsDescription=" + permissionsDescription + "]";
    }
}
