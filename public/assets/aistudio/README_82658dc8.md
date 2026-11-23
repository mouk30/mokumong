# coupongame.best — GitHub Pages 배포 파일

이 폴더는 현재 공개 사이트에서 회수한 **정적 배포본**입니다. 원본 React/Vite 편집 소스가 아니라, 브라우저에서 실행되는 배포 HTML/JS/CSS와 공개 미디어 파일이 포함되어 있습니다. 기능과 화면을 수정하려면 원본 소스가 별도로 필요합니다.

## GitHub에 올리기

1. 이 ZIP을 풀고 **압축 해제된 폴더 안의 모든 파일**을 GitHub 저장소 최상위에 올립니다. `index.html`, `assets/`, `manus-storage/`, `CNAME`이 저장소 루트에 있어야 합니다.
2. 저장소에서 **Settings → Pages → Build and deployment**로 이동합니다. 배포 소스를 `Deploy from a branch`, 브랜치 `main`, 폴더 `/(root)`로 지정하고 저장합니다.
3. Pages의 Custom domain에 `coupongame.best`가 표시되는지 확인하고 HTTPS가 활성화될 때까지 기다립니다. 저장소에는 `CNAME` 파일도 포함되어 있습니다.

## Cloudflare DNS

GitHub Pages로 사이트를 제공하려면 Cloudflare DNS에서 기존 웹사이트 연결 레코드를 GitHub Pages 대상으로 바꿔야 합니다. apex 도메인(`@`)에는 GitHub Pages의 A 레코드 4개를 설정합니다: `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`. `www`를 사용할 경우 `www` CNAME을 `YOUR-GITHUB-USERNAME.github.io`로 지정하고 사용자 이름을 바꿉니다. 이메일을 사용하는 경우 MX/TXT 레코드는 삭제하지 마세요.

## 유의사항

이 패키지는 2026-11-23에 공개된 페이지에서 가져온 정적 빌드입니다. 홈페이지 데이터 및 화면은 당시 공개된 버전이며, Manus 편집기나 백엔드에 연결된 기능이 있다면 정적 호스팅에서 동일하게 동작한다고 보장할 수 없습니다. 상세 경로는 SPA 호환용 `404.html`을 포함합니다.
