package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.Permissions;

@Repository
public interface PermissionsRepository extends JpaRepository<Permissions, Long> {

}
