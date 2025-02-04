package fi.haagahelia.backend.controllers;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fi.haagahelia.backend.model.Permissions;
import fi.haagahelia.backend.repositories.PermissionsRepository;

@RestController
@RequestMapping("/api/permissions")
public class PermissionsRestController {

    @Autowired
    private PermissionsRepository permissionsRepository;

    // GET: Get all the permissions
    @GetMapping
    public List<Permissions> getAllPermissions() {
        return permissionsRepository.findAll();
    }

    // GET: Get permissions by ID
    @GetMapping("/{id}")
    public ResponseEntity<Permissions> getPermissionsById (@PathVariable Long id){
        Optional<Permissions> permissions = permissionsRepository.findById(id);
        return permissions.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST: Add new permissions
    @PostMapping
    public ResponseEntity<Permissions> createPermissions(@RequestBody Permissions newPermissions) {
        Permissions savedPermissions = permissionsRepository.save(newPermissions);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPermissions);
    }

    // PUT: Update permissions by ID
    @PutMapping("/{id}")
    public ResponseEntity<Permissions> updatePermissions(@PathVariable Long id, @RequestBody Permissions permissionsDetails) {
        Optional<Permissions> optionalPermissions = permissionsRepository.findById(id);

        if (optionalPermissions.isPresent()) {
            Permissions existingPermissions = optionalPermissions.get();
            existingPermissions.setPermissionsDescription(permissionsDetails.getPermissionsDescription());
            
            Permissions updatedPermissions = permissionsRepository.save(existingPermissions);
            return ResponseEntity.ok(updatedPermissions);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // DELETE: Delete permissions by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePermissions(@PathVariable Long id) {
        if (permissionsRepository.existsById(id)) {
            permissionsRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}