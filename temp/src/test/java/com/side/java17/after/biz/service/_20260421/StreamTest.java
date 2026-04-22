/**
 * packageName  : com.side.java17.after.biz.service._20260421
 * fileName     : StreamTest
 * author       : SangHoon
 * date         : 2026-04-22
 * description  :
 * ===========================================================
 * DATE                 AUTHOR                NOTE
 * -----------------------------------------------------------
 * 2026-04-22          SangHoon             최초 생성
 */
package com.side.java17.after.biz.service._20260421;

import lombok.extern.slf4j.Slf4j;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.TestInstance;
import org.junit.jupiter.params.ParameterizedTest;
import org.junit.jupiter.params.provider.MethodSource;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.function.Supplier;
import java.util.stream.Stream;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
@TestInstance(TestInstance.Lifecycle.PER_CLASS)
public class StreamTest {

    private List<Map<String, Object>> list;

    @BeforeEach
    void setUp() {
        list = new ArrayList<>() {{
            add(Map.of(
                "name", "stream",
                "data", 1)
            );
            add(Map.of(
                "name", "optional",
                "data", 2)
            );
            add(Map.of(
                "name", "supplier",
                "data", 3)
            );
        }};
        list.addAll(new ArrayList<>(list));
    }

    @DisplayName("0. 답변 예제(기본)")
    @Test
    void getStream() {
        assertThat(list.size()).isEqualTo(6);
    }

    @DisplayName("1. 예제에서 name = 'stream' 에 속하는 data 의 합계 또는 개수를 구하세요.")
    @Test
    void getAnswer1() {

    }

    @DisplayName("2. 예제에서 data 가 4 인 데이터의 name 을 구하세요. (없을 경우, null)")
    @Test
    void getAnswer2() {

    }

    @DisplayName("3. 예제에서 data 를 역순으로 정렬했을 때의 첫번째 데이터의 name 을 구하세요.")
    @Test
    void getAnswer3() {

    }

    @DisplayName("4. 받은 인자를 출력하세요. (에러 발생 시, null)")
    @ParameterizedTest
    @MethodSource("getMethod")
    void getAnswer4(Boolean method) {
        /*try {
            log.debug("Method = {}", method);
        } catch (Exception e) {
            log.debug("Error");
        }*/
    }

    @DisplayName("5. 받은 인자를 출력하세요. (에러 발생 시, null)")
    @ParameterizedTest
    @MethodSource("getSupplier")
    void getAnswer5(Supplier<Boolean> method) {
//        log.debug("Supplier = {}", method);
        /*try {
            log.debug("Supplier = {}", method);
            log.debug("Method = {}", method.get());
        } catch (Exception e) {
            log.debug("Error");
        }*/
    }

    Boolean getError(boolean isError) {
        log.debug("getError 실행");
        if(isError) throw new RuntimeException();
        return isError;
    }

    Stream<Boolean> getMethod() {
        return Stream.of(
            getError(true),
            getError(false)
        );
    }

    /**
     * @see Stream N개 컬렉션 처리(Stream.of: 다중(N), Optional.of: 단일(1))
     * @see Supplier () -> {}
     * @see Boolean return 된 데이터 타입
     * @return
     */
    Stream<Supplier<Boolean>> getSupplier() {
        return Stream.of(
            () -> { return getError(true); },
            () -> getError(false)
        );
    }

}
