package com.campusconnect.app.config;

import com.campusconnect.app.entity.Community;
import com.campusconnect.app.entity.CommunityType;
import com.campusconnect.app.repository.CommunityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final CommunityRepository communityRepository;

    @Override
    public void run(String... args) {
        if (communityRepository.count() > 0) return; // already seeded

        List<Community> communities = List.of(
            // Cities
            community("Gorakhpur", CommunityType.CITY, "Connect with people from Gorakhpur"),
            community("Noida", CommunityType.CITY, "Connect with people from Noida"),
            community("Lucknow", CommunityType.CITY, "Connect with people from Lucknow"),
            community("Varanasi", CommunityType.CITY, "Connect with people from Varanasi"),
            community("Delhi", CommunityType.CITY, "Connect with people from Delhi"),
            community("Mumbai", CommunityType.CITY, "Connect with people from Mumbai"),
            community("Pune", CommunityType.CITY, "Connect with people from Pune"),
            community("Bangalore", CommunityType.CITY, "Connect with people from Bangalore"),

            // Colleges
            community("MMMUT Gorakhpur", CommunityType.COLLEGE, "Madan Mohan Malaviya University of Technology"),
            community("GL Bajaj Noida", CommunityType.COLLEGE, "GL Bajaj Institute of Technology and Management"),
            community("IIT Bombay", CommunityType.COLLEGE, "Indian Institute of Technology Bombay"),
            community("IIT Delhi", CommunityType.COLLEGE, "Indian Institute of Technology Delhi"),
            community("NIT Allahabad", CommunityType.COLLEGE, "National Institute of Technology Allahabad"),
            community("BHU Varanasi", CommunityType.COLLEGE, "Banaras Hindu University"),
            community("AKTU Lucknow", CommunityType.COLLEGE, "Dr. APJ Abdul Kalam Technical University"),
            community("Amity Noida", CommunityType.COLLEGE, "Amity University Noida"),

            // Schools
            community("Kendriya Vidyalaya Gorakhpur", CommunityType.SCHOOL, "KV Gorakhpur students"),
            community("Delhi Public School Noida", CommunityType.SCHOOL, "DPS Noida students"),
            community("St. Joseph's School Varanasi", CommunityType.SCHOOL, "St. Joseph's Varanasi students"),
            community("Jawahar Navodaya Vidyalaya", CommunityType.SCHOOL, "JNV students across India"),
            community("Ryan International School", CommunityType.SCHOOL, "Ryan International students"),
            community("Delhi Public School Delhi", CommunityType.SCHOOL, "DPS Delhi students")
        );

        communityRepository.saveAll(communities);
        System.out.println("✅ Communities seeded: " + communities.size() + " entries");
    }

    private Community community(String name, CommunityType type, String description) {
        return Community.builder()
                .name(name)
                .type(type)
                .description(description)
                .build();
    }
}
