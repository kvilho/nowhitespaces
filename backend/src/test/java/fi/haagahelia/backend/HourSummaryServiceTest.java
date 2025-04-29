package fi.haagahelia.backend;

import fi.haagahelia.backend.dto.HourSummaryDTO;
import fi.haagahelia.backend.model.Entry;
import fi.haagahelia.backend.model.Organization;
import fi.haagahelia.backend.model.Project;
import fi.haagahelia.backend.repositories.EntryRepository;
import fi.haagahelia.backend.services.HourSummaryService;
import fi.haagahelia.backend.model.Status;
import fi.haagahelia.backend.model.User;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.assertEquals;

@ExtendWith(MockitoExtension.class)
public class HourSummaryServiceTest {

    @Mock
    private EntryRepository entryRepository;

    @InjectMocks
    private HourSummaryService hourSummaryService;

    @Test
    public void testCalculateTotalHours_withValidEntries() {
        User user = new User();
        user.setId(1L);
        user.setUsername("testuser");

        Project project = new Project();
        project.setProjectId(1L);
        project.setProjectName("Test Project");

        Organization org = new Organization();
        org.setOrganizationId(1L);
        org.setOrganizationName("Test Org");

        Entry entry1 = new Entry();
        entry1.setEntryStart(LocalDateTime.of(2025, 4, 4, 8, 0));
        entry1.setEntryEnd(LocalDateTime.of(2025, 4, 4, 16, 30)); // 8.5h
        entry1.setEntryDescription("Entry1");
        entry1.setUser(user);
        entry1.setStatus(Status.APPROVED);
        entry1.setProject(project);
        entry1.setOrganization(org);

        Entry entry2 = new Entry();
        entry2.setEntryStart(LocalDateTime.of(2025, 4, 5, 9, 15));
        entry2.setEntryEnd(LocalDateTime.of(2025, 4, 5, 17, 30)); // 8.25h
        entry2.setEntryDescription("Entry2");
        entry2.setUser(user);
        entry2.setStatus(Status.APPROVED);
        entry2.setProject(project);
        entry2.setOrganization(org);

        List<Entry> entries = Arrays.asList(entry1, entry2);
        double totalHours = hourSummaryService.calculateTotalHours(entries);

        assertEquals(16.75, totalHours, 0.01); // 8.5 + 8.25 = 16.75
    }

    @Test
    public void testCalculateMonthlyBreakdown_multipleEntriesAcrossMonths() {
        Entry aprilEntry = new Entry();
        aprilEntry.setEntryStart(LocalDateTime.of(2025, 4, 10, 9, 0));
        aprilEntry.setEntryEnd(LocalDateTime.of(2025, 4, 10, 17, 30)); // 8.5 hours

        Entry mayEntry = new Entry();
        mayEntry.setEntryStart(LocalDateTime.of(2025, 5, 1, 8, 30));
        mayEntry.setEntryEnd(LocalDateTime.of(2025, 5, 1, 16, 0)); // 7.5 hours

        List<Entry> entries = Arrays.asList(aprilEntry, mayEntry);
        Map<String, Double> result = hourSummaryService.calculateMonthlyBreakdown(entries);

        assertEquals(2, result.size());
        assertEquals(8.5, result.get("2025-04"), 0.01);
        assertEquals(7.5, result.get("2025-05"), 0.01);
    }

    @Test
    public void testCalculateProjectBreakdown_multipleProjects() {
        Project project1 = new Project();
        project1.setProjectId(100L);
        project1.setProjectName("Alpha Project");

        Project project2 = new Project();
        project2.setProjectId(200L);
        project2.setProjectName("Beta Project");

        Entry entry1 = new Entry();
        entry1.setEntryStart(LocalDateTime.of(2025, 4, 10, 9, 0));
        entry1.setEntryEnd(LocalDateTime.of(2025, 4, 10, 17, 0)); // 8.0 hours
        entry1.setProject(project1);

        Entry entry2 = new Entry();
        entry2.setEntryStart(LocalDateTime.of(2025, 4, 11, 9, 0));
        entry2.setEntryEnd(LocalDateTime.of(2025, 4, 11, 12, 0)); // 3.0 hours
        entry2.setProject(project1);

        Entry entry3 = new Entry();
        entry3.setEntryStart(LocalDateTime.of(2025, 4, 12, 10, 0));
        entry3.setEntryEnd(LocalDateTime.of(2025, 4, 12, 18, 0)); // 8.0 hours
        entry3.setProject(project2);

        List<Entry> entries = Arrays.asList(entry1, entry2, entry3);
        List<HourSummaryDTO.ProjectHoursDTO> result = hourSummaryService.calculateProjectBreakdown(entries);

        assertEquals(2, result.size());

        // Find Alpha Project
        HourSummaryDTO.ProjectHoursDTO alpha = result.stream()
                .filter(dto -> dto.getProjectName().equals("Alpha Project"))
                .findFirst()
                .orElseThrow();
        assertEquals(11.0, alpha.getHours(), 0.01); // 8 + 3 = 11

        // Find Beta Project
        HourSummaryDTO.ProjectHoursDTO beta = result.stream()
                .filter(dto -> dto.getProjectName().equals("Beta Project"))
                .findFirst()
                .orElseThrow();
        assertEquals(8.0, beta.getHours(), 0.01);
    }
}