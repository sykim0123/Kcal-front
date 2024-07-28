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
  
    // 파일을 다 읽은 후 실행되는 onloadend 이벤트 핸들러를 정의합니다.
    reader.onloadend = async () => {
      const imageUrl = reader.result; // 파일의 데이터 URL을 가져옵니다.
      uploadBox.innerHTML = '<p>분석 중...</p>'; // 분석 중 메시지 표시
      loader.style.display = 'block'; // 로딩바 표시
  
      try {
        // 서버에 분석 요청을 보냅니다.
        const response = await fetch('http://localhost:3000/analyze-image', {
          method: 'POST', // HTTP POST 메서드를 사용합니다.
          headers: {
            'Content-Type': 'application/json', // 요청 본문이 JSON 형식임을 명시합니다.
          },
          body: JSON.stringify({ imageUrl }), // 요청 본문에 이미지 URL을 JSON 형식으로 포함합니다.
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
  
    reader.readAsDataURL(selectedFile); // 선택된 파일을 데이터 URL로 읽습니다.
  });
  