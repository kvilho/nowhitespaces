package fi.haagahelia.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

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
import fi.haagahelia.backend.services.HourSummaryService;
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

    @Operation(summary = "Update current user's profile")
    @PutMapping("/profile")
    public ResponseEntity<User> updateCurrentUserProfile(
            @RequestBody User userDetails,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User existingUser = currentUser.getUser();
        
        // Only allow updating specific fields
        existingUser.setFirstname(userDetails.getFirstname());
        existingUser.setLastname(userDetails.getLastname());
        existingUser.setPhone(userDetails.getPhone());
        
        // Only update password if a new one is provided
        if (userDetails.getPasswordHash() != null && !userDetails.getPasswordHash().isEmpty()) {
            existingUser.setPasswordHash(userDetails.getPasswordHash());
        }

        User updatedUser = userRepository.save(existingUser);
        return ResponseEntity.ok(updatedUser);
    }

    @Operation(summary = "Upload profile picture")
    @PostMapping("/profile/picture")
    public ResponseEntity<Void> uploadProfilePicture(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        try {
            User user = currentUser.getUser();
            user.setProfilePicture(file.getBytes());
            userRepository.save(user);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    @Operation(summary = "Get profile picture")
    @GetMapping(value = "/profile/picture", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getProfilePicture(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User user = currentUser.getUser();
        if (user.getProfilePicture() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(user.getProfilePicture());
    }

    @Operation(summary = "Get user's profile picture")
    @GetMapping(value = "/{userId}/picture", produces = MediaType.IMAGE_JPEG_VALUE)
    public ResponseEntity<byte[]> getUserProfilePicture(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty() || user.get().getProfilePicture() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.IMAGE_JPEG)
                .body(user.get().getProfilePicture());
    }
}