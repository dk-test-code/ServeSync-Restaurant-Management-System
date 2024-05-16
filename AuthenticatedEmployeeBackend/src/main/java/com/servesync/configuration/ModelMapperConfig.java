package com.servesync.configuration;

import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.servesync.dtos.OrderEntityDTO;
import com.servesync.models.OrderEntity;

@Configuration
public class ModelMapperConfig {

    @Bean
    ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        
        // Configure mappings
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
        
        // Exclude orderId field from mapping
        modelMapper.createTypeMap(OrderEntityDTO.class, OrderEntity.class)
                   .addMappings(mapper -> mapper.skip(OrderEntity::setOrderId));
        
        return modelMapper;
    }
}
