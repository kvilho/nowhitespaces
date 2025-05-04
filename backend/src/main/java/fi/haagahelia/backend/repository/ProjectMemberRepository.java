package fi.haagahelia.backend.repository;

import fi.haagahelia.backend.model.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    @Query("SELECT pm FROM ProjectMember pm WHERE pm.project.projectId = :projectId")
    List<ProjectMember> findByProjectId(@Param("projectId") Long projectId);
}