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

import fi.haagahelia.backend.model.Organization;
import fi.haagahelia.backend.repositories.OrganizationRepository;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.tags.Tag;

@RestController
@RequestMapping("/api/organizations")
public class OrganizationRestController {

    @Autowired
    private  OrganizationRepository organizationRepository;

    // GET: Get all organizations
    
    @Schema(description = "Get all organizations") 
    @Tag(name = "organizations")
    @GetMapping
    public List<Organization> getAllOrganizations() {
        return organizationRepository.findAll();
    }

    // GET: Get organization by ID
    @Schema(description = "Get organization by ID") 
    @Tag(name = "organizations")
    @GetMapping("/{id}")
    public ResponseEntity<Organization> getOrganization(@PathVariable Long id) {
        Optional<Organization> organization = organizationRepository.findById(id);
        return organization.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

     // POST: Add new organization
    @Schema(description = "Add new organization") 
    @Tag(name = "organizations")
    @PostMapping
    public ResponseEntity<Organization> createOrganization(@RequestBody Organization newOrganization) {
        Organization savedOrganization = organizationRepository.save(newOrganization);
        return ResponseEntity.status(HttpStatus.CREATED).body(savedOrganization);
    }
    
    // PUT: Update organization by ID
    @PutMapping("/{id}")
    @Schema(description = "Update organization by ID")
    @Tag(name = "organizations")
    public ResponseEntity<Organization> updateOrganization(@PathVariable Long id, @RequestBody Organization organizationDetails) {
        Optional<Organization> optionalOrganization = organizationRepository.findById(id);

        if (optionalOrganization.isPresent()) {
            Organization existingOrganization = optionalOrganization.get();
            existingOrganization.setOrganizationName(organizationDetails.getOrganizationName());

            Organization updatedOrganization = organizationRepository.save(existingOrganization);
            return ResponseEntity.ok(updatedOrganization);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    // DELETE: Delete organization by ID
    @Schema(description = "Delete organization by ID")
    @Tag(name = "organizations")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteOrganization(@PathVariable Long id) {
        if (organizationRepository.existsById(id)) {
            organizationRepository.deleteById(id);
            return ResponseEntity.status(HttpStatus.NO_CONTENT).build();
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }
}