package com.crud.domain.domains.entity.member;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGrantedAuthorityEntity is a Querydsl query type for GrantedAuthorityEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGrantedAuthorityEntity extends EntityPathBase<GrantedAuthorityEntity> {

    private static final long serialVersionUID = -337446310L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGrantedAuthorityEntity grantedAuthorityEntity = new QGrantedAuthorityEntity("grantedAuthorityEntity");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final QMemberEntity member;

    public final EnumPath<com.crud.domain.domains.enumeration.MemberRole> role = createEnum("role", com.crud.domain.domains.enumeration.MemberRole.class);

    public QGrantedAuthorityEntity(String variable) {
        this(GrantedAuthorityEntity.class, forVariable(variable), INITS);
    }

    public QGrantedAuthorityEntity(Path<? extends GrantedAuthorityEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGrantedAuthorityEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGrantedAuthorityEntity(PathMetadata metadata, PathInits inits) {
        this(GrantedAuthorityEntity.class, metadata, inits);
    }

    public QGrantedAuthorityEntity(Class<? extends GrantedAuthorityEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new QMemberEntity(forProperty("member"), inits.get("member")) : null;
    }

}

