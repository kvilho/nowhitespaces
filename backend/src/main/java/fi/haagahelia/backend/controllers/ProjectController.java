package fi.haagahelia.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PathVariable;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.security.CustomUserDetails;
import fi.haagahelia.backend.services.ProjectService;
import fi.haagahelia.backend.model.ProjectMember;
import fi.haagahelia.backend.model.Entry;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PutMapping;

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

    @GetMapping("/{id}")
    public ResponseEntity<Project> getProjectById(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(403).build();
        }

        try {
            Project project = projectService.getProjectById(id, currentUser.getUser());
            return ResponseEntity.ok(project);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/{id}/members")
    public ResponseEntity<List<ProjectMember>> getProjectMembers(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(403).build();
        }

        try {
            List<ProjectMember> members = projectService.getProjectMembers(id, currentUser.getUser());
            return ResponseEntity.ok(members);
        } catch (Exception e) {
            return ResponseEntity.status(404).build();
        }
    }

    @GetMapping("/{id}/entries")
    public ResponseEntity<?> getProjectEntries(@PathVariable Long id, @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(403).build();
        }

        try {
            List<Entry> entries = projectService.getProjectEntries(id, currentUser.getUser());
            return ResponseEntity.ok(entries);
        } catch (Exception e) {
            logger.error("Error getting project entries", e);
            return ResponseEntity.status(404).build();
        }
    }

    @DeleteMapping("/{projectId}/members/{memberId}")
    public ResponseEntity<?> removeProjectMember(
        @PathVariable Long projectId,
        @PathVariable Long memberId,
        @AuthenticationPrincipal CustomUserDetails currentUser
    ) {
        if (currentUser == null) {
            logger.warn("Unauthorized access attempt to remove member");
            return ResponseEntity.status(403).body("Unauthorized");
        }

        try {
            projectService.removeMemberFromProject(projectId, memberId, currentUser.getUser());
            return ResponseEntity.ok("Member removed successfully");
        } catch (Exception e) {
            logger.error("Error removing project member", e);
            return ResponseEntity.status(400).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<Project> updateProject(@PathVariable Long id, @RequestBody Project updatedProject, @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(403).build();
        }
        return projectService.updateProject(id, updatedProject)
            .map(project -> ResponseEntity.ok().body(project))
            .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProject(@PathVariable Long id) {
        if (projectService.deleteProject(id)) {
            return ResponseEntity.noContent().build();
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}

