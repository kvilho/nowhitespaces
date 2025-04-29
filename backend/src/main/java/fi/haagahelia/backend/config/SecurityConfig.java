package fi.haagahelia.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import fi.haagahelia.backend.security.JwtAuthenticationFilter;
import fi.haagahelia.backend.services.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {
    private static final Logger log = LoggerFactory.getLogger(SecurityConfig.class);

    private final CustomUserDetailsService customUserDetailsService;
    private final CustomCorsConfig customCorsConfig;
    private final JwtAuthenticationFilter jwtAuthFilter;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, 
                         CustomCorsConfig customCorsConfig,
                         JwtAuthenticationFilter jwtAuthFilter) {
        this.customUserDetailsService = customUserDetailsService;
        this.customCorsConfig = customCorsConfig;
        this.jwtAuthFilter = jwtAuthFilter;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        log.debug("Configuring security filter chain");
        
        http
            .cors(cors -> {
                log.debug("Configuring CORS");
                cors.configurationSource(customCorsConfig.getCorsConfigurationSource());
            })
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> {
                log.debug("Configuring authorization rules");
                auth
                    .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() 
                    .requestMatchers("/api/auth/**",
                                    "/h2-console/**",
                                    "/v3/api-docs/**",
                                    "/swagger-ui/**",
                                    "/swagger-ui.html").permitAll()
                    .requestMatchers("/api/entries/**").authenticated()
                    .requestMatchers("/api/users/profile", "/api/users/profile/**").authenticated()
                    .requestMatchers("/api/users/**").hasAnyRole("ADMIN", "USER", "EMPLOYEE")
                    .anyRequest().authenticated();
            })
            .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin()))
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);
        
        log.debug("Security filter chain configuration completed");
        return http.build();
    }
}
