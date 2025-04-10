package fi.haagahelia.backend.repositories;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import fi.haagahelia.backend.model.ProjectMember;

@Repository
public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {
    // Use the correct property name: project.projectId
    List<ProjectMember> findByProject_ProjectId(Long projectId);

    @Query("SELECT pm FROM ProjectMember pm JOIN FETCH pm.project WHERE pm.user.id = :userId")
    List<ProjectMember> findByUserId(@Param("userId") Long userId);
}
