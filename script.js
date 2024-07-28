document.getElementById('file-input').addEventListener('change', async (event) => {
  const fileInput = document.getElementById('file-input');
  const errorElement = document.getElementById('error');
  const uploadBox = document.getElementById('upload-box');
  const loader = document.getElementById('loader');

  // 파일 입력 요소에 파일이 선택되지 않은 경우 오류 메시지를 표시하고 함수를 종료합니다.
  if (!fileInput.files.length) {
    errorElement.textContent = 'Please select a file first';
    return;
  }

  const selectedFile = fileInput.files[0]; // 선택된 파일을 가져옵니다.
  const reader = new FileReader(); // FileReader 객체를 생성합니다.

  // 파일을 다 읽은 후 실행되는 onload 이벤트 핸들러를 정의합니다.
  reader.onload = async () => {
    const img = new Image();
    img.src = reader.result;
    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      // 캔버스 크기 설정
      const maxWidth = 400; document.getElementById('file-input').addEventListener('change', async (event) => {
        const fileInput = document.getElementById('file-input');
        const errorElement = document.getElementById('error');
        const uploadBox = document.getElementById('upload-box');
        const loader = document.getElementById('loader');
      
        // 파일 입력 요소에 파일이 선택되지 않은 경우 오류 메시지를 표시하고 함수를 종료합니다.
        if (!fileInput.files.length) {
          errorElement.textContent = 'Please select a file first';
          return;
        }
      
        const selectedFile = fileInput.files[0]; // 선택된 파일을 가져옵니다.
        const reader = new FileReader(); // FileReader 객체를 생성합니다.
      
        // 파일을 다 읽은 후 실행되는 onload 이벤트 핸들러를 정의합니다.
        reader.onload = async () => {
          const img = new Image();
          img.src = reader.result;
          img.onload = async () => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
      
            // 캔버스 크기 설정
            const maxWidth = 800; // 최대 너비
            const maxHeight = 800; // 최대 높이
            let width = img.width;
            let height = img.height;
      
            // 크기 조정
            if (width > height) {
              if (width > maxWidth) {
                height *= maxWidth / width;
                width = maxWidth;
              }
            } else {
              if (height > maxHeight) {
                width *= maxHeight / height;
                height = maxHeight;
              }
            }
            canvas.width = width;
            canvas.height = height;
      
            // 캔버스에 이미지 그리기
            ctx.drawImage(img, 0, 0, width, height);
      
            let compressedImageUrl;
            let quality = 0.9;
            do {
              compressedImageUrl = canvas.toDataURL('image/webp', quality);
              const byteString = atob(compressedImageUrl.split(',')[1]);
              const buffer = new ArrayBuffer(byteString.length);
              const view = new Uint8Array(buffer);
              for (let i = 0; i < byteString.length; i++) {
                view[i] = byteString.charCodeAt(i);
              }
              const blob = new Blob([view], { type: 'image/webp' });
              if (blob.size <= 100000) break;
              quality -= 0.1;
            } while (quality > 0.1);
      
            uploadBox.innerHTML = '<p>분석 중...</p>'; // 분석 중 메시지 표시
            loader.style.display = 'block'; // 로딩바 표시
      
            try {
              // 서버에 분석 요청을 보냅니다.
              const response = await fetch('https://port-0-kcal-back-lxlts66g89582f3b.sel5.cloudtype.app/analyze-image', {
                method: 'POST', // HTTP POST 메서드를 사용합니다.
                headers: {
                  'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 명시합니다.
                },
                body: JSON.stringify({ imageUrl: compressedImageUrl }), // 요청 본문에 이미지 URL을 JSON 형식으로 포함합니다.
              });
      
              const data = await response.json(); // 서버 응답을 JSON 형식으로 파싱합니다
      
              // 서버 응답이 성공적인 경우 분석 결과를 표시합니다.
              if (response.ok) {
                const markdownResult = marked.parse(data.analysis); // 마크다운을 HTML로 변환합니다.
                uploadBox.innerHTML = `<p>- 결과 -</p>${markdownResult}`;
                errorElement.textContent = ''; // 오류 메시지를 비웁니다.
              } else {
                errorElement.textContent = data.error; // 서버 응답에 오류 메시지가 포함된 경우 이를 표시합니다.
              }
            } catch (error) {
              // 요청 중에 발생한 오류를 처리합니다.
              console.error('에러 발생:', error);
              errorElement.textContent = '에러 발생';
            } finally {
              loader.style.display = 'none'; // 로딩바 숨기기
            }
          };
        };
      
        reader.readAsDataURL(selectedFile); // 선택된 파일을 데이터 URL로 읽습니다.
      });
      // 최대 너비
      const maxHeight = 400; // 최대 높이
      let width = img.width;
      let height = img.height;

      // 크기 조정
      if (width > height) {
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
      }
      canvas.width = width;
      canvas.height = height;

      // 캔버스에 이미지 그리기
      ctx.drawImage(img, 0, 0, width, height);

      // PNG 형식으로 압축된 이미지 URL 가져오기
      const compressedImageUrl = canvas.toDataURL('image/png', 0.8);

      uploadBox.innerHTML = '<p>분석 중...</p>'; // 분석 중 메시지 표시
      loader.style.display = 'block'; // 로딩바 표시

      try {
        // 서버에 분석 요청을 보냅니다.
        const response = await fetch('http://localhost:3000/analyze-image', {
          method: 'POST', // HTTP POST 메서드를 사용합니다.
          headers: {
            'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 명시합니다.
          },
          body: JSON.stringify({ imageUrl: compressedImageUrl }), // 요청 본문에 이미지 URL을 JSON 형식으로 포함합니다.
        });

        const data = await response.json(); // 서버 응답을 JSON 형식으로 파싱합니다

        // 서버 응답이 성공적인 경우 분석 결과를 표시합니다.
        if (response.ok) {
          const markdownResult = marked.parse(data.analysis); // 마크다운을 HTML로 변환합니다.
          uploadBox.innerHTML = `<p>- 결과 -</p>${markdownResult}`;
          errorElement.textContent = ''; // 오류 메시지를 비웁니다.
        } else {
          errorElement.textContent = data.error; // 서버 응답에 오류 메시지가 포함된 경우 이를 표시합니다.
        }
      } catch (error) {
        // 요청 중에 발생한 오류를 처리합니다.
        console.error('에러 발생:', error);
        errorElement.textContent = '에러 발생';
      } finally {
        loader.style.display = 'none'; // 로딩바 숨기기
      }
    };
  };

  reader.readAsDataURL(selectedFile); // 선택된 파일을 데이터 URL로 읽습니다.
});
