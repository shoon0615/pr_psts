/**
 * packageName  : com.side.java17.after.biz.service.practice
 * fileName     : RepositoryTest
 * author       : SangHoon
 * date         : 2026-04-22
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-22          SangHoon             최초 생성
 */
package com.side.java17.after.biz.service.practice;

import com.side.java17.after.domain.dto.request.SampleRecord;
import com.side.java17.after.domain.repository.SampleRepository;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.ValueSource;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.test.context.ActiveProfiles;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * <pre>
 * [단위 테스트] Repository
 * @apiNote `@DataJpaTest` @ExtendWith, @Transactional 포함
 * </pre>
 */
@Slf4j
/*@DataJpaTest
@Import(JpaConfig.class)*/
@ActiveProfiles("local")
public class RepositoryTest {

    @Autowired
    private SampleRepository sampleRepository;

    private SampleRecord request;

    @BeforeEach
    void setUp() {
        request = SampleRecord.builder()
            .build();
    }

//    @Rollback(false)
    @ParameterizedTest
    @ValueSource(longs = {1L})
    void getRepository(Long id) {
        // given
//        SampleEntity entity = ObjectMapperUtil.convertType(request, SampleEntity.class);

        // when
//        sampleRepository.save(entity);
        sampleRepository.save(request);

        // then
        assertThat(sampleRepository.findById(id))
            .isPresent()
            .get()
            .usingRecursiveComparison()
            .ignoringFields("id", "createdDate", "createdAt")
            .isEqualTo(request);
    }

}
