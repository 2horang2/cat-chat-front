import React, { useState } from 'react';

const LoginPage = () => {
    const [isButtonDisabled, setIsButtonDisabled] = useState(false);

    const handleButtonClick = () => {
        if (!isButtonDisabled) {
            setIsButtonDisabled(true);
            window.location.href = 'http://localhost:8080/oauth/kakao';
        }
    };

    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <button
                onClick={handleButtonClick}
                style={{
                    padding: '10px 20px',
                    fontSize: '18px',
                    borderRadius: '5px',
                    cursor: isButtonDisabled ? 'not-allowed' : 'pointer',
                    backgroundColor: isButtonDisabled ? 'gray' : 'transparent',
                }}
                disabled={isButtonDisabled}
            >
                카카오톡 로그인
            </button>
        </div>
    );
};

export default LoginPage;
