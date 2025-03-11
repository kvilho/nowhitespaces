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
        config.setAllowedOrigins(List.of("http://localhost:5173")); // Specify allowed origin(s)
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "OPTIONS", "DELETE")); 
        config.setAllowedHeaders(List.of("*")); // Limit to required headers
        config.setAllowCredentials(true);
        config.setExposedHeaders(List.of("*")); // Expose only if required
                
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config); // Apply to all paths, adjust if needed

        return source;
    }
}
