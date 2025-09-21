package lk.slpa.mpma.backend.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class WebSecurityConfig {

    private final JwtRequestFilter jwtRequestFilter;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    public WebSecurityConfig(
            JwtRequestFilter jwtRequestFilter, JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint) {
        this.jwtRequestFilter = jwtRequestFilter;
        this.jwtAuthenticationEntryPoint = jwtAuthenticationEntryPoint;
    }

  @Bean
  public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
    http.cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(
                    exception -> exception.authenticationEntryPoint(jwtAuthenticationEntryPoint))
            .sessionManagement(
                    session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                    // 1. PUBLIC ENDPOINTS (Intentionally public)
                    .requestMatchers("/api/auth/**").permitAll()
                    .requestMatchers("/api/stats").permitAll()
                    .requestMatchers(
                            "/", "/status", "/swagger-ui/**", "/v3/api-docs/**", "/api-docs/**")
                    .permitAll()
                    .requestMatchers("/api/helper/**").permitAll() // Assuming this is truly public

                    // 2. ROLE-SPECIFIC ENDPOINTS (From most to least specific)
                    // ADMINISTRATOR
                    .requestMatchers("/api/admin/**", "/api/users/**", "/api/adminProfile/**")
                    .hasRole("ADMINISTRATOR")

                    // LECTURER
                    .requestMatchers("/api/courses/*/manage/**", "/api/courses/lecturer/**").hasRole("LECTURER")
                    .requestMatchers("/api/questionBank/**", "/api/activities/*/grade").hasRole("LECTURER")
                    .requestMatchers(HttpMethod.GET, "/api/quizzes/*").hasAnyRole("LECTURER", "STUDENT")
                    .requestMatchers("/api/quizzes/**").hasRole("LECTURER")

                    // STUDENT
                    .requestMatchers("/api/courses/*/enroll").hasRole("STUDENT")
                    .requestMatchers("/api/submissions/student/**").hasRole("STUDENT")

                    // TRAINER / TRAINEE
                    .requestMatchers("/api/training/**").hasAnyRole("TRAINER", "TRAINEE")

                    // MULTI-ROLE & AUTHENTICATED
                    .requestMatchers("/api/courses/*/participants").hasAnyRole("LECTURER", "ADMINISTRATOR")
                    .requestMatchers("/api/courses/*/materials/**", "/api/courses")
                    .hasAnyRole("LECTURER", "STUDENT", "ADMINISTRATOR")
                    .requestMatchers("/api/profile/**").authenticated()

                    // Secure other endpoints that were previously public
                    .requestMatchers("/api/attendance/**", "/api/enrollments/**", "/api/events/**", "/api/semesters/**")
                    .authenticated() // Requires AT LEAST a login. Assign specific roles if needed.

                    // 3. DEFAULT CATCH-ALL (Secure by Default)
                    .anyRequest().authenticated()
            );

    http.addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);
    return http.build();
  }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.addAllowedOrigin("*");
        configuration.addAllowedMethod("*");
        configuration.addAllowedHeader("*");
        // We are combining both versions here
        configuration.addExposedHeader("Authorization");
        configuration.addExposedHeader("Content-Disposition"); // This is from the 'main' branch
        configuration.setAllowCredentials(false);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig)
            throws Exception {
        return authConfig.getAuthenticationManager();
    }
}