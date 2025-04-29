package fi.haagahelia.backend;

import fi.haagahelia.backend.model.*;
import fi.haagahelia.backend.repositories.*;
import fi.haagahelia.backend.services.ProjectService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.*;

import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

public class ProjectServiceTest {

    // Mocking the repositories and services
    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private ProjectMemberRepository projectMemberRepository;

    @Mock
    private EntryRepository entryRepository;

    @InjectMocks
    private ProjectService projectService;

    private User testUser;
    private Project testProject;

    // Setup method to initialize common test data
    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);  // Initialize mocks

        // Create a test user
        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        // Create a test project
        testProject = new Project();
        testProject.setProjectId(1L);
        testProject.setProjectName("Test Project");
        testProject.setCreatedBy(testUser);
        testProject.setMembers(new ArrayList<>());
    }

    /**
     * Test case for creating a new project.
     * Verifies that a project is created successfully and that repositories' methods are called.
     */
    @Test
    void testCreateProject() {
        // Mock behavior for saving a project and checking if project code already exists
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);
        when(projectRepository.findByProjectCode(anyString())).thenReturn(Optional.empty());

        // Call the create project method
        Project createdProject = projectService.createProject(new Project(), testUser);

        // Assertions to verify project is created and methods were invoked
        assertNotNull(createdProject);
        verify(projectRepository).save(any(Project.class));  // Verifying save method was called
        verify(projectMemberRepository).save(any(ProjectMember.class));  // Verifying member save method was called
    }

    /**
     * Test case where a user successfully joins a project by code.
     * Verifies that a project member is added correctly.
     */
    @Test
    void testJoinProjectByCodeSuccess() {
        // Mock behavior for finding a project by its code
        when(projectRepository.findByProjectCode("123456")).thenReturn(Optional.of(testProject));

        // Call join project method
        projectService.joinProjectByCode("123456", testUser);

        // Verify that the project member is saved to the repository
        verify(projectMemberRepository).save(any(ProjectMember.class));
    }

    /**
     * Test case where a user attempts to join a project they are already a member of.
     * This should throw an exception as the user is already a member.
     */
    @Test
    void testJoinProjectByCodeAlreadyMemberThrows() {
        // Mock behavior for an existing member
        ProjectMember member = new ProjectMember();
        member.setUser(testUser);
        testProject.setMembers(List.of(member));

        when(projectRepository.findByProjectCode("123456")).thenReturn(Optional.of(testProject));

        // Verify that an exception is thrown when trying to add the user again
        assertThrows(RuntimeException.class, () -> projectService.joinProjectByCode("123456", testUser));
    }

    /**
     * Test case for fetching a project by ID when the user is a member.
     * Verifies that the project is correctly returned if the user is part of it.
     */
    @Test
    void testGetProjectByIdAsMember() {
        // Add the test user as a member of the project
        ProjectMember member = new ProjectMember();
        member.setUser(testUser);
        testProject.setMembers(List.of(member));

        // Mock behavior for finding the project by ID
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        // Call the method to get the project
        Project project = projectService.getProjectById(1L, testUser);

        // Assert that the correct project is returned
        assertEquals(testProject, project);
    }

    /**
     * Test case for fetching a project by ID when the user is not a member.
     * This should throw an exception because the user is not part of the project.
     */
    @Test
    void testGetProjectByIdAsNonMemberThrows() {
        // Mock behavior for finding the project by ID
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        // Verify that an exception is thrown when a non-member tries to access the project
        assertThrows(RuntimeException.class, () -> projectService.getProjectById(1L, testUser));
    }

    /**
     * Test case for getting the list of members in a project.
     * Verifies that the correct members are returned.
     */
    @Test
    void testGetProjectMembers() {
        // Add the test user as a project member
        ProjectMember member = new ProjectMember();
        member.setUser(testUser);
        testProject.setMembers(List.of(member));

        // Mock behavior for finding project members
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectMemberRepository.findByProject(testProject)).thenReturn(List.of(member));

        // Call the method to get project members
        List<ProjectMember> members = projectService.getProjectMembers(1L, testUser);

        // Assert that the number of members is correct
        assertEquals(1, members.size());
    }

    /**
     * Test case for getting entries of a project.
     * Verifies that the correct entries are returned for a given project.
     */
    @Test
    void testGetProjectEntries() {
        // Add the test user as a project member
        ProjectMember member = new ProjectMember();
        member.setUser(testUser);
        testProject.setMembers(List.of(member));

        // Create a project entry
        Entry entry = new Entry();
        entry.setProject(testProject);

        // Mock behavior for fetching project entries
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectMemberRepository.findByProjectAndUser(testProject, testUser)).thenReturn(Optional.of(member));
        when(entryRepository.findByProject(testProject)).thenReturn(List.of(entry));

        // Call the method to get project entries
        List<Entry> entries = projectService.getProjectEntries(1L, testUser);

        // Assert that the correct number of entries is returned
        assertEquals(1, entries.size());
    }

    /**
     * Test case for removing a member from the project as the creator.
     * Verifies that a creator can remove members and that the correct repository methods are called.
     */
    @Test
    void testRemoveMemberFromProjectAsCreator() {
        // Setup project with a member to remove
        ProjectMember memberToRemove = new ProjectMember();
        memberToRemove.setProjectMemberId(2L);
        User memberUser = new User();
        memberUser.setId(2L);
        memberToRemove.setUser(memberUser);

        Project testProject = new Project();
        testProject.setProjectId(1L); 
        testProject.setProjectCode("P12345");
        testProject.setProjectName("Test Project");

        User creatorUser = new User();
        creatorUser.setId(1L);

        testProject.setCreatedBy(creatorUser);
        testProject.setMembers(new ArrayList<>());

        User memberUser = new User();
        memberUser.setId(2L);

        ProjectMember memberToRemove = new ProjectMember();
        memberToRemove.setProjectMemberId(2L); // Sama ID jota haemme
        memberToRemove.setUser(memberUser);
        memberToRemove.setProject(testProject);

        // Setup creator member
        ProjectMember creatorProjectMember = new ProjectMember();
        creatorProjectMember.setProjectMemberId(1L);
        creatorProjectMember.setUser(creatorUser);
        creatorProjectMember.setProject(testProject);

        testProject.getMembers().add(creatorProjectMember);
        testProject.getMembers().add(memberToRemove);

        // Mock behavior for project and project member repositories
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectMemberRepository.findById(2L)).thenReturn(Optional.of(memberToRemove));

        // Call method to remove a member
        projectService.removeMemberFromProject(1L, 2L, creatorUser);

        // Verify that the member was deleted from the repository
        verify(projectMemberRepository, times(1)).delete(memberToRemove);
    }



    /**
     * Test case for removing a member from the project as a non-creator.
     * Verifies that a non-creator cannot remove a member from the project.
     */
    @Test
    void testRemoveMemberFromProjectAsNonCreatorThrows() {
        // Setup user who is not the creator
        User notCreator = new User();
        notCreator.setId(999L);
        testProject.setMembers(new ArrayList<>());

        // Mock behavior for project repository
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));

        // Verify that an exception is thrown when a non-creator tries to remove a member
        assertThrows(RuntimeException.class, () -> projectService.removeMemberFromProject(1L, 2L, notCreator));
    }

    /**
     * Test case for getting all projects of a user.
     * Verifies that the method returns the correct list of projects the user is part of.
     */
    @Test
    void testGetUserProjects() {
        // Add test user to the project as a member
        ProjectMember membership = new ProjectMember();
        membership.setProject(testProject);

        // Mock behavior to return the user's projects
        when(projectMemberRepository.findByUserId(1L)).thenReturn(List.of(membership));

        // Call the method to get user projects
        List<Project> projects = projectService.getUserProjects(testUser);

        // Assert that the number of projects returned is correct
        assertEquals(1, projects.size());
    }

    /**
     * Test case for updating a project.
     * Verifies that a project is successfully updated and saved.
     */
    @Test
    void testUpdateProjectSuccess() {
        // Create an updated project object
        Project updatedProject = new Project();
        updatedProject.setProjectName("Updated Name");
        updatedProject.setProjectDescription("Updated Desc");

        // Mock behavior for project repository
        when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
        when(projectRepository.save(any(Project.class))).thenReturn(testProject);

        // Call the update method
        Optional<Project> result = projectService.updateProject(1L, updatedProject);

        // Assert that the project was updated successfully
        assertTrue(result.isPresent());
        verify(projectRepository).save(any(Project.class));  // Verify save was called
    }

    /**
     * Test case for deleting a project successfully.
     * Verifies that a project is deleted and the repository method is called.
     */
    @Test
    void testDeleteProjectSuccess() {
        // Mock behavior for checking project existence
        when(projectRepository.existsById(1L)).thenReturn(true);

        // Call delete method
        boolean result = projectService.deleteProject(1L);

        // Assert that the project is deleted
        assertTrue(result);
        verify(projectRepository).deleteById(1L);  // Verify delete method was called
    }

    /**
     * Test case for attempting to delete a project that doesn't exist.
     * Verifies that the project is not deleted and the method returns false.
     */
    @Test
    void testDeleteProjectNotFound() {
        // Mock behavior for non-existing project
        when(projectRepository.existsById(1L)).thenReturn(false);

        // Call delete method
        boolean result = projectService.deleteProject(1L);

        // Assert that the project deletion failed
        assertFalse(result);
    }
}