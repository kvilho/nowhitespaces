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
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/permissions")
public class PermissionsRestController {

    @Autowired
    private PermissionsRepository permissionsRepository;

    // GET: Get all the permissions
    @Schema(description = "Get all permissions")
    @Tag(name = "permissions")
    @GetMapping
    public List<Permissions> getAllPermissions() {
        return permissionsRepository.findAll();
    }

    // GET: Get permissions by ID
    @Schema(description = "Get permissions by ID")
    @Tag(name = "permissions")
    @GetMapping("/{id}")
    public ResponseEntity<Permissions> getPermissionsById (@PathVariable Long id){
        Optional<Permissions> permissions = permissionsRepository.findById(id);
        return permissions.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST: Add new permissions
    @Schema(description = "Add new permissions")
    @Tag(name = "permissions")
    @PostMapping
    public ResponseEntity<Permissions> createPermissions(@RequestBody Permissions newPermissions) {
        Permissions savedPermissions = permissionsRepository.save(newPermissions);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedPermissions);
    }

    // PUT: Update permissions by ID
    @Schema(description = "Update permissions by ID")
    @Tag(name = "permissions")
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
    @Schema(description = "Delete permissions by ID")  
    @Tag(name = "permissions")
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