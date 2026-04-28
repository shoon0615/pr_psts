/**
 * packageName  : com.side.java17.after.biz.service.practice
 * fileName     : ServiceTest
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
import com.side.java17.after.domain.dto.request.SampleRecord;
import com.side.java17.after.domain.repository.SampleRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.any;
import static org.mockito.Mockito.when;

/**
 * <pre>
 * [단위 테스트] Service
 * </pre>
 */
@ExtendWith(MockitoExtension.class)
//@MockitoSettings(strictness = Strictness.LENIENT)
public class ServiceTest {

    @Mock
    private SampleRepository sampleRepository;

    @InjectMocks    // Repository 를 주입한 가짜 객체
    private SampleService sampleService;

    /*@Spy          // 실제 사용이 필요한 객체(@Autowired 와 동일)
    private BCryptPasswordEncoder passwordEncoder;*/

    private SampleRecord request, response;

    @BeforeEach
    void setUp() {
        request = SampleRecord.builder()
            .build();
        response = SampleRecord.builder()
            .build();

//        when(sampleRepository.save(any())).thenReturn(response);
        when(sampleRepository.save(any(SampleRecord.class))).thenReturn(response);
    }

    @Test
    void getService() {
        assertThat(response)
//            .isNotNull()
            .usingRecursiveComparison()
            .ignoringFields("")
            .isEqualTo(request);

        /*assertThat(responseList)
            .usingRecursiveFieldByFieldElementComparator()
//                .usingRecursiveFieldByFieldElementComparatorIgnoringFields("")
//                .containsExactlyElementsOf(requestList);
            .containsExactlyInAnyOrderElementsOf(requestList);*/
    }

}
