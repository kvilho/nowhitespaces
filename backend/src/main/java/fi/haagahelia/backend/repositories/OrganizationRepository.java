package fi.haagahelia.backend.repositories;

import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.Organization;

@Repository
public interface OrganizationRepository extends JpaRepository<Organization, Long>{
    Optional<Organization> findByOrganizationName(String organizationName);
}
