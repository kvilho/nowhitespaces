package fi.haagahelia.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.UserRepository;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

/* 
import fi.haagahelia.backend.repositories.RoleRepository;
import fi.haagahelia.backend.repositories.OrganizationRepository; 
*/

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

import fi.haagahelia.backend.dto.HourSummaryDTO;
import fi.haagahelia.backend.security.CustomUserDetails;
import fi.haagahelia.backend.service.HourSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;

@RestController
@RequestMapping("/api/users")
@Tag(name = "users")
public class UserRestController {
    
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private HourSummaryService hourSummaryService;

    /*  VIITTAUKSET ROOLI JA ORGANISAATIO REPOSITOREIHIN VALMIINA KUN NIITÄ TARVITAAN
    
    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private OrganizationRepository organizationRepository; '
    
    */
    
    // GET: Get all users
    @Schema (description = "Get all users")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    // GET: Get users by ID
    @Schema(description = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById (@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // GET: Get current user's profile
    @Operation(summary = "Get current user's profile")
    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(currentUser.getUser());
    }

    // POST: Add new user
    @Schema(description = "Add new user")
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

    // PUT: Update user by ID
    @Schema(description = "Update user by ID")
    @PutMapping("/{id}")
    public ResponseEntity<User> updateUser(@PathVariable Long id, @RequestBody User userDetails) {
        Optional<User> optionalUser = userRepository.findById(id);

        if (optionalUser.isPresent()) {
            User existingUser = optionalUser.get();
            existingUser.setUsername(userDetails.getUsername());
            existingUser.setFirstname(userDetails.getFirstname());
            existingUser.setLastname(userDetails.getLastname());
            existingUser.setEmail(userDetails.getEmail());
            existingUser.setPasswordHash(userDetails.getPasswordHash());
            existingUser.setPhone(userDetails.getPhone());

            User updatedUser = userRepository.save(existingUser);
            return ResponseEntity.ok(updatedUser);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // DELETE: Delete user by ID
    @Schema(description = "Delete user by ID")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        if (userRepository.existsById(id)) {
            userRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @Operation(summary = "Get user's hour summary")
    @GetMapping("/profile/hours-summary")
    public ResponseEntity<HourSummaryDTO> getUserHourSummary(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(hourSummaryService.getUserHourSummary(currentUser.getUser().getId()));
    }

    @Operation(summary = "Get user's hour summary (Admin only)")
    @GetMapping("/{userId}/hours-summary")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<HourSummaryDTO> getUserHourSummaryAdmin(@PathVariable Long userId) {
        return ResponseEntity.ok(hourSummaryService.getUserHourSummary(userId));
    }
}