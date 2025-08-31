#!/usr/bin/env sh

# 에러 발생시 중단
set -e

# 빌드
npm run build

# 빌드 디렉토리로 이동
cd dist

# 커스텀 도메인을 사용한다면
# echo 'www.example.com' > CNAME

git init
git checkout -B main
git add -A
git commit -m 'deploy'

# https://github.com/<USERNAME>/<REPO>.git 에 푸시
# git push -f git@github.com:<USERNAME>/<REPO>.git main:gh-pages

cd -