package com.crud.domain.domains.entity;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;


/**
 * QCrudEntity is a Querydsl query type for CrudEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QCrudEntity extends EntityPathBase<CrudEntity> {

    private static final long serialVersionUID = 236312870L;

    public static final QCrudEntity crudEntity = new QCrudEntity("crudEntity");

    public final com.crud.domain.common.entity.QBaseEntity _super = new com.crud.domain.common.entity.QBaseEntity(this);

    public final StringPath contents = createString("contents");

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> deletedAt = _super.deletedAt;

    public final NumberPath<Integer> hits = createNumber("hits", Integer.class);

    //inherited
    public final NumberPath<Long> id = _super.id;

    //inherited
    public final StringPath modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final StringPath title = createString("title");

    public QCrudEntity(String variable) {
        super(CrudEntity.class, forVariable(variable));
    }

    public QCrudEntity(Path<? extends CrudEntity> path) {
        super(path.getType(), path.getMetadata());
    }

    public QCrudEntity(PathMetadata metadata) {
        super(CrudEntity.class, metadata);
    }

}

