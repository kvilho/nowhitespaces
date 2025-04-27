package fi.haagahelia.backend.controllers;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import fi.haagahelia.backend.model.Entry;
import fi.haagahelia.backend.model.Status;
import fi.haagahelia.backend.repositories.EntryRepository;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.CrossOrigin;

import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.UserRepository;
import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.repositories.ProjectRepository;
import fi.haagahelia.backend.repositories.ProjectMemberRepository;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import fi.haagahelia.backend.security.CustomUserDetails;

@RestController
@RequestMapping("/api/entries")

@CrossOrigin(
    origins = {"http://localhost:5173", "https://hourbook-frontend-hourbook.2.rahtiapp.fi"},
    allowCredentials = "true",
    maxAge = 3600
)

public class EntryRestController {

    @Autowired
    private EntryRepository entryRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectMemberRepository projectMemberRepository;

    // GET: Get all entries with filters
    @Schema(description = "Get all entries with optional filters")
    @Tag(name = "entries")
    @GetMapping
    public List<Entry> getAllEntries(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year,
            @RequestParam(required = false) Long userId,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate,
            @RequestParam(required = false) Long organizationId) {
        
        if (month != null && year != null) {
            return entryRepository.findByMonthAndYear(month, year);
        }
        
        if (userId != null) {
            return entryRepository.findByUserId(userId);
        }
        
        if (status != null) {
            return entryRepository.findByStatus(Status.valueOf(status));
        }
        
        if (projectId != null) {
            return entryRepository.findByProjectId(projectId);
        }
        
        if (startDate != null && endDate != null) {
            DateTimeFormatter formatter = DateTimeFormatter.ISO_DATE_TIME;
            LocalDateTime start = LocalDateTime.parse(startDate, formatter);
            LocalDateTime end = LocalDateTime.parse(endDate, formatter);
            return entryRepository.findByDateRange(start, end);
        }
        
        if (organizationId != null) {
            return entryRepository.findByOrganizationId(organizationId);
        }
        
        return entryRepository.findAll();
    }

    // GET: Get pending entries for organization
    @Schema(description = "Get pending entries for organization")
    @Tag(name = "entries")
    @GetMapping("/pending/{organizationId}")
    public List<Entry> getPendingEntries(@PathVariable Long organizationId) {
        return entryRepository.findByOrganizationIdAndStatus(organizationId, Status.PENDING);
    }

    // GET: Get entry by ID
    @Schema(description = "Get entry by ID")
    @Tag(name = "entries")
    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById(@PathVariable Long id) {
        return entryRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // POST: Add new entry
    @Schema(description = "Create new entry")
    @Tag(name = "entries")
    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody Entry newEntry) {
        try {
            Optional<User> user = userRepository.findById(newEntry.getUserId());
            if (!user.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            Optional<Project> project = projectRepository.findById(newEntry.getProjectId());
            if (!project.isPresent()) {
                return ResponseEntity.notFound().build();
            }

            boolean isMember = projectMemberRepository.findByUserId(user.get().getId()).stream()
                .anyMatch(member -> member.getProject().getProjectId().equals(project.get().getProjectId()));

            if (!isMember) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
            }

            newEntry.setUser(user.get());
            newEntry.setProject(project.get());
            newEntry.setOrganization(user.get().getOrganization());
            newEntry.setStatus(Status.PENDING);
            
            Entry savedEntry = entryRepository.save(newEntry);
            return ResponseEntity.status(HttpStatus.CREATED).body(savedEntry);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    // PUT: Update entry by ID
    @Schema(description = "Update entry")
    @Tag(name = "entries")
    @PutMapping("/{id}")
    public ResponseEntity<Entry> updateEntry(@PathVariable Long id, @RequestBody Entry entryDetails) {
        return entryRepository.findById(id)
                .map(existingEntry -> {
                    existingEntry.setEntryStart(entryDetails.getEntryStart());
                    existingEntry.setEntryEnd(entryDetails.getEntryEnd());
                    existingEntry.setEntryDescription(entryDetails.getEntryDescription());
                    return ResponseEntity.ok(entryRepository.save(existingEntry));
                })
                .orElse(ResponseEntity.notFound().build());
    }
    
    // PUT: Update entry status
    @Schema(description = "Update entry status")
    @Tag(name = "entries")
    @PutMapping("/{id}/status")
    public ResponseEntity<Entry> updateEntryStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        Entry entry = entryRepository.findById(id)
                .orElse(null);
                
        if (entry == null) {
            return ResponseEntity.notFound().build();
        }

        boolean isEmployer = entry.getProject().getCreatedBy().getId().equals(currentUser.getUser().getId());
        if (!isEmployer) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        entry.setStatus(Status.valueOf(status));
        Entry updatedEntry = entryRepository.save(entry);
        return ResponseEntity.ok(updatedEntry);
    }

    // PUT: Bulk update entry statuses
    @Schema(description = "Bulk update entry statuses")
    @Tag(name = "entries")
    @PutMapping("/bulk-status")
    public ResponseEntity<List<Entry>> bulkUpdateEntryStatus(
            @RequestBody List<Long> entryIds,
            @RequestParam String status,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Entry> entries = entryRepository.findAllById(entryIds);
        boolean allEntriesFromSameProject = entries.stream()
            .map(Entry::getProject)
            .map(Project::getCreatedBy)
            .map(User::getId)
            .allMatch(id -> id.equals(currentUser.getUser().getId()));

        if (!allEntriesFromSameProject) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).build();
        }

        entries.forEach(entry -> entry.setStatus(Status.valueOf(status)));
        List<Entry> updatedEntries = entryRepository.saveAll(entries);
        return ResponseEntity.ok(updatedEntries);
    }

    // DELETE: Delete entry by ID
    @Schema(description = "Delete entry")
    @Tag(name = "entries")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        return entryRepository.findById(id)
                .map(entry -> {
                    entryRepository.delete(entry);
                    return ResponseEntity.ok().<Void>build();
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // GET: Get latest entries for current user
    @Schema(description = "Get latest entries for current user")
    @Tag(name = "entries")
    @GetMapping("/latest")
    public ResponseEntity<List<Entry>> getLatestEntries(
            @RequestParam(defaultValue = "5") int limit,
            @AuthenticationPrincipal CustomUserDetails currentUser) {
        
        if (currentUser == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        List<Entry> entries = entryRepository.findLatestByUserId(currentUser.getUser().getId());
        List<Entry> limitedEntries = entries.stream()
            .limit(limit)
            .collect(java.util.stream.Collectors.toList());
            
        return ResponseEntity.ok(limitedEntries);
    }
}
