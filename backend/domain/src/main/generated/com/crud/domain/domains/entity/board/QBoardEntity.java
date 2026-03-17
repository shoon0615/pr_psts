package com.crud.domain.domains.entity.board;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QBoardEntity is a Querydsl query type for BoardEntity
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QBoardEntity extends EntityPathBase<BoardEntity> {

    private static final long serialVersionUID = -2016321700L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QBoardEntity boardEntity = new QBoardEntity("boardEntity");

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

    public final ListPath<BoardLikeEntity, QBoardLikeEntity> like = this.<BoardLikeEntity, QBoardLikeEntity>createList("like", BoardLikeEntity.class, QBoardLikeEntity.class, PathInits.DIRECT2);

    public final com.crud.domain.domains.entity.member.QMemberEntity member;

    //inherited
    public final StringPath modifiedBy = _super.modifiedBy;

    //inherited
    public final DateTimePath<java.time.LocalDateTime> modifiedDate = _super.modifiedDate;

    public final ListPath<BoardReviewEntity, QBoardReviewEntity> review = this.<BoardReviewEntity, QBoardReviewEntity>createList("review", BoardReviewEntity.class, QBoardReviewEntity.class, PathInits.DIRECT2);

    public final ListPath<BoardTagEntity, QBoardTagEntity> tag = this.<BoardTagEntity, QBoardTagEntity>createList("tag", BoardTagEntity.class, QBoardTagEntity.class, PathInits.DIRECT2);

    public final StringPath title = createString("title");

    public QBoardEntity(String variable) {
        this(BoardEntity.class, forVariable(variable), INITS);
    }

    public QBoardEntity(Path<? extends BoardEntity> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QBoardEntity(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QBoardEntity(PathMetadata metadata, PathInits inits) {
        this(BoardEntity.class, metadata, inits);
    }

    public QBoardEntity(Class<? extends BoardEntity> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.member = inits.isInitialized("member") ? new com.crud.domain.domains.entity.member.QMemberEntity(forProperty("member"), inits.get("member")) : null;
    }

}

