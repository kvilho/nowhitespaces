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

import fi.haagahelia.backend.model.Role;
import fi.haagahelia.backend.repositories.RoleRepository;

@RestController
@RequestMapping("/api/role")
public class RoleRestController {
    
    @Autowired
    private RoleRepository roleRepository;

    // GET: Get all the roles
    @GetMapping
    public List<Role> getAllRole() {
        return roleRepository.findAll();
    }

    // GET: Get role by ID
    @GetMapping("/id")
    public ResponseEntity<Role> getRoleById (@PathVariable Long id){
        Optional<Role> role = roleRepository.findById(id);
        return role.map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    // POST: Add new roles
    @PostMapping
    public ResponseEntity<Role> createRole(@RequestBody Role newRole) {
        Role savedRole = roleRepository.save(newRole);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedRole);
    }

    // PUT: Update role by ID
    @PutMapping("/{id}")
    public ResponseEntity<Role> updateRole(@PathVariable Long id, @RequestBody Role roleDetails) {
        Optional<Role> optionalRole = roleRepository.findById(id);

        if (optionalRole.isPresent()) {
            Role existingRole = optionalRole.get();
            existingRole.setRoleName(roleDetails.getRoleName());
            existingRole.setRoleDescription(roleDetails.getRoleDescription());
            
            Role updatedRole = roleRepository.save(existingRole);
            return ResponseEntity.ok(updatedRole);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // DELETE: Delete role by ID
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteRole(@PathVariable Long id) {
        if (roleRepository.existsById(id)) {
            roleRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}
