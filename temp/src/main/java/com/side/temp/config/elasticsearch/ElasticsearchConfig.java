/**
 * packageName  : com.side.temp.config.elasticsearch
 * fileName     : ElasticsearchConfig
 * author       : SangHoon
 * date         : 2026-04-15
 * description  : 엘라스틱서치 환경설정 구성
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-15          SangHoon             최초 생성
 */
package com.side.temp.config.elasticsearch;

import lombok.NonNull;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;

@Configuration
@EnableElasticsearchRepositories
public class ElasticsearchConfig extends ElasticsearchConfiguration {

    // 엘라스틱서치 uri
    @Value("${spring.elasticsearch.uris}")
    private String host;

    /**
     * 엘라스틱서치 연결 설정
     * @method       : clientConfiguration
     * @author       : SangHoon
     * @date         : 2026-04-15 오후 6:15
     */
    @Override
    @NonNull
    public ClientConfiguration clientConfiguration() {
        return ClientConfiguration.builder()
                .connectedTo(host)
                .build();
    }

    /**
     * elasticsearch-java 용?? -> extends ElasticsearchConfiguration 가 자동으로 생성하기에 필요없음?? 확인 필요
     * @method       : elasticsearchClient
     * @author       : SangHoon
     * @date         : 2026-04-15 오후 6:15
     */
    /*@Bean
    public ElasticsearchClient elasticsearchClient() {
//        RestClient restClient = RestClient.builder(HttpHost.create(host)).build();
        RestClient restClient = RestClient.builder(host.replace("http://", "")).build();
        return new ElasticsearchClient(new RestClientTransport(restClient, new JacksonJsonpMapper()));
    }*/
}
