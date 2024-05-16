package com.servesync.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns(CorsConfiguration.ALL) // Allow requests from any origin
                .allowedMethods(CorsConfiguration.ALL) // Allow specified methods
                .allowedHeaders(CorsConfiguration.ALL) // Allow all headers
                .allowCredentials(false); // Allow credentials (e.g., cookies, authorization headers)
    }
}
