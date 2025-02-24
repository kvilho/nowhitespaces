package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.Entry;

import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long>  {

    @Query("SELECT e FROM Entry e WHERE MONTH(e.entryStart) = :month AND YEAR(e.entryStart) = :year")
    List<Entry> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

}
