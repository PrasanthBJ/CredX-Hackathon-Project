package com.credx.campusportal.service;

import com.credx.campusportal.dto.student.StudentProfileDto;
import com.credx.campusportal.entity.StudentProfile;
import com.credx.campusportal.entity.User;
import com.credx.campusportal.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;

class StudentServiceTest {

    @Mock
    private StudentProfileRepository studentProfileRepository;
    @Mock
    private PostingRepository postingRepository;
    @Mock
    private ApplicationRepository applicationRepository;
    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private StudentService studentService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testGetProfileByUserId_Success() {
        User mockUser = new User();
        mockUser.setId(1L);

        StudentProfile mockProfile = StudentProfile.builder()
                .id(1L)
                .user(mockUser)
                .branch("Computer Science")
                .gpa(3.8)
                .gradYear(2026)
                .build();

        when(studentProfileRepository.findByUserId(1L)).thenReturn(Optional.of(mockProfile));

        StudentProfileDto dto = studentService.getProfileByUserId(1L);

        assertEquals("Computer Science", dto.getBranch());
        assertEquals(3.8, dto.getGpa());
        assertEquals(2026, dto.getGradYear());
    }
}
