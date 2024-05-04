import React from "react";
import styled, { keyframes } from "styled-components";
import RefreshIcon from "@mui/icons-material/Refresh";
import CheckIcon from "@mui/icons-material/Check";
import cx from "classnames";
import { motion, AnimatePresence } from "framer-motion";

const rotate = keyframes`
from {
transform: rotate(0deg);
}

to {
transform: rotate(360deg);
}
`;

const Container = styled.div`
display: flex;
justify-content: center;
align-items: center;
padding: 16px;
box-sizing: border-box;
`;

const brandColorPrimary = "#5b13df";
const RefreshButtonStyled = styled.button`
width: 2rem;
height: 2rem;
padding: 0;
margin: 0;
display: flex;
align-items: center;
justify-content: center;
position: relative;
cursor: pointer;
border-radius: 100%;
border: 0;
background: #fff;
outline-color: ${brandColorPrimary};

.refresh--icon.refresh--icon__is-refreshing {
animation: ${rotate} 1s infinite;
animation-timing-function: cubic-bezier(0.42, 0.2, 0.58, 1);
}
`;

const SuccessIcon = styled.div`
position: absolute;
`;

const RefreshButton = ({ refreshing, setRefreshing, showSuccess, setShowSuccess, handleRefresh, isRefreshing }) => {
    return (
        <Container>
            <RefreshButtonStyled onClick={handleRefresh}>
                <RefreshIcon
                    sx={{ color: brandColorPrimary }}
                    className={cx({
                        "refresh--icon": true,
                        "refresh--icon__is-refreshing": isRefreshing
                    })}
                />
                <SuccessIcon>
                    {showSuccess && (
                        <CheckIcon color="success" />
                    )}
                </SuccessIcon>
                <AnimatePresence>
                    {showSuccess && (
                        <SuccessIcon
                            initial={{ opacity: 0, y: 10, backgroundColor: "#ffffff00" }}
                            animate={{ pacity: 1, y: 0, backgroundColor: "#fff" }}
                            exit={{ opacity: 0, y: -10, backgroundColor: "#ffffff00" }}
                        >
                            <CheckIcon color="success" />
                        </SuccessIcon>
                    )}
                </AnimatePresence>
            </RefreshButtonStyled>
        </Container>
    );
};

export default RefreshButton;

