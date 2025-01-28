package fi.haagahelia.backend.model;

import jakarta.persistence.*;

@Entity
public class Permissions {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Auto-generate primary key
    private Long permissonsId;
    
    private String permissionsDescription;

    public Permissions(Long permissonsId, String permissionsDescription) {
        this.permissonsId = permissonsId;
        this.permissionsDescription = permissionsDescription;
    }

    public Permissions(){
    }


    public Long getPermissonsId() {
        return permissonsId;
    }


    public void setPermissonsId(Long permissonsId) {
        this.permissonsId = permissonsId;
    }


    public String getPermissionsDescription() {
        return permissionsDescription;
    }


    public void setPermissionsDescription(String permissionsDescription) {
        this.permissionsDescription = permissionsDescription;
    }

    @Override
    public String toString() {
        return "Permissions [permissonsId=" + permissonsId + ", permissionsDescription=" + permissionsDescription + "]";
    }
}
