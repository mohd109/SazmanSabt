import styled from '@emotion/styled';
import React, { useEffect, useLayoutEffect } from 'react';
import { Github } from '../../icons/Github';
import { Typography } from './Typography';
import packageJson from '../../../package.json';
import axios, { AxiosResponse } from 'axios';

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({ children, collapsed, ...rest }) => {

  const StyledButton = styled.a`
padding: 5px 16px;
border-radius: 4px;
border: none;
cursor: pointer;
display: inline-block;
background-color: #fff;
color: #484848;
text-decoration: none;
`;

  const StyledSidebarFooter = styled.div`
width: 50%;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
padding: 20px;
border-radius: 8px;
color: white;
background: #26A17B;
`;

  const StyledCollapsedSidebarFooter = styled.a`
width: 40px;
height: 40px;
display: flex;
flex-direction: column;
align-items: center;
justify-content: center;
cursor: pointer;
border-radius: 50%;
color: white;
background: #26A17B;
`;
  const DEFAULT_OPTION = {
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true
  };
  async function sendPostRequest(body: any, endPoint: string): Promise<AxiosResponse> {
    let response = await axios.post(
      endPoint,
      body,
      DEFAULT_OPTION,
    );
    return response;
  }

  async function sendGetRequest(endPoint: string): Promise<AxiosResponse> {
    let response = await axios.get(
      endPoint,
      DEFAULT_OPTION,
    );
    return response;
  }

  const [userData, setUserData] = React.useState(null);
  const [userId,setUserId] = React.useState(-1);
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  async function getUserData() {
    if(!loginSuccess){
      let loginReponse: any = await sendPostRequest({ email: "mohd109@gmail.com", user_name: "mohd109", password: "Czin1231091256"}, "http://10.1.47.63:30001/api/login_user");
      setUserId(loginReponse.id);
      setLoginSuccess(true);
    }
    let response: AxiosResponse<any,any> = await sendGetRequest("http://10.1.47.63:30001/api/user/2" );
    if (response.status == 200) {
      return response.data;
    }
    return null;
  }

  useLayoutEffect(() => {
    getUserData().then(response => { setUserData(response as any) })
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        paddingBottom: '20px',
      }}
    >
      {collapsed ? (
        <StyledCollapsedSidebarFooter href='/profile' target="_blank">
          <Github size={28} url={userData == null ? '' : userData.image} />
        </StyledCollapsedSidebarFooter>
      ) : (
        <StyledSidebarFooter {...rest}>
          <div style={{ marginBottom: '12px' }}>
            <Github size={30} />
          </div>
          <Typography fontWeight={600}>{userData == null ? '' : userData.user_name}</Typography>
          <Typography variant="caption" style={{ letterSpacing: 1, opacity: 0.7 }}>
            Level {userData == null ? '' : userData.access_level}
          </Typography>
          <div style={{ marginTop: '16px' }}>
            <StyledButton href='/profile' target="_blank">
              <Typography variant="caption" color="#26A17B" fontWeight={600}>
                View Profile
              </Typography>
            </StyledButton>
          </div>
        </StyledSidebarFooter>
      )}
    </div>
  );
};
