package fi.haagahelia.backend;

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

            // Create admin user if it doesn't exist
            if (!userRepository.findByEmail("admin@test.com").isPresent()) {
                User adminUser = new User();
                adminUser.setUsername("admin");
                adminUser.setEmail("admin@test.com");
                adminUser.setPasswordHash(passwordEncoder.encode("admin"));
                adminUser.setRole(employerRole);
                adminUser.setOrganization(org);
                adminUser.setFirstname("Admin");
                adminUser.setLastname("User");
                userRepository.save(adminUser);
                log.info("Created admin user");
            }

            log.info("Development data initialization completed");
        };
    }

    @Bean
public CommandLineRunner ensureDefaultRolesExist(RoleRepository roleRepository) {
    return args -> {
        if (roleRepository.findByRoleName("ROLE_USER").isEmpty()) {
            Role userRole = new Role();
            userRole.setRoleName("ROLE_USER");
            userRole.setRoleDescription("Default role for regular users");
            // Do not set Roles enum here (it's only for project-level roles)
            roleRepository.save(userRole);
        }

        if (roleRepository.findByRoleName("ROLE_ADMIN").isEmpty()) {
            Role adminRole = new Role();
            adminRole.setRoleName("ROLE_ADMIN");
            adminRole.setRoleDescription("Default role for administrators");
            // Do not set Roles enum here
            roleRepository.save(adminRole);
        }
    };
}
}
