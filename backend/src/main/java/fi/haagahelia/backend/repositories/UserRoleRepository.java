package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.UserRole;

@Repository
public interface UserRoleRepository extends JpaRepository<UserRole, Long> {

}
