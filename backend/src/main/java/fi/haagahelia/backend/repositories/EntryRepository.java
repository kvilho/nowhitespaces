package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.Entry;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long>  {

}
