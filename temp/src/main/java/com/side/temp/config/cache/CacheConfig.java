/**
 * packageName  : com.side.temp.config.cache
 * fileName     : CacheConfig
 * author       : SangHoon
 * date         : 2026-05-01
 * description  : Cache 환경설정 구성
 *                  `출처` https://bcuts.tistory.com/226
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-05-01          SangHoon             최초 생성
 */
package com.side.temp.config.cache;

public class CacheConfig {

}

/*@Configuration
public class CacheConfig {

    @Bean
    @Profile("dev")
    public CacheManager devCacheManager() {
        return new ConcurrentMapCacheManager();
    }

    @Bean
    @Profile("prod")
    public CacheManager redisCacheManager() {
        // Redis 기반 설정
        return new RedisCacheManager(...);
    }
}*/
