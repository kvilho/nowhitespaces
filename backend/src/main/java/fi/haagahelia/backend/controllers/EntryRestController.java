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

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("/api/entries")
public class EntryRestController {

    @Autowired
    private EntryRepository entryRepository;

    // GET: Get all the entries
    @GetMapping
    public List<Entry> getAllEntries() {
        return entryRepository.findAll();
    }

    // GET: Get entry by ID
    @GetMapping("/{id}")
    public ResponseEntity<Entry> getEntryById (@PathVariable Long id){
        Optional<Entry> entry = entryRepository.findById(id);
        return entry.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST: Add new entry
    @PostMapping
    public ResponseEntity<Entry> createEntry(@RequestBody Entry newEntry) {
        Entry savedEntry = entryRepository.save(newEntry);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedEntry);
    }

    // PUT: Update entry by ID
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
