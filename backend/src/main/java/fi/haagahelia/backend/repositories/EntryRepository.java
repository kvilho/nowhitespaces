package fi.haagahelia.backend.repositories;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.Entry;
import fi.haagahelia.backend.model.Status;
import fi.haagahelia.backend.model.Project;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface EntryRepository extends JpaRepository<Entry, Long>  {

    @Query("SELECT e FROM Entry e WHERE MONTH(e.entryStart) = :month AND YEAR(e.entryStart) = :year")
    List<Entry> findByMonthAndYear(@Param("month") int month, @Param("year") int year);

    @Query("SELECT e FROM Entry e WHERE e.user.id = :userId")
    List<Entry> findByUserId(@Param("userId") Long userId);

    List<Entry> findByStatus(Status status);

    @Query("SELECT e FROM Entry e WHERE e.project.id = :projectId")
    List<Entry> findByProjectId(@Param("projectId") Long projectId);

    @Query("SELECT e FROM Entry e WHERE e.entryStart BETWEEN :startDate AND :endDate")
    List<Entry> findByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT e FROM Entry e WHERE e.user.organization.organizationId = :organizationId")
    List<Entry> findByOrganizationId(@Param("organizationId") Long organizationId);

    @Query("SELECT e FROM Entry e WHERE e.user.organization.organizationId = :organizationId AND e.status = :status")
    List<Entry> findByOrganizationIdAndStatus(@Param("organizationId") Long organizationId, @Param("status") Status status);

    List<Entry> findByProject(Project project);
}
