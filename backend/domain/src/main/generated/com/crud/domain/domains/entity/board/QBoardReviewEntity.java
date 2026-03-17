package com.crud.domain.domains.entity.board;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoardReviewEntity is a Querydsl query type for BoardReviewEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardReviewEntity extends EntityPathBase<BoardReviewEntity> {

    private static final long serialVersionUID = 643703316L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoardReviewEntity boardReviewEntity = new QBoardReviewEntity("boardReviewEntity");

    public final com.crud.domain.common.entity.QBaseEntity _super = new com.crud.domain.common.entity.QBaseEntity(this);

    public final QBoardEntity board;

    public final NumberPath<Long> boardId = createNumber("boardId", Long.class);

    public final StringPath contents = createString("contents");

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

    public QBoardReviewEntity(String variable) {
        this(BoardReviewEntity.class, forVariable(variable), INITS);
    }

    public QBoardReviewEntity(Path<? extends BoardReviewEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoardReviewEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoardReviewEntity(PathMetadata metadata, PathInits inits) {
        this(BoardReviewEntity.class, metadata, inits);
    }

    public QBoardReviewEntity(Class<? extends BoardReviewEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.board = inits.isInitialized("board") ? new QBoardEntity(forProperty("board"), inits.get("board")) : null;
        this.member = inits.isInitialized("member") ? new com.crud.domain.domains.entity.member.QMemberEntity(forProperty("member"), inits.get("member")) : null;
    }

}

