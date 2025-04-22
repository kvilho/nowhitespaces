package fi.haagahelia.backend.dto;

import java.util.List;
import java.util.Map;

public class HourSummaryDTO {
    private StatusSummaryDTO approved;
    private StatusSummaryDTO pending;
    private StatusSummaryDTO declined;

    public HourSummaryDTO() {
    }

    public HourSummaryDTO(StatusSummaryDTO approved, StatusSummaryDTO pending, StatusSummaryDTO declined) {
        this.approved = approved;
        this.pending = pending;
        this.declined = declined;
    }

    public StatusSummaryDTO getApproved() {
        return approved;
    }

    public void setApproved(StatusSummaryDTO approved) {
        this.approved = approved;
    }

    public StatusSummaryDTO getPending() {
        return pending;
    }

    public void setPending(StatusSummaryDTO pending) {
        this.pending = pending;
    }

    public StatusSummaryDTO getDeclined() {
        return declined;
    }

    public void setDeclined(StatusSummaryDTO declined) {
        this.declined = declined;
    }

    public static class StatusSummaryDTO {
        private double totalHours;
        private Map<String, Double> monthlyBreakdown;
        private List<ProjectHoursDTO> perProject;

        public StatusSummaryDTO() {
        }

        public StatusSummaryDTO(double totalHours, Map<String, Double> monthlyBreakdown, List<ProjectHoursDTO> perProject) {
            this.totalHours = totalHours;
            this.monthlyBreakdown = monthlyBreakdown;
            this.perProject = perProject;
        }

        public double getTotalHours() {
            return totalHours;
        }

        public void setTotalHours(double totalHours) {
            this.totalHours = totalHours;
        }

        public Map<String, Double> getMonthlyBreakdown() {
            return monthlyBreakdown;
        }

        public void setMonthlyBreakdown(Map<String, Double> monthlyBreakdown) {
            this.monthlyBreakdown = monthlyBreakdown;
        }

        public List<ProjectHoursDTO> getPerProject() {
            return perProject;
        }

        public void setPerProject(List<ProjectHoursDTO> perProject) {
            this.perProject = perProject;
        }
    }

    public static class ProjectHoursDTO {
        private Long projectId;
        private String projectName;
        private double hours;

        public ProjectHoursDTO() {
        }

        public ProjectHoursDTO(Long projectId, String projectName, double hours) {
            this.projectId = projectId;
            this.projectName = projectName;
            this.hours = hours;
        }

        public Long getProjectId() {
            return projectId;
        }

        public void setProjectId(Long projectId) {
            this.projectId = projectId;
        }

        public String getProjectName() {
            return projectName;
        }

        public void setProjectName(String projectName) {
            this.projectName = projectName;
        }

        public double getHours() {
            return hours;
        }

        public void setHours(double hours) {
            this.hours = hours;
        }
    }
} 