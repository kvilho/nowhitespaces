package fi.haagahelia.backend.controllers;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.security.CustomUserDetails;
import fi.haagahelia.backend.services.ProjectService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping("/create")
    public ResponseEntity<Project> createProject(@RequestBody Project project,
                                                 @AuthenticationPrincipal CustomUserDetails currentUser) {
        // Extract the authenticated user from CustomUserDetails
        User user = currentUser.getUser();
        Project created = projectService.createProject(project, user);
        return ResponseEntity.ok(created);
    }

    @PostMapping("/join")
    public ResponseEntity<String> joinProject(@RequestParam String projectCode,
                                              @AuthenticationPrincipal CustomUserDetails currentUser) {
        // Extract the authenticated user from CustomUserDetails
        User user = currentUser.getUser();
        projectService.joinProjectByCode(projectCode, user);
        return ResponseEntity.ok("Joined project successfully");
    }
}

