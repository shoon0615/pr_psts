package com.crud.infra.config.elasticsearch;

import org.junit.jupiter.api.Test;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.test.util.ReflectionTestUtils;

import static org.assertj.core.api.Assertions.assertThat;

class ElasticsearchConfigTest {

    @Test
    void clientConfiguration_returnsConfiguration_whenHostIsProvided() {
        ElasticsearchConfig config = new ElasticsearchConfig();
        ReflectionTestUtils.setField(config, "host", "localhost:9200");

        ClientConfiguration clientConfiguration = config.clientConfiguration();

        assertThat(clientConfiguration).isNotNull();
    }
}
