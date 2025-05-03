package fi.haagahelia.backend.controllers;

import java.security.Principal;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.UserRepository;
import fi.haagahelia.backend.services.UserProfileService;
import fi.haagahelia.backend.dto.PasswordChangeRequest;
import fi.haagahelia.backend.dto.HourSummaryDTO;
import fi.haagahelia.backend.security.CustomUserDetails;
import fi.haagahelia.backend.services.HourSummaryService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;
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

    @Autowired
    private UserProfileService userProfileService;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Schema(description = "Get all users")
    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @Schema(description = "Get user by ID")
    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        return user.map(ResponseEntity::ok)
            .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @Operation(summary = "Get current user's profile")
    @GetMapping("/profile")
    public ResponseEntity<User> getCurrentUserProfile(@AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        return ResponseEntity.ok(currentUser.getUser());
    }

    @Schema(description = "Add new user")
    @PostMapping
    public ResponseEntity<User> createUser(@RequestBody User newUser) {
        User savedUser = userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedUser);
    }

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

    @Operation(summary = "Update current user's profile")
    @PutMapping("/profile")
    public ResponseEntity<User> updateCurrentUserProfile(
            @RequestBody User userDetails,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        User existingUser = currentUser.getUser();
        existingUser.setFirstname(userDetails.getFirstname());
        existingUser.setLastname(userDetails.getLastname());
        existingUser.setPhone(userDetails.getPhone());

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

    @Operation(summary = "Change current user's password")
    @PutMapping("/profile/password")
    public ResponseEntity<?> changeUserPassword(@RequestBody PasswordChangeRequest request, Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userProfileService.getUserProfileByUsername(principal.getName());
        if (!passwordEncoder.matches(request.getCurrentPassword(), user.getPasswordHash())) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Current password is incorrect.");
        }
        user.setPasswordHash(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }

    @Operation(summary = "Delete current user's account")
    @DeleteMapping("/profile")
    public ResponseEntity<?> deleteUserAccount(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Unauthorized");
        }

        User user = userProfileService.getUserProfileByUsername(principal.getName());
        userRepository.delete(user);
        return ResponseEntity.ok("Account deleted successfully.");
    }
}
