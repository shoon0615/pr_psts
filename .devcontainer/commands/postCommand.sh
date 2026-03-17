#!/usr/bin/env bash
echo "Changing owner of paths that mounted by named volumes"
sudo chown -R $USER:$USER $VOLUME_PATHS_TO_CHANGE_OWNER

echo "Updating apt package manager"
sudo apt update -y
sudo apt upgrade -y

# Python 패키지 제거 (agents SDK는 Node.js용이므로 불필요)
# pip install pyhwp six uv

# apt 패키지 제거 (사용 안 함)
# sudo apt install -y iputils-ping libreoffice poppler-utils

echo "Install global npm packages"
npm install -g npm@latest

# NestJS CLI 설치
echo "Installing NestJS CLI..."
npm install -g @nestjs/cli@11.0.7

# 설치 검증
echo "Verifying NestJS CLI installation..."
nest --version || {
    echo "ERROR: NestJS CLI installation failed!"
    exit 1
}

# 워크스페이스 패키지 설치 (Monorepo)
echo "Installing workspace dependencies..."
cd $containerWorkspaceFolder

# 루트 의존성 설치
#npm install

echo "Setup completed successfully!"