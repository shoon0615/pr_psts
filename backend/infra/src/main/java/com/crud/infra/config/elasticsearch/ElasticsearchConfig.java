/**
 * packageName  : com.crud.infra.config.elasticsearch
 * fileName     : ElasticsearchConfig
 * author       : SangHoon
 * date         : 2026-04-15
 * description  : 엘라스틱서치 환경설정 구성
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-15          SangHoon             최초 생성
 */
package com.crud.infra.config.elasticsearch;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.data.elasticsearch.client.ClientConfiguration;
import org.springframework.data.elasticsearch.client.elc.ElasticsearchConfiguration;
import org.springframework.data.elasticsearch.repository.config.EnableElasticsearchRepositories;
import org.springframework.lang.NonNull;

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
}
