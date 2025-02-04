package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.Role;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

}
