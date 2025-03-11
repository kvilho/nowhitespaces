package fi.haagahelia.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import fi.haagahelia.backend.services.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final CustomUserDetailsService customUserDetailsService;
    private final CustomCorsConfig customCorsConfig;

    public SecurityConfig(CustomUserDetailsService customUserDetailsService, CustomCorsConfig customCorsConfig) {
        this.customUserDetailsService = customUserDetailsService;
        this.customCorsConfig = customCorsConfig;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(customUserDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
	public SecurityFilterChain configure(HttpSecurity http) throws Exception {

		http
            .cors(cors -> cors.configurationSource(customCorsConfig.getCorsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(authorize -> authorize
			.requestMatchers("/css/**", "/h2-console/**", "/api/**").permitAll()
            .requestMatchers(org.springframework.http.HttpMethod.OPTIONS, "/**").permitAll() 
			.anyRequest().authenticated()
		)
		.formLogin(formlogin -> formlogin
            //.loginPage("/login") // Custom login page
		    //.defaultSuccessUrl("/homepage", true) // Redirect after successful login
            .permitAll()
		)
		.logout(logout -> logout
            //.logoutSuccessUrl("/") // Redirect after logout 
			.permitAll())
        .headers(headers -> headers.frameOptions(frameOptions -> frameOptions.disable())); // Allow frames for H2 Console
		return http.build();
	}
}
