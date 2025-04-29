package fi.haagahelia.backend.config;

import java.util.List;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
public class CustomCorsConfig {

    @Bean
    public CorsConfigurationSource getCorsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        
        // Allow both development and production origins
        config.setAllowedOrigins(List.of(
            "http://localhost:5173", 
            "http://localhost:3000",
            "https://hourbook-hourbook.2.rahtiapp.fi", 
            "https://hourbook-frontend-hourbook.2.rahtiapp.fi"
        ));
        
        // Allow all common HTTP methods
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"));
        
        // Allow specific headers
        config.setAllowedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "X-Requested-With",
            "Access-Control-Request-Method",
            "Access-Control-Request-Headers"
        ));
        
        // Allow credentials (important for JWT token)
        config.setAllowCredentials(true);
        
        // Expose necessary headers
        config.setExposedHeaders(List.of(
            "Authorization",
            "Content-Type",
            "Accept",
            "Origin",
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Credentials"
        ));
        
        // Set max age for preflight requests
        config.setMaxAge(3600L);
                
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        config.setAllowedOriginPatterns(List.of("*"));

        return source;
    }
}
