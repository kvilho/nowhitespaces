package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
}
