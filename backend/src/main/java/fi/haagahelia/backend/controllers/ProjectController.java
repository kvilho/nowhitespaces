package fi.haagahelia.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.security.CustomUserDetails;
import fi.haagahelia.backend.services.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = {"http://localhost:5173", "https://hourbook-frontend-hourbook.2.rahtiapp.fi"}, allowCredentials = "true")
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);
    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @GetMapping("/my-projects")
    public ResponseEntity<List<Project>> getMyProjects(@AuthenticationPrincipal CustomUserDetails currentUser) {
        logger.debug("Getting projects for user: {}", currentUser != null ? currentUser.getUsername() : "null");
        
        if (currentUser == null) {
            logger.warn("No authenticated user found");
            return ResponseEntity.status(403).build();
        }
        
        try {
            User user = currentUser.getUser();
            List<Project> projects = projectService.getUserProjects(user);
            logger.debug("Found {} projects for user", projects.size());
            return ResponseEntity.ok(projects);
        } catch (Exception e) {
            logger.error("Error getting user projects", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody Project project,
                                               @AuthenticationPrincipal CustomUserDetails currentUser) {
        logger.debug("Creating project with user: {}", currentUser != null ? currentUser.getUsername() : "null");
        
        if (currentUser == null) {
            logger.warn("No authenticated user found");
            return ResponseEntity.status(403).build();
        }
        
        try {
            User user = currentUser.getUser();
            logger.debug("User found: {}", user.getEmail());
            
            Project created = projectService.createProject(project, user);
            logger.debug("Project created successfully: {}", created.getProjectCode());
            
            return ResponseEntity.ok(created);
        } catch (Exception e) {
            logger.error("Error creating project", e);
            return ResponseEntity.status(500).build();
        }
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinProject(@RequestParam String projectCode,
                                            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(403).build();
        }
        
        User user = currentUser.getUser();
        projectService.joinProjectByCode(projectCode, user);
        return ResponseEntity.ok("Joined project successfully");
    }
}

