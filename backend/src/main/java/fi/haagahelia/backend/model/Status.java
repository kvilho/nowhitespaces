package fi.haagahelia.backend.model;

import jakarta.persistence.Entity;

@Entity
public enum Status {
        APPROVED,
        PENDING,
        DECLINED
}
