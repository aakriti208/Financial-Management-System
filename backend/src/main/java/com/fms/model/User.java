package com.fms.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * JPA entity representing a registered user of the Financial Management System.
 *
 * <p>Passwords are stored as BCrypt hashes — the plain-text value is never
 * persisted. The {@code createdAt} timestamp is set automatically on first
 * insert and is never updated.</p>
 */
@Entity
@Table(name = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class User {

    /** Auto-generated primary key. */
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    /** User's given name. */
    @Column(nullable = false)
    private String firstName;

    /** User's family name. */
    @Column(nullable = false)
    private String lastName;

    /** Unique email address used for authentication. */
    @Column(nullable = false, unique = true)
    private String email;

    /** BCrypt hash of the user's password. Never the plain-text value. */
    @Column(nullable = false)
    private String passwordHash;

    /** Timestamp recorded when the account is first created. */
    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    /**
     * JPA lifecycle callback that sets {@code createdAt} to the current
     * date-time immediately before the entity is first persisted.
     */
    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
