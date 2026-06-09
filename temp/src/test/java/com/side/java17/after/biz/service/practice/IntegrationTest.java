/**
 * packageName  : com.side.java17.after.biz.service.practice
 * fileName     : IntegrationTest
 * author       : SangHoon
 * date         : 2026-04-22
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-22          SangHoon             최초 생성
 */
package com.side.java17.after.biz.service.practice;

import com.side.java17.after.biz.service.SampleService;
import com.side.java17.after.domain.repository.SampleRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <pre>
 * [통합 테스트] Spring Boot Application
 * @apiNote `@SpringBootTest` 실제 환경과 동일
 * @apiNote `@DisplayNameGeneration` @DisplayName 자동 생성
 * </pre>
 */
@Slf4j
//@SpringBootTest
//@DisplayNameGeneration(DisplayNameGenerator.ReplaceUnderscores.class)
//@AutoConfigureMockMvc
@ActiveProfiles("local")
public class IntegrationTest {

//    @Autowired
//    @MockitoSpyBean
//    private MockMvc mockMvc;

    @Autowired
    private SampleService sampleService;

    @Autowired
    private SampleRepository sampleRepository;

    @Test
    void getTest() {
        assertThat(true).isTrue();
    }

}
