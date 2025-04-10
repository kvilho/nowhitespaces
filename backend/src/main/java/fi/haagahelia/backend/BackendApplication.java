package fi.haagahelia.backend;

import java.security.KeyStore.Entry;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;

import fi.haagahelia.backend.model.Organization;
import fi.haagahelia.backend.model.Role;
import fi.haagahelia.backend.model.Roles;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.OrganizationRepository;
import fi.haagahelia.backend.repositories.RoleRepository;
import fi.haagahelia.backend.repositories.UserRepository;

@SpringBootApplication
public class BackendApplication {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    public CommandLineRunner initializeData(
            UserRepository userRepository, 
            RoleRepository roleRepository,
            OrganizationRepository organizationRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            // Create default organization
            Organization org = new Organization();
            org.setOrganizationName("Default Organization");
            organizationRepository.save(org);

            // Create roles
            Role employeeRole = new Role();
            employeeRole.setRoleName("ROLE_USER");
            employeeRole.setRoleDescription("Employee role");
            roleRepository.save(employeeRole);

            Role employerRole = new Role();
            employerRole.setRoleName("ROLE_ADMIN");
            employerRole.setRoleDescription("Employer role");
            roleRepository.save(employerRole);

            // Create default user
            User defaultUser = new User();
            defaultUser.setUsername("employee");
            defaultUser.setEmail("employee@test.com");
            defaultUser.setPasswordHash(passwordEncoder.encode("employee"));
            defaultUser.setRole(employeeRole);
            defaultUser.setOrganization(org);
            defaultUser.setFirstname("Test");
            defaultUser.setLastname("Employee");
            userRepository.save(defaultUser);

            // Create admin user
            User adminUser = new User();
            adminUser.setUsername("admin");
            adminUser.setEmail("admin@test.com");
            adminUser.setPasswordHash(passwordEncoder.encode("admin"));
            adminUser.setRole(employerRole);
            adminUser.setOrganization(org);
            adminUser.setFirstname("Admin");
            adminUser.setLastname("User");
            userRepository.save(adminUser);
        };
    }
}
