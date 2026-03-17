package com.crud.domain.domains.entity.board;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoardLikeEntity is a Querydsl query type for BoardLikeEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardLikeEntity extends EntityPathBase<BoardLikeEntity> {

    private static final long serialVersionUID = 1957316947L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoardLikeEntity boardLikeEntity = new QBoardLikeEntity("boardLikeEntity");

    public final com.crud.domain.common.entity.QBaseEntity _super = new com.crud.domain.common.entity.QBaseEntity(this);

    public final QBoardEntity board;

    public final NumberPath<Long> boardId = createNumber("boardId", Long.class);

    //inherited
    public final StringPath createdBy = _super.createdBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> createdDate = _super.createdDate;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> deletedAt = _super.deletedAt;

    //inherited
    public final NumberPath<Long> id = _super.id;

    public final com.crud.domain.domains.entity.member.QMemberEntity member;

    public final StringPath memberId = createString("memberId");

    //inherited
    public final StringPath modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public QBoardLikeEntity(String variable) {
        this(BoardLikeEntity.class, forVariable(variable), INITS);
    }

    public QBoardLikeEntity(Path<? extends BoardLikeEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoardLikeEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoardLikeEntity(PathMetadata metadata, PathInits inits) {
        this(BoardLikeEntity.class, metadata, inits);
    }

    public QBoardLikeEntity(Class<? extends BoardLikeEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.board = inits.isInitialized("board") ? new QBoardEntity(forProperty("board"), inits.get("board")) : null;
        this.member = inits.isInitialized("member") ? new com.crud.domain.domains.entity.member.QMemberEntity(forProperty("member"), inits.get("member")) : null;
    }

}

