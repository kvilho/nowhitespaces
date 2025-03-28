package fi.haagahelia.backend.services;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.stereotype.Service;
import org.springframework.security.core.userdetails.User;
import fi.haagahelia.backend.repositories.UserRepository;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        fi.haagahelia.backend.model.User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
        System.out.println("Loaded user: " + user.getEmail() + " with roles: " + user.getRole().getRoleName());

        UserBuilder builder = User.withUsername(user.getEmail())
                .password(user.getPasswordHash())
                .roles(user.getRole().getRoleName());

        return builder.build();
    }
}

