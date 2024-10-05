import styled from "@emotion/styled";
import React, { useEffect, useLayoutEffect } from "react";
import { Github } from "../../icons/Github";
import { Typography } from "./Typography";
import packageJson from "../../../package.json";
import axios, { AxiosResponse } from "axios";
import { DUMMYDATA } from "../../constants/dummyData";
import { useTranslation } from "react-i18next";

interface SidebarFooterProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
  collapsed?: boolean;
}

export const SidebarFooter: React.FC<SidebarFooterProps> = ({
  children,
  collapsed,
  ...rest
}) => {
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
    background: #26a17b;
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
    background: #26a17b;
  `;
  const DEFAULT_OPTION = {
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  };
  const { i18n, t } = useTranslation();

  async function sendPostRequest(
    body: any,
    endPoint: string
  ): Promise<AxiosResponse> {
    let response = await axios.post(endPoint, body, DEFAULT_OPTION);
    return response;
  }

  async function sendGetRequest(endPoint: string): Promise<AxiosResponse> {
    let response = await axios.get(endPoint, DEFAULT_OPTION);
    return response;
  }

  const [userData, setUserData] = React.useState(null);
  const [userId, setUserId] = React.useState(-1);
  const [loginSuccess, setLoginSuccess] = React.useState(false);

  async function login() {
    if (!loginSuccess) {
      let loginReponse: any = await sendPostRequest(
        {
          email: "mohd109@gmail.com",
          user_name: "mohd109",
          password: "Czin1231091256",
        },
        "https://main.sabt.shankayi.ir/api/login_user"
      );
      setUserId(loginReponse.id);
      setLoginSuccess(true);
      return loginReponse.id;
    }
    return userId;
  }

  async function getUserData() {
    let tempUserId = await login();

    try {
      console.log("sidebar");

      let response: AxiosResponse<any, any> = await sendGetRequest(
        "https://main.sabt.shankayi.ir/api/user/" + tempUserId.toString()
      );
      console.log(response.status, "response.status");

      if (response.status == 200) {
        return response.data;
      }
    } catch {
      return DUMMYDATA.userData.data;
    }
  }

  useLayoutEffect(() => {
    getUserData().then((response) => {
      console.log(response);
      setUserData(response as any);
    });
  }, [userId]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        paddingBottom: "20px",
      }}
    >
      {collapsed ? (
        <StyledCollapsedSidebarFooter href="https://panel.sabt.shankayi.ir" target="_blank">
          <Github size={28} url={userData == null ? "" : userData.image} />
        </StyledCollapsedSidebarFooter>
      ) : (
        <StyledSidebarFooter {...rest}>
          <div style={{ marginBottom: "12px" }}>
            <Github size={30} />
          </div>
          <Typography fontWeight={600}>
            {userData == null ? "" : userData.user_name}
          </Typography>
          <Typography
            variant="caption"
            style={{ letterSpacing: 1, opacity: 0.7 }}
          >
            Level {userData == null ? "" : userData.access_level}
          </Typography>
          <div style={{ marginTop: "16px" }}>
            <StyledButton href="https://panel.sabt.shankayi.ir" target="_blank">
              <Typography variant="caption" color="#26A17B" fontWeight={600}>
                {t("viewProfile")}
              </Typography>
            </StyledButton>
          </div>
        </StyledSidebarFooter>
      )}
    </div>
  );
};
