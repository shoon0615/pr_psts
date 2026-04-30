# PostgreSQL

직접 실행해보지는 않았기에 잘못된 정보가 있을 수 있읍니다...

---

## 이중화(HA: High Availability)

서비스가 멈추지 않게 만들려면, 가장 먼저 생각해야 할 게 바로 이중화(High Availability)에요.
특히 DB가 한 대만 돌아가고 있다면? 그게 죽는 순간 서비스도 같이 멈춰버립니다. 😨

### 구성 요소

- Master : 실제 데이터 존재 및 읽기/쓰기를 처리하는 주 서버
- Slave : 실제 데이터를 복제받아 대기하는 보조 서버(주 서버 문제 시 역할 대체)
- Repmgr : Master ⮂ Slave 가 서로 통신하는 내부 네트워크(장애 감지, 복제)

---

### 1. 단순 복제(Streaming Replication)

❌ HA 방식  
`bitnami/postgresql` 내장된 replication 설정을 통한 DB 복제 방식  
별도의 장애 감지 없이 View(가상 테이블) 기능만 수행

```yml
# docker-compose-master.yml
services:
  postgresql-master:
    image: bitnami/postgresql
    restart: always
    ports:
      - '5432:5432'
    volumes:
      - [volume name]:/bitnami/postgresql
    environment:
      - POSTGRESQL_PGAUDIT_LOG=READ,WRITE
      - POSTGRESQL_LOG_HOSTNAME=true
      - POSTGRESQL_REPLICATION_MODE=master
      - POSTGRESQL_REPLICATION_USER=[replication user id]
      - POSTGRESQL_REPLICATION_PASSWORD=[replication user password]
      - POSTGRESQL_USERNAME=[db user name]
      - POSTGRESQL_PASSWORD=[db user password]
      - POSTGRESQL_DATABASE=[db name]
      - ALLOW_EMPTY_PASSWORD=yes
    networks:
      - [network name]
volumes:
  [volume name]:    # 서버에 도커 볼륨이 있는 경우 해당 볼륨 사용
    external: true
networks:
  [network name]:   # 서버에 도커 네트워크가 있는 경우 해당 네트워크 사용
    external: true

# docker-compose-slave.yaml
services:
  postgresql-slave:
    image: bitnami/postgresql
    restart: always
    volumes:
      - [volume name]:/bitnami/postgresql
    ports:
      - '5432:5432'
    environment:
      - POSTGRESQL_PASSWORD=[PostgreSQL Password]
      - POSTGRESQL_MASTER_HOST=[Master 서버의 IP 주소]
      - POSTGRESQL_PGAUDIT_LOG=READ
      - POSTGRESQL_LOG_HOSTNAME=true
      - POSTGRESQL_REPLICATION_MODE=slave
      - POSTGRESQL_REPLICATION_USER=[replication user id]
      - POSTGRESQL_REPLICATION_PASSWORD=[replication user password]
      - POSTGRESQL_MASTER_PORT_NUMBER=5432   # [Master server postgres port]
      - ALLOW_EMPTY_PASSWORD=yes
    networks:
      - [network name]
volumes:
  [volume name]:
    external: true
networks:
  [network name]:
    external: true
```

`출처` [도커를 이용한 PostgreSQL (원격&로컬) 연동](https://cori.tistory.com/361)

[도커를 이용한 PostgreSQL (원격&로컬) 연동]: # "https://github.com/shoon0615/pr_psts/blob/main/temp/docs/config/postgres/sample1.mhtml"

### 2. 복제 클러스터 구성 방식(primary + standby)

⚠️ HA 방식(일부)  
`bitnami/postgresql-repmgr` 장애 시 역할 전환까지 수행  
하지만 App 접속까지 자동 HA 처리하는 완성형 구성은 아님

```yml
services:
  pg-primary:
    # image:
    #   registry: docker.io
    #   repository: bitnami/postgresql-repmgr
    #   tag: latest
    # image: bitnami/postgresql-repmgr:16   # 지원중단된 서비스(Legacy)
    image: bitnamilegacy/postgresql-repmgr:latest
    container_name: pg-primary
    ports:
      - "5432:5432"
    environment:
      - POSTGRESQL_POSTGRES_PASSWORD=admin123
      - POSTGRESQL_USERNAME=bn_postgres
      - POSTGRESQL_PASSWORD=bitnami123
      - POSTGRESQL_DATABASE=mydb
      - REPMGR_NODE_ID=1
      - REPMGR_NODE_NAME=pg-primary-1
      - REPMGR_NODE_NETWORK_NAME=pg-primary
      # - REPMGR_PARTNER_NODES=pg-primary:5432,pg-standby:5433
      - REPMGR_PARTNER_NODES=pg-primary:5432,pg-standby:5432
      - REPMGR_PRIMARY_HOST=pg-primary
      - REPMGR_PRIMARY_PORT=5432
      - REPMGR_USERNAME=repmgr
      - REPMGR_PASSWORD=repmgr123
    volumes:
      - primary_data:/bitnami/postgresql
    networks:
      - repmgr

  pg-standby:
    image: bitnamilegacy/postgresql-repmgr:latest
    container_name: pg-standby
    ports:
      - "5433:5432"
    environment:
      - POSTGRESQL_POSTGRES_PASSWORD=admin123
      - POSTGRESQL_USERNAME=bn_postgres
      - POSTGRESQL_PASSWORD=bitnami123
      - POSTGRESQL_DATABASE=mydb
      - REPMGR_NODE_ID=2
      - REPMGR_NODE_NAME=pg-standby-1
      - REPMGR_NODE_NETWORK_NAME=pg-standby
      # - REPMGR_PARTNER_NODES=pg-primary:5432,pg-standby:5433
      - REPMGR_PARTNER_NODES=pg-primary:5432,pg-standby:5432
      - REPMGR_PRIMARY_HOST=pg-primary
      - REPMGR_PRIMARY_PORT=5432
      - REPMGR_USERNAME=repmgr
      - REPMGR_PASSWORD=repmgr123
    volumes:
      - standby_data:/bitnami/postgresql
    networks:
      - repmgr
    depends_on:
      - pg-primary

volumes:
  primary_data:
  standby_data:

networks:
  repmgr:
    # external: true
    driver: bridge
```

`출처` [Docker + Bitnami로 구성하는 PostgreSQL 이중화](https://velog.io/@lyricode1008/Docker-Bitnami%EB%A1%9C-%EA%B5%AC%EC%84%B1%ED%95%98%EB%8A%94-PostgreSQL-%EC%9D%B4%EC%A4%91%ED%99%94)

[Docker + Bitnami로 구성하는 PostgreSQL 이중화]: # "https://github.com/shoon0615/pr_psts/blob/main/temp/docs/config/postgres/sample2.mhtml"

### 3. HA 자동 장애 전환(App까지 자동 failover)

✅ HA 방식(Kubernetes)  
App → Pgpool-II / HAProxy → 항상 현재 primary(PostgreSQL) 로 자동 연결  
까지 하려면 Pgpool-II 또는 HAProxy를 추가해야 합니다.  
👉 장애 전환(failover) 시 자동 라우팅

- `repmgr` DB 노드 역할 관리
- `Pgpool-II / HAProxy` App 접속 라우팅

```
helm repo add bitnami https://charts.bitnami.com/bitnami
helm pull oci://registry-1.docker.io/bitnamicharts/postgresql-ha --version 16.3.2
```

```yml
# vaules.yml
postgresql:
  image:
  registry: docker.io
    repository: bitnamilegacy/postgresql-repmgr
    tag: 17.6.0-debian-12-r2
   username: [db user name]
   password: [db user password]
   database: [db name]
   postgresPassword: [db super password] # 슈퍼 유저의 패스워드 입력

pgpool:
  image:
    registry: docker.io
    repository: bitnamilegacy/pgpool
    tag: 4.6.3-debian-12-r0
  adminUsername: admin
  adminPassword: [db admin password]
  srCheckUsername: "sr_check_user"
  srCheckPassword: [db sr password]
  srCheckDatabase: postgres

persistence:
  enabled: true
    storageClass: [storageClass name]
    accessModes:
      - ReadWriteOnce
        size: 20Gi
```

`출처` [Kubernetes에 Bitnami PostgreSQL(HA) 배포 가이드](https://ksh-cloud.tistory.com/186)

[Kubernetes에 Bitnami PostgreSQL(HA) 배포 가이드]: # "https://github.com/shoon0615/pr_psts/blob/main/temp/docs/config/postgres/sample3.mhtml"

---

## Docker Hub

### 1. ✅ postgres

- https://hub.docker.com/_/postgres  
  **`✅ Docker Official Image`** 가장 일반적인 Docker 공식 PostgreSQL 단일 DB

### 2. bitnami/postgresql

- https://hub.docker.com/r/bitnami/postgresql  
  Bitnami PostgreSQL 단일 DB  
  PostgreSQL 자체는 동일하지만 Bitnami 방식의 환경변수, 디렉터리 구조, 보안 기본값이 적용

### 3. bitnami/postgresql-repmgr

- https://hub.docker.com/r/bitnami/postgresql-repmgr  
  ❗현재 Docker Hub 무료 사용 제한 있음 -> bitnamilegacy/postgresql-repmgr 로 이용 필요(기존 리소스)
- https://hub.docker.com/r/bitnamilegacy/postgresql-repmgr

### 4. bitnamicharts/postgresql

- https://hub.docker.com/r/bitnamicharts/postgresql  
  ⚠️ OCI/Helm Chart 아티팩트 Kubernetes Helm 배포용  
  ❌ compose용 아님
- https://artifacthub.io/packages/helm/bitnami/postgresql-ha

### 5. Docker Hardened Image dhi/postgres

- https://hub.docker.com/hardened-images/catalog/dhi/postgres  
  **`✅ Docker Hardened Image`** 보안 강화 PostgreSQL 이미지  
  DB 목적으로도 사용은 가능하지만 운영/보안 목적
