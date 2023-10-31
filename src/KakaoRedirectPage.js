import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const KakaoRedirectPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const triedLogin = false;
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const code = searchParams.get('code');

        // 비동기로 데이터 가져오기
        axios.get(`http://localhost:8080/oauth/login/kakao?code=${code}`)
            .then(response => {
                const data = response.data;
                navigate('/chat', {
                    state: {
                        oauthId: data.oauthId.oauthServerId,
                        nickname: data.nickname,
                        profileImageUrl: data.profileImageUrl,
                    },
                });
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                // 에러 처리
            })
            .finally(() => {
                // 로딩이 끝났음을 표시
                setLoading(false);
            });
    }, [location, triedLogin]);

    if (loading) {
        return (
            <div>
                <div>Processing...</div>
            </div>
        );
    }

    return (
        <div>
            <div>Data Loaded!</div>
        </div>
    );
};

export default KakaoRedirectPage;
