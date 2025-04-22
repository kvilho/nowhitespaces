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

        String requestURI = request.getRequestURI();
        logger.debug("Processing request for URI: {}", requestURI);

        // Extract the Authorization header
        final String authHeader = request.getHeader("Authorization");
        logger.debug("Authorization header: {}", authHeader);

        final String jwt;
        final String userEmail;

        // Check if the Authorization header is missing or doesn't start with "Bearer "
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            logger.debug("No valid Authorization header found for URI: {}", requestURI);
            filterChain.doFilter(request, response);
            return;
        }

        // Extract the JWT token from the Authorization header
        jwt = authHeader.substring(7);
        logger.debug("JWT token extracted: {}", jwt.substring(0, Math.min(10, jwt.length())) + "...");

        try {
            // Extract the username (email) from the token
            userEmail = jwtUtil.extractUsername(jwt);
            logger.debug("Email extracted from token: {}", userEmail);

            // Check if the username is valid and the SecurityContext is not already authenticated
            if (userEmail != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                // Load the user details from the database
                UserDetails userDetails = this.userDetailsService.loadUserByUsername(userEmail);
                logger.debug("User details loaded for {}, Authorities: {}", userEmail, userDetails.getAuthorities());

                // Validate the token
                if (jwtUtil.validateToken(jwt, userDetails)) {
                    logger.debug("Token is valid for user: {}", userEmail);
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
                    logger.debug("Authentication set in SecurityContext for user: {} with authorities: {}", 
                               userEmail, userDetails.getAuthorities());
                } else {
                    logger.warn("Token validation failed for user: {}", userEmail);
                }
            } else {
                logger.debug("Skip authentication: userEmail={}, existing auth={}", 
                           userEmail, SecurityContextHolder.getContext().getAuthentication());
            }
        } catch (Exception e) {
            logger.error("Error processing JWT token for URI: " + requestURI, e);
        }

        // Continue the filter chain
        filterChain.doFilter(request, response);
    }
}