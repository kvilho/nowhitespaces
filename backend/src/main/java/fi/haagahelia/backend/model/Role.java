package fi.haagahelia.backend.model;

import jakarta.persistence.*;

@Entity
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO) // Auto-generate primary key
    private Long roleId;
    private String roleName;
    private String roleDescription;

    @ManyToOne
    @JoinColumn(name = "permissionsId")
    private Permissions permissions;

    @Enumerated(EnumType.STRING) // Store enum as a String in database
    private Roles roles;

    public Role(Long roleId, String roleName, String roleDescription, Roles roles) {
        this.roleId = roleId;
        this.roleName = roleName;
        this.roleDescription = roleDescription;
        this.roles = roles;
    }

    public Role() {
    }

    // Getters and setters
    public Long getRoleId() {
        return roleId;
    }

    public void setRoleId(Long roleId) {
        this.roleId = roleId;
    }
    
    public String getRoleName() {
        return roleName;
    }
    
    public void setRoleName(String roleName) {
        this.roleName = roleName;
    }

    public String getRoleDescription() {
        return roleDescription;
    }

    public void setRoleDescription(String roleDescription) {
        this.roleDescription = roleDescription;
    }

    public Permissions getPermissions() {
        return permissions;
    }

    public void setPermissions(Permissions permissions) {
        this.permissions = permissions; 
    }

    public Roles getRoles() {
        return roles;
    }

    public void setRoles(Roles roles) {
        this.roles = roles;
    }

    @Override
    public String toString() {
        return "Role [roleId=" + roleId + ", roleName=" + roleName + ", roleDescription=" + roleDescription
                + ", permissions=" + permissions + "]";
    }
}