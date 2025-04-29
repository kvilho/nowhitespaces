package fi.haagahelia.backend.services;

import fi.haagahelia.backend.dto.HourSummaryDTO;
import fi.haagahelia.backend.model.Entry;
import fi.haagahelia.backend.model.Status;
import fi.haagahelia.backend.repositories.EntryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class HourSummaryService {

    @Autowired
    private EntryRepository entryRepository;

    public HourSummaryDTO getUserHourSummary(Long userId) {
        // Get all entries for the user with different statuses
        List<Entry> approvedEntries = entryRepository.findByUserIdAndStatus(userId, Status.APPROVED);
        List<Entry> pendingEntries = entryRepository.findByUserIdAndStatus(userId, Status.PENDING);
        List<Entry> declinedEntries = entryRepository.findByUserIdAndStatus(userId, Status.DECLINED);

        // Create summary DTOs for each status
        HourSummaryDTO.StatusSummaryDTO approvedSummary = createStatusSummary(approvedEntries);
        HourSummaryDTO.StatusSummaryDTO pendingSummary = createStatusSummary(pendingEntries);
        HourSummaryDTO.StatusSummaryDTO declinedSummary = createStatusSummary(declinedEntries);

        return new HourSummaryDTO(approvedSummary, pendingSummary, declinedSummary);
    }

    private HourSummaryDTO.StatusSummaryDTO createStatusSummary(List<Entry> entries) {
        double totalHours = calculateTotalHours(entries);
        Map<String, Double> monthlyBreakdown = calculateMonthlyBreakdown(entries);
        List<HourSummaryDTO.ProjectHoursDTO> projectBreakdown = calculateProjectBreakdown(entries);

        return new HourSummaryDTO.StatusSummaryDTO(totalHours, monthlyBreakdown, projectBreakdown);
    }

    public double calculateTotalHours(List<Entry> entries) {
        return entries.stream()
                .mapToDouble(entry -> {
                    LocalDateTime start = entry.getEntryStart();
                    LocalDateTime end = entry.getEntryEnd();
                    return java.time.Duration.between(start, end).toHours() +
                            java.time.Duration.between(start, end).toMinutesPart() / 60.0;
                })
                .sum();
    }

    public Map<String, Double> calculateMonthlyBreakdown(List<Entry> entries) {
        Map<String, Double> monthlyHours = new HashMap<>();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        entries.forEach(entry -> {
            YearMonth yearMonth = YearMonth.from(entry.getEntryStart());
            String monthKey = yearMonth.format(formatter);
            
            double hours = java.time.Duration.between(entry.getEntryStart(), entry.getEntryEnd()).toHours() +
                    java.time.Duration.between(entry.getEntryStart(), entry.getEntryEnd()).toMinutesPart() / 60.0;
            
            monthlyHours.merge(monthKey, hours, Double::sum);
        });

        return monthlyHours;
    }

    public List<HourSummaryDTO.ProjectHoursDTO> calculateProjectBreakdown(List<Entry> entries) {
        Map<Long, ProjectSummary> projectSummaries = new HashMap<>();

        entries.forEach(entry -> {
            Long projectId = entry.getProject().getProjectId();
            String projectName = entry.getProject().getProjectName();
            double hours = java.time.Duration.between(entry.getEntryStart(), entry.getEntryEnd()).toHours() +
                    java.time.Duration.between(entry.getEntryStart(), entry.getEntryEnd()).toMinutesPart() / 60.0;

            projectSummaries.computeIfAbsent(projectId, k -> new ProjectSummary(projectId, projectName))
                    .addHours(hours);
        });

        return projectSummaries.values().stream()
                .map(summary -> new HourSummaryDTO.ProjectHoursDTO(
                        summary.getProjectId(),
                        summary.getProjectName(),
                        summary.getTotalHours()))
                .collect(Collectors.toList());
    }

    private static class ProjectSummary {
        private final Long projectId;
        private final String projectName;
        private double totalHours;

        public ProjectSummary(Long projectId, String projectName) {
            this.projectId = projectId;
            this.projectName = projectName;
            this.totalHours = 0.0;
        }

        public void addHours(double hours) {
            this.totalHours += hours;
        }

        public Long getProjectId() {
            return projectId;
        }

        public String getProjectName() {
            return projectName;
        }

        public double getTotalHours() {
            return totalHours;
        }
    }
} 