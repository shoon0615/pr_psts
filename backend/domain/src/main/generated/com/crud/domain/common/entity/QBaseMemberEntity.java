package com.crud.domain.common.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QBaseMemberEntity is a Querydsl query type for BaseMemberEntity
 */
@Generated("com.querydsl.codegen.DefaultSupertypeSerializer")
public class QBaseMemberEntity extends EntityPathBase<BaseMemberEntity> {

    private static final long serialVersionUID = 792380061L;

    public static final QBaseMemberEntity baseMemberEntity = new QBaseMemberEntity("baseMemberEntity");

    public final QBaseTimeEntity _super = new QBaseTimeEntity(this);

    public final StringPath createdBy = createString("createdBy");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    public final StringPath modifiedBy = createString("modifiedBy");

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public QBaseMemberEntity(String variable) {
        super(BaseMemberEntity.class, forVariable(variable));
    }

    public QBaseMemberEntity(Path<? extends BaseMemberEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QBaseMemberEntity(PathMetadata metadata) {
        super(BaseMemberEntity.class, metadata);
    }

}

