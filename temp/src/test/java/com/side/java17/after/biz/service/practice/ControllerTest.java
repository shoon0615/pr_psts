/**
 * packageName  : com.side.java17.after.biz.service.practice
 * fileName     : ControllerTest
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
import com.side.temp2.controller.RestTemp2Controller;
import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import tools.jackson.databind.ObjectMapper;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultHandlers.print;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * <pre>
 * [단위 테스트] Controller
 * @apiNote `@WebMvcTest` Filter, Interceptor 등 관련 Bean 도 자동으로 등록
 * </pre>
 */
@Slf4j
@WebMvcTest(RestTemp2Controller.class)
public class ControllerTest {

    //@DataJpaTest        // 자동으로 @ExtendWith, @Transactional 포함
//    @ExtendWith(SpringExtension.class)

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper mapper;

//    @Autowired        // 진짜 Service 로도 수행 가능
    @MockitoBean        // 실제 객체를 대신할 가짜 객체
    private SampleService sampleService;

    private SampleRecord request;

    @BeforeEach
    void setUp() {
        request = SampleRecord.builder()
            .build();
    }

    @Test
    void getController() throws Exception {
        mockMvc.perform(get("/url")
                .contentType(MediaType.APPLICATION_JSON)
                .content(mapper.writeValueAsString(request)))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.data", notNullValue()))
            .andDo(print())
        ;
    }

}
