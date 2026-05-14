//the repository is the layer code between java code and database
package com.campusconnect.app.repository;

import com.campusconnect.app.entity.Community;
import com.campusconnect.app.entity.CommunityType;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface CommunityRepository extends JpaRepository<Community, Long> {
    List<Community> findByNameContainingIgnoreCase(String name);
    List<Community> findByType(CommunityType type);
    List<Community> findByNameContainingIgnoreCaseAndType(String name, CommunityType type);
}
