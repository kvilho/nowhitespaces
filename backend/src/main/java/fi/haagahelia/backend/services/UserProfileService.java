package fi.haagahelia.backend.services;

import fi.haagahelia.backend.model.User;
import fi.haagahelia.backend.repositories.UserRepository;
import fi.haagahelia.backend.security.CustomUserDetails;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
public class UserProfileService {

    @Autowired
    private UserRepository userRepository;

    public User getUserProfile(CustomUserDetails currentUser) {
        if (currentUser == null) {
            throw new UsernameNotFoundException("No authenticated user found");
        }
        return currentUser.getUser();
    }

    public User getUserProfileByUsername(String username) {
        return userRepository.findByUsername(username)
            .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));
    }
} 