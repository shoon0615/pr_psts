package com.crud.domain.domains.entity.member;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QEmbMemberInfo is a Querydsl query type for EmbMemberInfo
 */
@Generated("com.querydsl.codegen.DefaultEmbeddableSerializer")
public class QEmbMemberInfo extends BeanPath<EmbMemberInfo> {

    private static final long serialVersionUID = -748900269L;

    public static final QEmbMemberInfo embMemberInfo = new QEmbMemberInfo("embMemberInfo");

    public final StringPath address = createString("address");

    public final StringPath address2 = createString("address2");

    public final DatePath<java.time.LocalDate> birthDate = createDate("birthDate", java.time.LocalDate.class);

    public final StringPath email = createString("email");

    public final StringPath gender = createString("gender");

    public final StringPath name = createString("name");

    public final StringPath telNo = createString("telNo");

    public final StringPath zipCode = createString("zipCode");

    public QEmbMemberInfo(String variable) {
        super(EmbMemberInfo.class, forVariable(variable));
    }

    public QEmbMemberInfo(Path<? extends EmbMemberInfo> path) {
        super(path.getType(), path.getMetadata());
    }

    public QEmbMemberInfo(PathMetadata metadata) {
        super(EmbMemberInfo.class, metadata);
    }

}

