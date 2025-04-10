package fi.haagahelia.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name="users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", nullable = false, updatable = false)
	private Long id;
    
    @Column(name = "username", nullable = false, unique = true)
	private String username;

    private String firstname;
    private String lastname;

    @Column(name = "email", nullable = false, unique = true)
	private String email;

    @Column(name = "password", nullable = false)
	private String passwordHash;

    @Column(name = "phone", unique = true) // Ensure phone number is unique (like you ;))
    private String phone;

    @ManyToOne
    @JoinColumn(name = "roleId") // Foreign key to the Role entity
    private Role role;

    @ManyToOne
    @JoinColumn(name = "organizationId")
    private Organization organization;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getFirstname() {
        return firstname;
    }

    public void setFirstname(String firstname) {
        this.firstname = firstname;
    }

    public String getLastname() {
        return lastname;
    }

    public void setLastname(String lastname) {
        this.lastname = lastname;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }
    
    public User() {
    }

    public User(String username, String email, String passwordHash, Role role, Organization organization) {
        this.username = username;
        this.email = email;
        this.passwordHash = passwordHash;
        this.role = role;
        this.organization = organization;

    }

    public User(String username, String firstname, String lastname, String email, String passwordHash, String phone,
            Role role, Organization organization) {
        this.username = username;
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.passwordHash = passwordHash;
        this.phone = phone;
        this.role = role;
        this.organization = organization;
    }


    public Organization getOrganization() {
        return organization;
    }

    public void setOrganization(Organization organization) {
        this.organization = organization;
    }

    @Override
    public String toString() {
        return "User [id=" + id + ", username=" + username + ", firstname=" + firstname + ", lastname=" + lastname
                + ", email=" + email + ", phone=" + phone + ", role=" + role + ", organization=" + organization + "]";
    }

    
    

    
}


    