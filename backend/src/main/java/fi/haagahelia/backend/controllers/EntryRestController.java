package fi.haagahelia.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fi.haagahelia.backend.model.Entry;
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

    // GET: Get all the entries
    @Schema(description = "Get all entries with optional month/year filter")
    @Tag(name = "entries")
    @GetMapping
    public List<Entry> getAllEntries(
            @RequestParam(required = false) Integer month,
            @RequestParam(required = false) Integer year) {
        if (month != null && year != null) {
            // Add method to repository to filter by month and year
            return entryRepository.findByMonthAndYear(month, year);
        }
        return entryRepository.findAll();
    }

    // GET: Get entry by ID
    @Schema(description = "Get entry by ID")
    @Tag(name = "entries")
    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById (@PathVariable Long id){
        Optional<Entry> entry = entryRepository.findById(id);
        return entry.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST: Add new entry
    @Schema(description = "Add new entry")
    @Tag(name = "entries")
    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody Entry newEntry) {
        try {
            // Find the user first
            Optional<User> user = userRepository.findById(newEntry.getUserId());
            if (user.isPresent()) {
                newEntry.setUser(user.get());  // Set the actual user entity
                Entry savedEntry = entryRepository.save(newEntry);
                return ResponseEntity.status(HttpStatus.CREATED).body(savedEntry);
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }
        } catch (Exception e) {
            System.err.println("Error saving entry: " + e.getMessage());
            throw e;
        }
    }

    // PUT: Update entry by ID
    @Schema(description = "Update entry by ID")
    @Tag(name = "entries")
    @PutMapping("/{id}")
    public ResponseEntity<Entry> updateEntry(@PathVariable Long id, @RequestBody Entry entryDetails) {
        Optional<Entry> optionalEntry = entryRepository.findById(id);

        if (optionalEntry.isPresent()) {
            Entry existingEntry = optionalEntry.get();
            existingEntry.setEntryStart(entryDetails.getEntryStart());
            existingEntry.setEntryEnd(entryDetails.getEntryEnd());
            existingEntry.setEntryDescription(entryDetails.getEntryDescription());
            
            Entry updatedEntry = entryRepository.save(existingEntry);
            return ResponseEntity.ok(updatedEntry);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
    
    // DELETE: Delete entry by ID
    @Schema(description = "Delete entry by ID")
    @Tag(name = "entries")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteEntry(@PathVariable Long id) {
        if (entryRepository.existsById(id)) {
            entryRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
