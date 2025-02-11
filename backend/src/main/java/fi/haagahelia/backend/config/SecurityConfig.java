package fi.haagahelia.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity(securedEnabled = true)
public class SecurityConfig {

    @Bean
	public SecurityFilterChain configure(HttpSecurity http) throws Exception {

		http.authorizeHttpRequests(authorize -> authorize
			.requestMatchers("/css/**", "/h2-console/**").permitAll()
			.anyRequest().authenticated()
		)
		.formLogin(formlogin -> formlogin
			.loginPage("/login").permitAll()
		)
		.logout(logout -> logout
			.permitAll()
		);	
		return http.build();
	}

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
