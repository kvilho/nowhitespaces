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
    public CommandLineRunner createStarterData(
        UserRepository userRepository,
        OrganizationRepository organizationRepository,
        RoleRepository roleRepository,
        PasswordEncoder passwordEncoder
    ) {
        return (args) -> {
            log.info("Creating initial data...");

            // Organization
            Organization organization1 = new Organization(null, "PajaRy");
            organizationRepository.save(organization1);
            Organization organization2 = new Organization(null, "Hirvi and the Headlights");
            organizationRepository.save(organization2);

            // Role
            Role role1 = new Role(null, "Employer", "Employer", Roles.EMPLOYER);
            roleRepository.save(role1);
            Role role2 = new Role(null, "Employee", "Employee", Roles.EMPLOYEE);
            roleRepository.save(role2);

            
            // User
            User user1 = new User("Employer", "employer@gmail.com", passwordEncoder.encode("employer"), role1, organization1);
            userRepository.save(user1);
            User user2 = new User("Employee", "employee@gmail.com", passwordEncoder.encode("employee"), role2, organization2);
            userRepository.save(user2);
            

            log.info("Sample data created successfully.");
        };
    }
}
