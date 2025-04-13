package fi.haagahelia.backend.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.lang.NonNull; // Add this import

import fi.haagahelia.backend.services.CustomUserDetailsService;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final Logger logger = LoggerFactory.getLogger(JwtAuthenticationFilter.class);

    private final JwtUtil jwtUtil;
    private final CustomUserDetailsService userDetailsService;

    public JwtAuthenticationFilter(JwtUtil jwtUtil, CustomUserDetailsService userDetailsService) {
        this.jwtUtil = jwtUtil;
        this.userDetailsService = userDetailsService;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request, @NonNull HttpServletResponse response, @NonNull FilterChain filterChain)
            throws ServletException, IOException {

        // Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", authHeader);

        final String jwt;
        final String userEmail;

        // Check if the Authorization header is missing or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Authorization header found");
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token from the Authorization header
        jwt = authHeader.substring(7);
        logger.debug("JWT token extracted: {}", jwt);

        try {
            // Extract the username (email) from the token
            userEmail = jwtUtil.extractUsername(jwt);
            logger.debug("Email extracted from token: {}", userEmail);

            // Check if the username is valid and the SecurityContext is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load the user details from the database
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                logger.debug("User details loaded: {}", userDetails);

                // Validate the token
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.debug("Token is valid");
                    // Create an authentication token
                    UsernamePasswordAuthenticationToken authToken = new UsernamePasswordAuthenticationToken(
                            userDetails,
                            null,
                            userDetails.getAuthorities()
                    );

                    // Set additional details for the authentication token
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                    // Set the authentication in the SecurityContext
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                    logger.debug("Authentication set in SecurityContext");
                } else {
                    logger.warn("Token validation failed");
                }
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token", e);
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}