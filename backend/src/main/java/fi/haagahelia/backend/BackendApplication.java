package fi.haagahelia.backend;

import java.security.KeyStore.Entry;
import java.time.LocalDateTime;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.context.annotation.Profile;

import fi.haagahelia.backend.model.Organization;
import fi.haagahelia.backend.model.Role;
import fi.haagahelia.backend.model.Roles;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.repositories.OrganizationRepository;
import fi.haagahelia.backend.repositories.RoleRepository;
import fi.haagahelia.backend.repositories.UserRepository;
import fi.haagahelia.backend.repositories.ProjectRepository;

@SpringBootApplication
public class BackendApplication {

    private static final Logger log = LoggerFactory.getLogger(BackendApplication.class);

    public static void main(String[] args) {
        SpringApplication.run(BackendApplication.class, args);
    }

    @Bean
    @Profile("dev") // Only run in dev profile
    public CommandLineRunner initializeData(
            UserRepository userRepository, 
            RoleRepository roleRepository,
            OrganizationRepository organizationRepository,
            ProjectRepository projectRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            log.info("Initializing development data...");

            // Create default organization if it doesn't exist
            Organization org = organizationRepository.findByOrganizationName("Default Organization")
                .orElseGet(() -> {
                    Organization newOrg = new Organization();
                    newOrg.setOrganizationName("Default Organization");
                    return organizationRepository.save(newOrg);
                });

            // Create roles if they don't exist
            Role employeeRole = roleRepository.findByRoleName("ROLE_USER")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setRoleName("ROLE_USER");
                    role.setRoleDescription("Employee role");
                    role.setRoles(Roles.EMPLOYEE);
                    return roleRepository.save(role);
                });

            Role employerRole = roleRepository.findByRoleName("ROLE_ADMIN")
                .orElseGet(() -> {
                    Role role = new Role();
                    role.setRoleName("ROLE_ADMIN");
                    role.setRoleDescription("Employer role");
                    role.setRoles(Roles.EMPLOYER);
                    return roleRepository.save(role);
                });

            // Create default employee user if it doesn't exist
            if (!userRepository.findByEmail("employee@test.com").isPresent()) {
                User defaultUser = new User();
                defaultUser.setUsername("employee");
                defaultUser.setEmail("employee@test.com");
                defaultUser.setPasswordHash(passwordEncoder.encode("employee"));
                defaultUser.setRole(employeeRole);
                defaultUser.setOrganization(org);
                defaultUser.setFirstname("Test");
                defaultUser.setLastname("Employee");
                userRepository.save(defaultUser);
                log.info("Created default employee user");
            }

            // Create admin user
        User adminUser = userRepository.findByEmail("admin@test.com")
            .orElseGet(() -> {
                User admin = new User();
                admin.setUsername("admin");
                admin.setEmail("admin@test.com");
                admin.setPasswordHash(passwordEncoder.encode("admin"));
                admin.setRole(employerRole);
                admin.setOrganization(org);
                admin.setFirstname("Admin");
                admin.setLastname("User");
                return userRepository.save(admin);
            });

            // Create data for test project
            projectRepository.findByProjectCode("123456")
                .orElseGet(() -> {
                    Project project = new Project();
                    project.setProjectCode("123456");
                    project.setProjectName("Hardcoded Test Project");
                    project.setCreatedBy(adminUser); // Set the creator as the admin user
                    project.setCreatedAt(LocalDateTime.now());
                    project.setProjectDescription("This is a hardcoded test project created by the admin user.");
                    return projectRepository.save(project);
                });

log.info("Created hardcoded project with admin user as creator");


            log.info("Development data initialization completed");
        };
    }
}
