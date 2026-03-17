package com.crud.domain.domains.entity.board;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoardTagEntity is a Querydsl query type for BoardTagEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardTagEntity extends EntityPathBase<BoardTagEntity> {

    private static final long serialVersionUID = -1039754748L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoardTagEntity boardTagEntity = new QBoardTagEntity("boardTagEntity");

    public final com.crud.domain.common.entity.QBaseEntity _super = new com.crud.domain.common.entity.QBaseEntity(this);

    public final QBoardEntity board;

    public final StringPath contents = createString("contents");

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> deletedAt = _super.deletedAt;

    //inherited
    public final NumberPath<Long> id = _super.id;

    //inherited
    public final StringPath modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public QBoardTagEntity(String variable) {
        this(BoardTagEntity.class, forVariable(variable), INITS);
    }

    public QBoardTagEntity(Path<? extends BoardTagEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoardTagEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoardTagEntity(PathMetadata metadata, PathInits inits) {
        this(BoardTagEntity.class, metadata, inits);
    }

    public QBoardTagEntity(Class<? extends BoardTagEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.board = inits.isInitialized("board") ? new QBoardEntity(forProperty("board"), inits.get("board")) : null;
    }

}

