/**
 * packageName  : com.side.java17.after.biz.service._20260421
 * fileName     : UtilTest
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
import org.springframework.util.CollectionUtils;
import org.springframework.util.StringUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static org.assertj.core.api.Assertions.assertThat;

@Slf4j
public class UtilTest {

    boolean result = true;
    String[] str = new String[4];
    Map<String, Map<String, Object>> map;
    List<List<Object>> list;

    @BeforeEach
    void setUp() {
        str[0] = null;
        str[1] = "";
        str[2] = " ";
        str[3] = "글자";
        map = new HashMap<>() {{
            put("map1", null);
            put("map2", new HashMap<>());
            put("map3", Map.of("key", "value"));
        }};
        list = new ArrayList<>() {{
            add(null);
            add(new ArrayList<>());
            add(List.of("list"));
        }};
    }

    /*@DisplayName("0. 답변 예제(기존)")
    @Test
    void getBefore() {
        if(str[3] == null || str[3].trim().isEmpty()) {
            log.debug("str =  {}", str[3]);
            result = false;
        }

        if(map == null || map.isEmpty()) {
            result = false;
        } else if(map.get("map3") == null || map.get("map3").isEmpty()) {
            log.debug("map =  {}", map.get("map3"));
            result = false;
        }

        if(list == null || list.isEmpty()) {
            result = false;
        } else if(list.getLast() == null || list.getLast().isEmpty()) {
            log.debug("list = {}", list.getLast());
            result = false;
        }

        assertThat(result).isTrue();
    }*/

    @DisplayName("0. 답변 예제(기존)")
    @Test
    void getBefore() {
        /*assertThat(str[3] == null || str[3].trim().isEmpty()).isFalse();
        assertThat(list == null || list.isEmpty()).isFalse();
        assertThat(map == null || map.isEmpty()).isFalse();*/

        if(str[3] == null || str[3].trim().isEmpty()) {
            result = false;
        }

        if(map == null || map.isEmpty()) {
            result = false;
        }

        if(list == null || list.isEmpty()) {
            result = false;
        }

        assertThat(result).isTrue();
    }

    @DisplayName("0. 답변 예제(변경)")
    @Test
    void getAfter() {
        /*assertThat(StringUtils.hasText(str[3])).isTrue();
        assertThat(CollectionUtils.isEmpty(map.get("map3"))).isFalse();
        assertThat(CollectionUtils.isEmpty(list.getLast())).isFalse();*/

        if(!StringUtils.hasText(str[3])
            || CollectionUtils.isEmpty(map.get("map3"))
            || CollectionUtils.isEmpty(list.getLast())
        ) {
            log.debug(
                "str = {}, map = {}, list = {}, ",
                str[3], map.get("map3"), list.getLast()
            );
            result = false;
        }

        assertThat(result).isTrue();
    }

    @DisplayName("1. str 의 모든 예제를 추측하세요.")
    @Test
    void getAnswer1() {

    }

    @DisplayName("2. map 의 모든 예제를 추측하세요.")
    @Test
    void getAnswer2() {

    }

    @DisplayName("3. list 의 모든 예제를 추측하세요.")
    @Test
    void getAnswer3() {

    }

}
