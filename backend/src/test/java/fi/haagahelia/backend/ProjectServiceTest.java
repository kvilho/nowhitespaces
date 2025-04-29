// package fi.haagahelia.backend;

// import fi.haagahelia.backend.model.*;
// import fi.haagahelia.backend.repositories.*;
// import fi.haagahelia.backend.services.ProjectService;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.mockito.*;

// import java.util.*;

// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.ArgumentMatchers.anyString;
// import static org.mockito.Mockito.*;

// public class ProjectServiceTest {

//     @Mock
//     private ProjectRepository projectRepository;

//     @Mock
//     private ProjectMemberRepository projectMemberRepository;

//     @Mock
//     private EntryRepository entryRepository;

//     @InjectMocks
//     private ProjectService projectService;

//     private User testUser;
//     private Project testProject;

//     @BeforeEach
//     void setUp() {
//         MockitoAnnotations.openMocks(this);

//         testUser = new User();
//         testUser.setId(1L);
//         testUser.setUsername("testuser");

//         testProject = new Project();
//         testProject.setProjectId(1L);
//         testProject.setProjectName("Test Project");
//         testProject.setCreatedBy(testUser);
//         testProject.setMembers(new ArrayList<>());
//     }

//     @Test
//     void testCreateProject() {
//         when(projectRepository.save(any(Project.class))).thenReturn(testProject);
//         when(projectRepository.findByProjectCode(anyString())).thenReturn(Optional.empty());
//         Project createdProject = projectService.createProject(new Project(), testUser);
//         assertNotNull(createdProject);
//         verify(projectRepository).save(any(Project.class));
//         verify(projectMemberRepository).save(any(ProjectMember.class));
//     }

//     @Test
//     void testJoinProjectByCodeSuccess() {
//         when(projectRepository.findByProjectCode("123456")).thenReturn(Optional.of(testProject));
//         projectService.joinProjectByCode("123456", testUser);
//         verify(projectMemberRepository).save(any(ProjectMember.class));
//     }

//     @Test
//     void testJoinProjectByCodeAlreadyMemberThrows() {
//         ProjectMember member = new ProjectMember();
//         member.setUser(testUser);
//         testProject.setMembers(List.of(member));
//         when(projectRepository.findByProjectCode("123456")).thenReturn(Optional.of(testProject));
//         assertThrows(RuntimeException.class, () -> projectService.joinProjectByCode("123456", testUser));
//     }

//     @Test
//     void testGetProjectByIdAsMember() {
//         ProjectMember member = new ProjectMember();
//         member.setUser(testUser);
//         testProject.setMembers(List.of(member));
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         Project project = projectService.getProjectById(1L, testUser);
//         assertEquals(testProject, project);
//     }

//     @Test
//     void testGetProjectByIdAsNonMemberThrows() {
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         assertThrows(RuntimeException.class, () -> projectService.getProjectById(1L, testUser));
//     }

//     @Test
//     void testGetProjectMembers() {
//         ProjectMember member = new ProjectMember();
//         member.setUser(testUser);
//         testProject.setMembers(List.of(member));
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         when(projectMemberRepository.findByProject(testProject)).thenReturn(List.of(member));
//         List<ProjectMember> members = projectService.getProjectMembers(1L, testUser);
//         assertEquals(1, members.size());
//     }

//     @Test
//     void testGetProjectEntries() {
//         ProjectMember member = new ProjectMember();
//         member.setUser(testUser);
//         testProject.setMembers(List.of(member));
//         Entry entry = new Entry();
//         entry.setProject(testProject);
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         when(projectMemberRepository.findByProjectAndUser(testProject, testUser)).thenReturn(Optional.of(member));
//         when(entryRepository.findByProject(testProject)).thenReturn(List.of(entry));
//         List<Entry> entries = projectService.getProjectEntries(1L, testUser);
//         assertEquals(1, entries.size());
//     }

//     @Test
//     void testRemoveMemberFromProjectAsCreator() {
//         ProjectMember memberToRemove = new ProjectMember();
//         memberToRemove.setProjectMemberId(2L);
//         User memberUser = new User();
//         memberUser.setId(2L);
//         memberToRemove.setUser(memberUser);
//         Project testProject = new Project();
//         testProject.setProjectId(1L);
//         testProject.setProjectCode("P12345");
//         testProject.setProjectName("Test Project");
//         User creatorUser = new User();
//         creatorUser.setId(1L);
//         testProject.setCreatedBy(creatorUser);
//         testProject.setMembers(new ArrayList<>());
//         User memberUser = new User();
//         memberUser.setId(2L);
//         ProjectMember memberToRemove = new ProjectMember();
//         memberToRemove.setProjectMemberId(2L);
//         memberToRemove.setUser(memberUser);
//         memberToRemove.setProject(testProject);
//         ProjectMember creatorProjectMember = new ProjectMember();
//         creatorProjectMember.setProjectMemberId(1L);
//         creatorProjectMember.setUser(creatorUser);
//         creatorProjectMember.setProject(testProject);
//         testProject.getMembers().add(creatorProjectMember);
//         testProject.getMembers().add(memberToRemove);
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         when(projectMemberRepository.findById(2L)).thenReturn(Optional.of(memberToRemove));
//         projectService.removeMemberFromProject(1L, 2L, creatorUser);
//         verify(projectMemberRepository, times(1)).delete(memberToRemove);
//     }

//     @Test
//     void testRemoveMemberFromProjectAsNonCreatorThrows() {
//         User notCreator = new User();
//         notCreator.setId(999L);
//         testProject.setMembers(new ArrayList<>());
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         assertThrows(RuntimeException.class, () -> projectService.removeMemberFromProject(1L, 2L, notCreator));
//     }

//     @Test
//     void testGetUserProjects() {
//         ProjectMember membership = new ProjectMember();
//         membership.setProject(testProject);
//         when(projectMemberRepository.findByUserId(1L)).thenReturn(List.of(membership));
//         List<Project> projects = projectService.getUserProjects(testUser);
//         assertEquals(1, projects.size());
//     }

//     @Test
//     void testUpdateProjectSuccess() {
//         Project updatedProject = new Project();
//         updatedProject.setProjectName("Updated Name");
//         updatedProject.setProjectDescription("Updated Desc");
//         when(projectRepository.findById(1L)).thenReturn(Optional.of(testProject));
//         when(projectRepository.save(any(Project.class))).thenReturn(testProject);
//         Optional<Project> result = projectService.updateProject(1L, updatedProject);
//         assertTrue(result.isPresent());
//         verify(projectRepository).save(any(Project.class));
//     }

//     @Test
//     void testDeleteProjectSuccess() {
//         when(projectRepository.existsById(1L)).thenReturn(true);
//         boolean result = projectService.deleteProject(1L);
//         assertTrue(result);
//         verify(projectRepository).deleteById(1L);
//     }

//     @Test
//     void testDeleteProjectNotFound() {
//         when(projectRepository.existsById(1L)).thenReturn(false);
//         boolean result = projectService.deleteProject(1L);
//         assertFalse(result);
//     }
// }
