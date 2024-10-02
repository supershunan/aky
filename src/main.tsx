import { createRoot } from "react-dom/client";
import { ConfigProvider } from "antd";
import dayjs from "dayjs";
import "dayjs/locale/zh-cn";
import zhCN from "antd/locale/zh_CN";
import "antd/dist/reset.css";
import App from "./App.tsx";
import "./index.css";

dayjs.locale("zh-cn");

createRoot(document.getElementById("root")!).render(
  <ConfigProvider locale={zhCN}>
    <App />
  </ConfigProvider>
);
